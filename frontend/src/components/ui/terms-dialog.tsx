'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TermsDialogProps {
  children: React.ReactNode
  type: 'terms' | 'privacy'
}

export function TermsDialog({ children, type }: TermsDialogProps) {
  const [open, setOpen] = useState(false)

  const termsContent = `
TERMOS DE USO - Trilha Clara

1. ACEITAÇÃO DOS TERMOS
Ao utilizar a plataforma Trilha Clara, você concorda com estes termos de uso. Se não concordar, não utilize nossos serviços.

2. DESCRIÇÃO DO SERVIÇO
A Trilha Clara é uma plataforma que auxilia estudantes na criação e organização de trabalhos acadêmicos, fornecendo:
- Estruturação de TCCs, monografias e artigos científicos
- Sugestões de cronogramas e metodologias
- Ferramentas de organização e acompanhamento de progresso
- Geração de conteúdo baseado em IA

3. USO ADEQUADO
Você se compromete a:
- Utilizar a plataforma apenas para fins acadêmicos legítimos
- Não copiar ou plagiar conteúdo de terceiros
- Fornecer informações verdadeiras e precisas
- Respeitar os direitos de propriedade intelectual
- Não utilizar a plataforma para atividades ilegais

4. RESPONSABILIDADES DO USUÁRIO
- Você é responsável pela veracidade das informações fornecidas
- Deve revisar e validar todo conteúdo gerado pela plataforma
- É responsável por seguir as normas acadêmicas de sua instituição
- Deve manter a confidencialidade de sua conta

5. LIMITAÇÕES DE RESPONSABILIDADE
A Trilha Clara não se responsabiliza por:
- Plágio ou violação de direitos autorais
- Notas ou avaliações recebidas em trabalhos acadêmicos
- Conteúdo gerado que não atenda às expectativas
- Problemas técnicos temporários

6. PROPRIEDADE INTELECTUAL
- O conteúdo gerado pela plataforma é de sua propriedade
- Você mantém todos os direitos sobre seus trabalhos acadêmicos
- A plataforma não reivindica propriedade sobre seu conteúdo

7. MODIFICAÇÕES
Estes termos podem ser atualizados a qualquer momento. O uso continuado da plataforma após mudanças constitui aceitação dos novos termos.

8. CONTATO
Para dúvidas sobre estes termos, entre em contato através do nosso suporte.

Última atualização: Janeiro de 2025
`

  const privacyContent = `
POLÍTICA DE PRIVACIDADE - Trilha Clara

1. INFORMAÇÕES COLETADAS
Coletamos as seguintes informações:
- Dados de cadastro (nome, email, curso)
- Informações dos trabalhos acadêmicos criados
- Dados de uso da plataforma
- Informações técnicas (IP, navegador, dispositivo)

2. COMO USAMOS SUAS INFORMAÇÕES
Utilizamos seus dados para:
- Fornecer e melhorar nossos serviços
- Personalizar sua experiência na plataforma
- Gerar conteúdo relevante para seus trabalhos
- Comunicar atualizações e melhorias
- Garantir a segurança da plataforma

3. COMPARTILHAMENTO DE DADOS
NÃO compartilhamos suas informações pessoais com terceiros, exceto:
- Quando necessário para fornecer nossos serviços
- Por determinação legal
- Com seu consentimento explícito

4. SEGURANÇA DOS DADOS
Implementamos medidas de segurança para proteger suas informações:
- Criptografia de dados sensíveis
- Acesso restrito a informações pessoais
- Monitoramento de segurança contínuo
- Backup seguro dos dados

5. SEUS DIREITOS
Você tem o direito de:
- Acessar suas informações pessoais
- Corrigir dados incorretos
- Solicitar a exclusão de seus dados
- Revogar consentimentos
- Portabilidade de dados

6. RETENÇÃO DE DADOS
Mantemos suas informações pelo tempo necessário para:
- Fornecer nossos serviços
- Cumprir obrigações legais
- Resolver disputas
- Aplicar nossos termos

7. COOKIES E TECNOLOGIAS SIMILARES
Utilizamos cookies para:
- Melhorar a funcionalidade da plataforma
- Personalizar sua experiência
- Analisar o uso da plataforma
- Garantir a segurança

8. MENORES DE IDADE
Nossa plataforma não é direcionada a menores de 16 anos. Não coletamos intencionalmente dados de menores.

9. ALTERAÇÕES NA POLÍTICA
Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas.

10. CONTATO
Para questões sobre privacidade, entre em contato através do nosso suporte.

Última atualização: Janeiro de 2025
`

  const content = type === 'terms' ? termsContent : privacyContent
  const title = type === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            {title}
          </DialogTitle>
          <DialogDescription>
            {type === 'terms'
              ? 'Leia nossos termos de uso antes de utilizar a plataforma'
              : 'Entenda como coletamos e utilizamos suas informações'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {content}
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
