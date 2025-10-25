Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:3000", "http://localhost:3001", "http://localhost:4000"
    resource "*",
      headers: :any,
      expose: ["Authorization"],
      methods: [:get, :post, :patch, :put, :delete, :options, :head],
      credentials: true
  end
end