#!/usr/bin/env ruby

require 'faraday'
require 'json'
require 'dotenv'

# Load environment variables from .env file
Dotenv.load

# Teste direto da API do Gemini
api_key = ENV["GEMINI_API_KEY"]
puts "API Key: #{api_key ? 'Presente' : 'Ausente'}"

if api_key.nil? || api_key.empty?
  puts "ERRO: GEMINI_API_KEY não está configurada!"
  exit 1
end

# Teste direto com Faraday
client = Faraday.new(
  url: "https://generativelanguage.googleapis.com/v1beta/models",
  params: { key: api_key },
  headers: { "Content-Type" => "application/json" }
)

puts "Testando conexão com Gemini API..."

begin
  # First, let's check what models are available
  puts "Verificando modelos disponíveis..."
  models_response = client.get("")
  
  if models_response.status == 200
    models_data = JSON.parse(models_response.body)
    puts "Modelos disponíveis:"
    models_data["models"]&.each do |model|
      puts "  - #{model["name"]}"
    end
  end
  
  # Try with the correct model name
  response = client.post("gemini-2.5-flash:generateContent") do |req|
    req.body = {
      contents: [{ role: "user", parts: [{ text: "Olá, você está funcionando?" }] }],
      generationConfig: { maxOutputTokens: 100 }
    }.to_json
  end

  puts "Status da resposta: #{response.status}"
  puts "Headers: #{response.headers}"
  puts "Body da resposta:"
  puts response.body

  if response.status == 200
    body = JSON.parse(response.body)
    puts "JSON parseado:"
    puts JSON.pretty_generate(body)
    
    text = body.dig("candidates", 0, "content", "parts", 0, "text")
    puts "Texto extraído: #{text}"
  else
    puts "ERRO: Status #{response.status}"
  end

rescue => e
  puts "ERRO na requisição: #{e.message}"
  puts "Backtrace: #{e.backtrace.first(5).join("\n")}"
end

