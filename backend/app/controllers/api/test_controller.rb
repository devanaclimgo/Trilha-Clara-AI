class Api::TestController < ApplicationController
  
  def export_test
    Rails.logger.info "Testando geração de arquivo Word"
    
    # Gerar arquivo .docx usando caracal
    doc = Caracal::Document.new do |docx|
      # Cabeçalho
      docx.h1 "Teste de Geração de Arquivo Word", size: 18, bold: true, color: '2c3e50'
      docx.p
      docx.p "Nome: Usuário Teste", size: 12
      docx.p "Faculdade: Universidade Teste", size: 12
      docx.p "Curso: Curso Teste", size: 12
      docx.p "Matéria: Matéria Teste", size: 12
      docx.p "Tipo de Trabalho: TCC", size: 12
      docx.p
      
      # Estrutura do trabalho
      docx.h2 "Estrutura do Trabalho", size: 16, bold: true, color: '34495e'
      docx.p "1. Introdução"
      docx.p "2. Desenvolvimento"
      docx.p "3. Conclusão"
      docx.p "4. Referências"
    end

    # Salvar arquivo temporário
    filename = "TCC_Teste_#{Time.current.strftime('%Y%m%d_%H%M%S')}.docx"
    file_path = Rails.root.join('tmp', filename)
    
    # Garantir que o diretório tmp existe
    FileUtils.mkdir_p(Rails.root.join('tmp'))
    
    Rails.logger.info "Salvando arquivo de teste em: #{file_path}"
    
    # Salvar o arquivo
    File.open(file_path, 'wb') do |f|
      f.write(doc.render)
    end

    Rails.logger.info "Arquivo de teste salvo com sucesso. Enviando para download..."
    
    send_file file_path, 
              filename: filename,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              disposition: 'attachment'
  rescue => e
    Rails.logger.error "Erro ao gerar arquivo de teste: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: "Erro ao gerar arquivo de teste: #{e.message}" }, status: :internal_server_error
  end
end
