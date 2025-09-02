import { Download, FileText } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function ExportacaoABNT() {
  return (
    <Card className="rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold gradient-text">
          Formatação ABNT pronta
        </CardTitle>
        <p className="text-muted-foreground">
          Seu TCC formatado conforme as normas acadêmicas
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="font-bold text-lg text-gray-700">
                Pré-visualização do TCC
              </h3>
              <p className="text-gray-500 text-sm">
                Documento formatado em ABNT com 45 páginas
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-left text-xs text-gray-600 max-w-md mx-auto shadow-sm border border-slate-200/20">
              <div className="space-y-2">
                <div className="font-bold text-center">
                  UNIVERSIDADE FEDERAL
                </div>
                <div className="text-center">CURSO DE ADMINISTRAÇÃO</div>
                <div className="h-8"></div>
                <div className="font-bold text-center">JOÃO DA SILVA</div>
                <div className="h-8"></div>
                <div className="font-bold text-center">
                  ANÁLISE DO COMPORTAMENTO DO CONSUMIDOR...
                </div>
                <div className="text-center text-xs">
                  Trabalho de Conclusão de Curso...
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Button className="p-6 h-auto rounded-2xl gradient-bg text-white hover:scale-105 hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <Download className="h-8 w-8 mx-auto mb-2" />
              <div className="font-bold">Baixar PDF</div>
              <div className="text-sm opacity-90">
                Versão final para impressão
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="p-6 h-auto rounded-2xl border-2 border-purple-200 hover:bg-purple-50 hover:scale-105 transition-all duration-300 bg-transparent"
          >
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-bold text-purple-700">Baixar Word</div>
              <div className="text-sm text-purple-600">
                Para edições adicionais
              </div>
            </div>
          </Button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            ✅ Seu TCC inclui:
          </h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div>• Formatação ABNT completa</div>
            <div>• Referências bibliográficas</div>
            <div>• Sumário automático</div>
            <div>• Numeração de páginas</div>
            <div>• Margens e espaçamentos corretos</div>
            <div>• Capa e folha de rosto</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
