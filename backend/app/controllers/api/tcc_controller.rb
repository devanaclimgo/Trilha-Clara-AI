class Api::TccController < ApplicationController
  before_action :authenticate_user!, except: [:criar, :test_export]
  before_action :set_tcc, only: [:show, :export_word, :export_pdf]
  
  skip_before_action :authenticate_user!, only: [:test_export]

  rescue_from StandardError do |e|
    render json: { error: e.message }, status: :internal_server_error
  end

  # POST /tcc/criar (compatibilidade com versão antiga)
  def criar
    # Dados do formulário simples
    nome = params[:nome]
    faculdade = params[:faculdade]
    curso = params[:curso]
    materia = params[:materia]
    tema = params[:tema]
    tipo_trabalho = params[:tipo_trabalho]
    
    # Dados do formulário antigo (para compatibilidade)
    enunciado = params[:enunciado]
    semanas = params[:semanas] || 8

    # Gerar ID único para o TCC
    tcc_id = "tcc_#{Time.current.to_i}_#{SecureRandom.hex(4)}"

    gemini = GeminiService.new

    if enunciado.present?
      # Fluxo antigo - com enunciado
      dados_estruturados = gemini.simplificar_enunciado!(enunciado: enunciado, curso: curso, tipo_trabalho: tipo_trabalho)
      
      render json: {
        id: tcc_id,
        explicacao: dados_estruturados["explicacao"] || [],
        sugestoes: dados_estruturados["sugestoes"] || [],
        dica: dados_estruturados["dica"] || "",
        estrutura: dados_estruturados["estrutura"] || [],
        cronograma: dados_estruturados["cronograma"] || []
      }
    else
      # Fluxo novo - formulário simples
      # Primeiro gera a explicação simplificada baseada no tema
      explicacao_dados = gemini.simplificar_enunciado!(
        enunciado: tema, # Usar diretamente o tema detalhado
        curso: curso,
        tipo_trabalho: tipo_trabalho
      )
      
      # Depois gera a estrutura ABNT completa
      estrutura_dados = gemini.gerar_estrutura_abnt!(
        nome: nome,
        faculdade: faculdade,
        curso: curso,
        materia: materia,
        tema: tema,
        tipo_trabalho: tipo_trabalho
      )
      
      render json: {
        id: tcc_id,
        nome: nome,
        faculdade: faculdade,
        curso: curso,
        materia: materia,
        tema: tema,
        tipo_trabalho: tipo_trabalho,
        explicacao: explicacao_dados["explicacao"] || [],
        sugestoes: explicacao_dados["sugestoes"] || [],
        dica: explicacao_dados["dica"] || "",
        estrutura: estrutura_dados["estrutura"] || [],
        cronograma: estrutura_dados["cronograma"] || []
      }
    end
  end

  # POST /tcc
  def create
    @tcc = current_user.tccs.build(tcc_params)
    
    if @tcc.save
      # Gerar dados do TCC usando o tema
      gemini = GeminiService.new
      
      # Gerar explicação simplificada baseada no tema
      explicacao_dados = gemini.simplificar_enunciado!(
        enunciado: @tcc.tema, # Usar diretamente o tema detalhado
        curso: @tcc.curso,
        tipo_trabalho: @tcc.tipo_trabalho
      )
      
      # Gerar estrutura ABNT completa
      estrutura_dados = gemini.gerar_estrutura_abnt!(
        nome: @tcc.nome,
        faculdade: @tcc.faculdade,
        curso: @tcc.curso,
        materia: @tcc.materia,
        tema: @tcc.tema,
        tipo_trabalho: @tcc.tipo_trabalho
      )
      
      render json: {
        id: @tcc.id,
        nome: @tcc.nome,
        faculdade: @tcc.faculdade,
        curso: @tcc.curso,
        materia: @tcc.materia,
        tema: @tcc.tema,
        tipo_trabalho: @tcc.tipo_trabalho,
        explicacao: explicacao_dados["explicacao"] || [],
        sugestoes: explicacao_dados["sugestoes"] || [],
        dica: explicacao_dados["dica"] || "",
        estrutura: estrutura_dados["estrutura"] || [],
        cronograma: estrutura_dados["cronograma"] || [],
        created_at: @tcc.created_at,
        updated_at: @tcc.updated_at
      }
    else
      render json: { errors: @tcc.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /tcc/:id
  def show
    render json: {
      id: @tcc.id,
      nome: @tcc.nome,
      faculdade: @tcc.faculdade,
      curso: @tcc.curso,
      materia: @tcc.materia,
      tema: @tcc.tema,
      tipo_trabalho: @tcc.tipo_trabalho,
      created_at: @tcc.created_at,
      updated_at: @tcc.updated_at
    }
  end

  # GET /tcc/:id/export_word
  def export_word
    Rails.logger.info "Iniciando geração de arquivo Word para TCC ID: #{@tcc.id}"
    
    # Gerar arquivo .docx usando caracal
    doc = Caracal::Document.new do |docx|
      # Cabeçalho
      docx.h1 @tcc.tema, size: 18, bold: true, color: '2c3e50'
      docx.p
      docx.p "Nome: #{@tcc.nome}", size: 12
      docx.p "Faculdade: #{@tcc.faculdade}", size: 12
      docx.p "Curso: #{@tcc.curso}", size: 12
      docx.p "Matéria: #{@tcc.materia}", size: 12
      docx.p "Tipo de Trabalho: #{@tcc.tipo_trabalho}", size: 12
      docx.p
      
      # Estrutura do trabalho
      docx.h2 "Estrutura do Trabalho", size: 16, bold: true, color: '34495e'
      
      # Aqui você pode adicionar a estrutura gerada pelo Gemini
      # Por enquanto, uma estrutura básica
      docx.p "1. Introdução"
      docx.p "2. Desenvolvimento"
      docx.p "3. Conclusão"
      docx.p "4. Referências"
    end

    # Salvar arquivo temporário
    filename = "TCC_#{@tcc.id}_#{Time.current.strftime('%Y%m%d_%H%M%S')}.docx"
    file_path = Rails.root.join('tmp', filename)
    
    # Garantir que o diretório tmp existe
    FileUtils.mkdir_p(Rails.root.join('tmp'))
    
    Rails.logger.info "Salvando arquivo em: #{file_path}"
    
    # Salvar o arquivo usando o método save do Caracal
    doc.save(file_path.to_s)

    Rails.logger.info "Arquivo salvo com sucesso. Enviando para download..."
    
    send_file file_path, 
              filename: filename,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              disposition: 'attachment'
  rescue => e
    Rails.logger.error "Erro ao gerar arquivo Word: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: "Erro ao gerar arquivo Word: #{e.message}" }, status: :internal_server_error
  end

  # GET /tcc/test_export
  def test_export
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

  # GET /tcc/:id/export_pdf
  def export_pdf
    # Primeiro gerar o .docx
    doc = Caracal::Document.new do |docx|
      # Cabeçalho
      docx.h1 @tcc.tema, size: 18, bold: true, color: '2c3e50'
      docx.p
      docx.p "Nome: #{@tcc.nome}", size: 12
      docx.p "Faculdade: #{@tcc.faculdade}", size: 12
      docx.p "Curso: #{@tcc.curso}", size: 12
      docx.p "Matéria: #{@tcc.materia}", size: 12
      docx.p "Tipo de Trabalho: #{@tcc.tipo_trabalho}", size: 12
      docx.p
      
      # Estrutura do trabalho
      docx.h2 "Estrutura do Trabalho", size: 16, bold: true, color: '34495e'
      docx.p "1. Introdução"
      docx.p "2. Desenvolvimento"
      docx.p "3. Conclusão"
      docx.p "4. Referências"
    end

    # Salvar arquivo .docx temporário
    docx_filename = "TCC_#{@tcc.id}_#{Time.current.strftime('%Y%m%d_%H%M%S')}.docx"
    docx_path = Rails.root.join('tmp', docx_filename)
    
    # Garantir que o diretório tmp existe
    FileUtils.mkdir_p(Rails.root.join('tmp'))
    
    # Salvar o arquivo
    File.open(docx_path, 'wb') do |f|
      f.write(doc.render)
    end

    # Converter para PDF usando LibreOffice
    pdf_filename = "TCC_#{@tcc.id}_#{Time.current.strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf_path = Rails.root.join('tmp', pdf_filename)
    
    # Comando para converter docx para pdf
    system("soffice --headless --convert-to pdf --outdir #{Rails.root.join('tmp')} #{docx_path}")
    
    # Renomear arquivo gerado
    generated_pdf = docx_path.to_s.gsub('.docx', '.pdf')
    File.rename(generated_pdf, pdf_path) if File.exist?(generated_pdf)

    if File.exist?(pdf_path)
      send_file pdf_path, 
                filename: pdf_filename,
                type: 'application/pdf',
                disposition: 'attachment'
    else
      render json: { error: 'Erro ao gerar PDF' }, status: :internal_server_error
    end
  rescue => e
    Rails.logger.error "Erro ao gerar arquivo PDF: #{e.message}"
    render json: { error: "Erro ao gerar arquivo PDF: #{e.message}" }, status: :internal_server_error
  end

  private

  def set_tcc
    @tcc = current_user.tccs.find(params[:id])
  end

  def tcc_params
    params.require(:tcc).permit(:nome, :faculdade, :curso, :materia, :tema, :tipo_trabalho)
  end
end
