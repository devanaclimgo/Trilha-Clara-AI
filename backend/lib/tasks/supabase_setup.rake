# =====================================================
# TAREFAS PARA CONFIGURAÇÃO DO SUPABASE
# =====================================================

namespace :supabase do
  desc "Configurar banco de dados no Supabase"
  task setup: :environment do
    puts "🚀 Configurando Supabase para Trilha Clara IA..."
    
    # Verificar se as variáveis de ambiente estão configuradas
    required_vars = %w[DB_HOST DB_USER DB_PASSWORD]
    missing_vars = required_vars.select { |var| ENV[var].blank? }
    
    if missing_vars.any?
      puts "❌ Variáveis de ambiente faltando: #{missing_vars.join(', ')}"
      puts "📝 Configure as seguintes variáveis no seu .env:"
      puts "   DB_HOST=db.[SEU_PROJECT_ID].supabase.co"
      puts "   DB_USER=postgres"
      puts "   DB_PASSWORD=[SUA_SENHA]"
      puts "   DB_NAME=postgres"
      puts "   DB_PORT=5432"
      exit 1
    end
    
    puts "✅ Variáveis de ambiente configuradas"
    puts "🔗 Conectando ao Supabase..."
    
    begin
      # Testar conexão
      ActiveRecord::Base.connection.execute("SELECT 1")
      puts "✅ Conexão com Supabase estabelecida!"
      
      # Executar migrações
      puts "📦 Executando migrações..."
      Rake::Task["db:migrate"].invoke
      
      # Executar schema
      puts "📋 Executando schema do banco..."
      schema_file = Rails.root.join("..", "database_schema.sql")
      if File.exist?(schema_file)
        puts "📄 Executando schema personalizado..."
        sql_content = File.read(schema_file)
        
        # Dividir em comandos individuais
        commands = sql_content.split(/;\s*$/).reject(&:blank?)
        
        commands.each do |command|
          next if command.strip.blank?
          begin
            ActiveRecord::Base.connection.execute(command)
            puts "  ✅ #{command[0..50]}..."
          rescue => e
            puts "  ⚠️  #{command[0..50]}... (já existe ou erro: #{e.message})"
          end
        end
      end
      
      puts "🎉 Supabase configurado com sucesso!"
      puts "🌐 Acesse seu painel: https://supabase.com/dashboard"
      
    rescue => e
      puts "❌ Erro ao conectar com Supabase: #{e.message}"
      puts "🔧 Verifique suas credenciais e tente novamente"
      exit 1
    end
  end
  
  desc "Testar conexão com Supabase"
  task test: :environment do
    puts "🧪 Testando conexão com Supabase..."
    
    begin
      # Testar conexão básica
      result = ActiveRecord::Base.connection.execute("SELECT version()")
      puts "✅ Conexão estabelecida!"
      puts "📊 Versão do PostgreSQL: #{result.first['version']}"
      
      # Testar tabelas principais
      tables = %w[users tccs tcc_content]
      tables.each do |table|
        count = ActiveRecord::Base.connection.execute("SELECT COUNT(*) FROM #{table}").first['count']
        puts "📋 Tabela #{table}: #{count} registros"
      end
      
      puts "🎉 Teste concluído com sucesso!"
      
    rescue => e
      puts "❌ Erro no teste: #{e.message}"
      exit 1
    end
  end
  
  desc "Resetar banco de dados no Supabase"
  task reset: :environment do
    puts "⚠️  ATENÇÃO: Isso vai apagar TODOS os dados do banco!"
    print "Digite 'RESET' para confirmar: "
    confirmation = STDIN.gets.chomp
    
    if confirmation == "RESET"
      puts "🗑️  Resetando banco de dados..."
      
      # Dropar e recriar banco
      Rake::Task["db:drop"].invoke
      Rake::Task["db:create"].invoke
      Rake::Task["db:migrate"].invoke
      
      puts "✅ Banco resetado com sucesso!"
    else
      puts "❌ Operação cancelada"
    end
  end
end
