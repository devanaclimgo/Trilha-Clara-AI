class ApplicationController < ActionController::API
  include Devise::Controllers::Helpers
  respond_to :json
end
