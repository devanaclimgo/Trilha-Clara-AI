# =====================================================
# MODELOS DO RAILS - TCC EFFORTLESS
# =====================================================

# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  
  has_many :tccs, dependent: :destroy
  has_many :tcc_content, through: :tccs
  has_many :tcc_custom_sections, through: :tccs
  has_many :tcc_section_labels, through: :tccs
  has_many :tcc_field_order, through: :tccs
  has_many :tcc_ai_explanations, through: :tccs
  has_many :tcc_ai_structures, through: :tccs
  has_many :tcc_ai_timelines, through: :tccs
  has_many :tcc_notes, through: :tccs
  has_many :tcc_content_history, through: :tccs
  has_many :tcc_settings, through: :tccs
  has_one :user_preference, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :nome, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  before_create :set_default_preferences

  def stats
    {
      total_tccs: tccs.count,
      completed_tccs: tccs.where(status: 'completed').count,
      in_progress_tccs: tccs.where(status: 'in_progress').count,
      draft_tccs: tccs.where(status: 'draft').count,
      last_tcc_created: tccs.maximum(:created_at)
    }
  end

  private

  def set_default_preferences
    build_user_preference(preferences: {})
  end
end

# app/models/tcc.rb
class Tcc < ApplicationRecord
  belongs_to :user
  has_one :tcc_content, dependent: :destroy
  has_many :tcc_custom_sections, dependent: :destroy
  has_many :tcc_section_labels, dependent: :destroy
  has_one :tcc_field_order, dependent: :destroy
  has_many :tcc_ai_explanations, dependent: :destroy
  has_one :tcc_ai_structure, dependent: :destroy
  has_one :tcc_ai_timeline, dependent: :destroy
  has_many :tcc_notes, dependent: :destroy
  has_many :tcc_content_history, dependent: :destroy
  has_one :tcc_setting, dependent: :destroy

  validates :titulo, presence: true
  validates :status, inclusion: { in: %w[draft in_progress completed archived] }
  validates :tipo_trabalho, presence: true

  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  after_create :initialize_content
  after_create :initialize_settings

  def content_data
    tcc_content&.attributes&.except('id', 'tcc_id', 'created_at', 'updated_at') || {}
  end

  def custom_sections_data
    tcc_custom_sections.order(:order_index).map do |section|
      {
        key: section.section_key,
        label: section.title,
        description: section.description,
        content: section.content,
        order: section.order_index
      }
    end
  end

  def field_labels_data
    tcc_section_labels.index_by(&:section_id).transform_values(&:label)
  end

  def field_order_data
    tcc_field_order&.field_order || []
  end

  def ai_data
    {
      explanations: tcc_ai_explanations.index_by(&:explanation_type).transform_values(&:content),
      structure: tcc_ai_structure&.structure_data,
      timeline: tcc_ai_timeline&.timeline_data
    }
  end

  def save_content_snapshot(change_type = 'content', description = nil)
    tcc_content_history.create!(
      content_snapshot: {
        content: content_data,
        custom_sections: custom_sections_data,
        field_labels: field_labels_data,
        field_order: field_order_data
      },
      change_type: change_type,
      change_description: description
    )
  end

  private

  def initialize_content
    create_tcc_content!
  end

  def initialize_settings
    create_tcc_setting!(settings: {})
  end
end

# app/models/tcc_content.rb
class TccContent < ApplicationRecord
  belongs_to :tcc

  validates :tcc_id, uniqueness: true

  def update_content(field, value)
    update(field => value)
    tcc.save_content_snapshot('content', "Updated #{field}")
  end
end

# app/models/tcc_custom_section.rb
class TccCustomSection < ApplicationRecord
  belongs_to :tcc

  validates :section_key, presence: true, uniqueness: { scope: :tcc_id }
  validates :title, presence: true
  validates :order_index, presence: true, numericality: { greater_than_or_equal_to: 0 }

  after_save :save_content_snapshot
  after_destroy :save_content_snapshot

  private

  def save_content_snapshot
    tcc.save_content_snapshot('structure', "Custom section #{section_key} modified")
  end
end

# app/models/tcc_section_label.rb
class TccSectionLabel < ApplicationRecord
  belongs_to :tcc

  validates :section_id, presence: true, uniqueness: { scope: :tcc_id }
  validates :label, presence: true

  after_save :save_content_snapshot
  after_destroy :save_content_snapshot

  private

  def save_content_snapshot
    tcc.save_content_snapshot('structure', "Section label #{section_id} updated")
  end
end

# app/models/tcc_field_order.rb
class TccFieldOrder < ApplicationRecord
  belongs_to :tcc

  validates :tcc_id, uniqueness: true
  validates :field_order, presence: true

  after_save :save_content_snapshot

  private

  def save_content_snapshot
    tcc.save_content_snapshot('structure', 'Field order updated')
  end
end

# app/models/tcc_ai_explanation.rb
class TccAiExplanation < ApplicationRecord
  belongs_to :tcc

  validates :explanation_type, presence: true, uniqueness: { scope: :tcc_id }
  validates :content, presence: true

  TYPES = %w[simplified detailed technical].freeze
  validates :explanation_type, inclusion: { in: TYPES }
end

# app/models/tcc_ai_structure.rb
class TccAiStructure < ApplicationRecord
  belongs_to :tcc

  validates :tcc_id, uniqueness: true
  validates :structure_data, presence: true

  def structure_items
    structure_data || []
  end

  def add_structure_item(title, description)
    new_item = { titulo: title, descricao: description }
    update(structure_data: (structure_items + [new_item]))
  end
end

# app/models/tcc_ai_timeline.rb
class TccAiTimeline < ApplicationRecord
  belongs_to :tcc

  validates :tcc_id, uniqueness: true
  validates :timeline_data, presence: true

  def timeline_items
    timeline_data || []
  end

  def add_timeline_item(task, start_date, end_date, description = nil)
    new_item = {
      task: task,
      start_date: start_date,
      end_date: end_date,
      description: description
    }
    update(timeline_data: (timeline_items + [new_item]))
  end
end

# app/models/tcc_note.rb
class TccNote < ApplicationRecord
  belongs_to :tcc

  validates :content, presence: true
  validates :note_type, inclusion: { in: %w[general meeting reminder idea] }

  scope :important, -> { where(is_important: true) }
  scope :by_type, ->(type) { where(note_type: type) }
  scope :due_soon, -> { where('due_date <= ?', 7.days.from_now) }
end

# app/models/tcc_content_history.rb
class TccContentHistory < ApplicationRecord
  belongs_to :tcc

  validates :content_snapshot, presence: true
  validates :change_type, presence: true

  scope :recent, -> { order(created_at: :desc) }
  scope :by_type, ->(type) { where(change_type: type) }
end

# app/models/user_preference.rb
class UserPreference < ApplicationRecord
  belongs_to :user

  validates :user_id, uniqueness: true
  validates :preferences, presence: true

  def get_preference(key, default = nil)
    preferences[key.to_s] || default
  end

  def set_preference(key, value)
    self.preferences = preferences.merge(key.to_s => value)
    save!
  end
end

# app/models/tcc_setting.rb
class TccSetting < ApplicationRecord
  belongs_to :tcc

  validates :tcc_id, uniqueness: true
  validates :settings, presence: true

  def get_setting(key, default = nil)
    settings[key.to_s] || default
  end

  def set_setting(key, value)
    self.settings = settings.merge(key.to_s => value)
    save!
  end
end

# =====================================================
# SERIALIZERS PARA API
# =====================================================

# app/serializers/tcc_serializer.rb
class TccSerializer
  include JSONAPI::Serializer

  attributes :id, :titulo, :tema, :area_conhecimento, :tipo_trabalho, :status, 
             :prazo_entrega, :orientador_nome, :orientador_email, :instituicao, 
             :curso, :created_at, :updated_at

  attribute :content_data do |tcc|
    tcc.content_data
  end

  attribute :custom_sections do |tcc|
    tcc.custom_sections_data
  end

  attribute :field_labels do |tcc|
    tcc.field_labels_data
  end

  attribute :field_order do |tcc|
    tcc.field_order_data
  end

  attribute :ai_data do |tcc|
    tcc.ai_data
  end

  attribute :stats do |tcc|
    {
      total_notes: tcc.tcc_notes.count,
      important_notes: tcc.tcc_notes.important.count,
      history_entries: tcc.tcc_content_history.count
    }
  end

  belongs_to :user
  has_many :tcc_notes
end

# app/serializers/user_serializer.rb
class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :email, :nome, :instituicao, :curso, :telefone, :avatar_url,
             :is_active, :email_verified, :created_at, :last_login

  attribute :stats do |user|
    user.stats
  end

  has_many :tccs
end

# =====================================================
# SERVICES PARA LÓGICA DE NEGÓCIO
# =====================================================

# app/services/tcc_content_service.rb
class TccContentService
  def initialize(tcc)
    @tcc = tcc
  end

  def update_content(content_params)
    @tcc.tcc_content.update!(content_params)
    @tcc.save_content_snapshot('content', 'Content updated')
  end

  def add_custom_section(title, description = nil)
    next_key = "custom_#{@tcc.tcc_custom_sections.count}"
    next_order = @tcc.tcc_custom_sections.maximum(:order_index).to_i + 1

    section = @tcc.tcc_custom_sections.create!(
      section_key: next_key,
      title: title,
      description: description,
      order_index: next_order
    )

    @tcc.save_content_snapshot('structure', "Added custom section: #{title}")
    section
  end

  def update_section_label(section_id, label)
    section_label = @tcc.tcc_section_labels.find_or_initialize_by(section_id: section_id)
    section_label.label = label
    section_label.save!
    @tcc.save_content_snapshot('structure', "Updated section label: #{section_id}")
  end

  def update_field_order(field_order)
    field_order_record = @tcc.tcc_field_order || @tcc.create_tcc_field_order!(field_order: [])
    field_order_record.update!(field_order: field_order)
    @tcc.save_content_snapshot('structure', 'Field order updated')
  end

  def get_complete_content
    {
      content: @tcc.content_data,
      custom_sections: @tcc.custom_sections_data,
      field_labels: @tcc.field_labels_data,
      field_order: @tcc.field_order_data
    }
  end
end

# app/services/ai_data_service.rb
class AiDataService
  def initialize(tcc)
    @tcc = tcc
  end

  def save_explanation(type, content)
    explanation = @tcc.tcc_ai_explanations.find_or_initialize_by(explanation_type: type)
    explanation.content = content
    explanation.save!
  end

  def save_structure(structure_data)
    structure = @tcc.tcc_ai_structure || @tcc.build_tcc_ai_structure
    structure.structure_data = structure_data
    structure.save!
  end

  def save_timeline(timeline_data, total_weeks = nil)
    timeline = @tcc.tcc_ai_timeline || @tcc.build_tcc_ai_timeline
    timeline.timeline_data = timeline_data
    timeline.total_weeks = total_weeks
    timeline.save!
  end
end
