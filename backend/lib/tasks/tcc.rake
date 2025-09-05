namespace :tcc do
  desc "Testa integração com Gemini"
  task test_gemini: :environment do
    service = GeminiService.new

    enunciado = "Estrutura metodológica baseada em referenciais epistemológicos aplicados ao campo social."
    curso = "Psicologia"

    puts "🔮 Testando Gemini com curso: #{curso}..."
    result = service.simplificar_enunciado!(enunciado: enunciado, curso: curso)

    puts "\n=== Resultado ==="
    puts result
    puts "================="
  end
end