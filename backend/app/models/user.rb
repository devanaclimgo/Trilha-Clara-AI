class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :tccs, dependent: :destroy

  validates :name, presence: true

  def jwt_payload
    { sub: id.to_s }
  end
end