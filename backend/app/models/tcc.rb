class Tcc < ApplicationRecord
  belongs_to :user

  # Campos de conteúdo do trabalho
  validates :tema, presence: true
  validates :tipo_trabalho, presence: true
  validates :curso, presence: true
  validates :nome, presence: true
  validates :faculdade, presence: true

  # Campos de conteúdo (opcionais) - Limites aumentados para trabalhos acadêmicos reais
  validates :resumo, length: { maximum: 10000 }, allow_blank: true
  validates :introducao, length: { maximum: 50000 }, allow_blank: true
  validates :objetivos, length: { maximum: 10000 }, allow_blank: true
  validates :justificativa, length: { maximum: 10000 }, allow_blank: true
  validates :metodologia, length: { maximum: 10000 }, allow_blank: true
  validates :desenvolvimento, length: { maximum: 100000 }, allow_blank: true
  validates :conclusao, length: { maximum: 50000 }, allow_blank: true
  validates :referencias, length: { maximum: 20000 }, allow_blank: true
end
