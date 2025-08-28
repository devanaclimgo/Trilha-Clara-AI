import { Calendar, CheckCircle2, ChevronRight, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export default function DashboardScreen() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Bem-vindo ao Trilha Clara</h1>
        <p className="text-muted-foreground">Sua plataforma acadêmica moderna e confiável para orientação de TCC</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-chart-1" />
              Anotações Salvas
            </CardTitle>
            <CardDescription>Suas anotações de pesquisa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 esta semana</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-chart-2" />
              Progresso do TCC
            </CardTitle>
            <CardDescription>Cronograma atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Concluído</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-chart-3" />
              Próxima Etapa
            </CardTitle>
            <CardDescription>O que fazer agora</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">Revisão Bibliográfica</p>
              <Badge variant="outline" className="text-xs">
                Prazo: 15 dias
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Suas últimas ações na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { action: "Nova anotação salva", time: "2 horas atrás", icon: FileText },
            { action: "Etapa marcada como concluída", time: "1 dia atrás", icon: CheckCircle2 },
            { action: "Cronograma atualizado", time: "3 dias atrás", icon: Calendar },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <item.icon className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}