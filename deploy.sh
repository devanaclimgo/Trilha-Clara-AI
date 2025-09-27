#!/bin/bash

# =====================================================
# SCRIPT DE DEPLOY PARA TRILHA CLARA IA
# =====================================================

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy do Trilha Clara..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "database_schema.sql" ]; then
    print_error "Execute este script na raiz do projeto!"
    exit 1
fi

# Verificar se as variáveis de ambiente estão configuradas
print_status "Verificando variáveis de ambiente..."

required_vars=("DB_HOST" "DB_USER" "DB_PASSWORD" "SUPABASE_URL" "SUPABASE_ANON_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Variáveis de ambiente faltando: ${missing_vars[*]}"
    print_warning "Configure as variáveis no arquivo .env"
    exit 1
fi

print_success "Variáveis de ambiente configuradas"

# Configurar backend
print_status "Configurando backend..."

cd backend

# Instalar dependências
print_status "Instalando dependências do Rails..."
bundle install

# Configurar banco de dados
print_status "Configurando banco de dados no Supabase..."
rails supabase:setup

# Testar conexão
print_status "Testando conexão com Supabase..."
rails supabase:test

print_success "Backend configurado com sucesso!"

# Configurar frontend
print_status "Configurando frontend..."

cd ../frontend

# Instalar dependências
print_status "Instalando dependências do Next.js..."
npm install

# Build do frontend
print_status "Fazendo build do frontend..."
npm run build

print_success "Frontend configurado com sucesso!"

# Voltar para raiz
cd ..

print_success "🎉 Deploy concluído com sucesso!"
print_status "Próximos passos:"
echo "  1. Configure seu domínio no Supabase"
echo "  2. Configure CORS no Supabase"
echo "  3. Deploy em produção (Railway/Vercel)"
echo "  4. Configure SSL/HTTPS"
echo "  5. Configure backup automático"

print_warning "Lembre-se de manter suas credenciais seguras!"
