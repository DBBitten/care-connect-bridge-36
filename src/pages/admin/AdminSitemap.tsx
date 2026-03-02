import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ExternalLink, MapPin, Shield, Route, ClipboardCheck } from "lucide-react";

/* ───────── Tab 1: Rotas ───────── */

type RouteRole = "public" | "client" | "caregiver" | "admin";

interface SitemapRoute {
  path: string;
  description: string;
  role: RouteRole;
  gates: string;
  states: string;
  implemented: boolean;
}

const roleBadge: Record<RouteRole, { label: string; className: string }> = {
  public: { label: "Público", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  client: { label: "Cliente", className: "bg-sky-100 text-sky-800 border-sky-200" },
  caregiver: { label: "Cuidador", className: "bg-amber-100 text-amber-800 border-amber-200" },
  admin: { label: "Admin", className: "bg-violet-100 text-violet-800 border-violet-200" },
};

const sections: { title: string; routes: SitemapRoute[] }[] = [
  {
    title: "Público",
    routes: [
      { path: "/", description: "Landing page principal", role: "public", gates: "Nenhum", states: "—", implemented: true },
      { path: "/services", description: "Catálogo de serviços disponíveis", role: "public", gates: "Nenhum", states: "—", implemented: true },
      { path: "/buscar-cuidadores", description: "Busca e filtro de cuidadores", role: "public", gates: "Nenhum", states: "Filtros, ordenação", implemented: true },
      { path: "/cuidador/:id", description: "Perfil público do cuidador", role: "public", gates: "Nenhum", states: "Dados do cuidador", implemented: true },
      { path: "/termos", description: "Termos de uso da plataforma", role: "public", gates: "Nenhum", states: "—", implemented: true },
      { path: "/privacidade", description: "Política de privacidade", role: "public", gates: "Nenhum", states: "—", implemented: true },
      { path: "/regras", description: "Regras do marketplace", role: "public", gates: "Nenhum", states: "—", implemented: true },
      { path: "/termo-cuidador", description: "Termo de adesão do cuidador", role: "public", gates: "Nenhum", states: "—", implemented: true },
      { path: "/login", description: "Login com seleção de perfil", role: "public", gates: "Nenhum", states: "Email, tipo de usuário", implemented: true },
      { path: "/cadastro", description: "Registro de novo usuário", role: "public", gates: "Nenhum", states: "Formulário de cadastro", implemented: true },
      { path: "/incidentes", description: "Página pública de incidentes", role: "public", gates: "Nenhum", states: "—", implemented: false },
    ],
  },
  {
    title: "Cliente (Familiar/Necessitado)",
    routes: [
      { path: "/cliente/dashboard", description: "Dashboard do cliente com agendamentos", role: "client", gates: "Auth (necessitado)", states: "Appointments list", implemented: true },
      { path: "/cliente/agenda", description: "Calendário de atendimentos", role: "client", gates: "Auth (necessitado)", states: "Visualização mensal", implemented: true },
      { path: "/cliente/perfil", description: "Edição de perfil do cliente", role: "client", gates: "Auth (necessitado)", states: "Dados pessoais", implemented: true },
      { path: "/agendar/:id", description: "Agendamento com cuidador específico", role: "client", gates: "Auth, aceite de termos", states: "Seleção data/hora/serviço", implemented: true },
      { path: "/checkout/:appointmentId", description: "Pagamento do agendamento", role: "client", gates: "Auth, appointment PAYMENT_PENDING", states: "PAYMENT_PENDING → PAID", implemented: true },
      { path: "/cliente/pagamentos", description: "Histórico de pagamentos", role: "client", gates: "Auth (necessitado)", states: "Lista de transações", implemented: true },
      { path: "/cliente/avaliacoes", description: "Avaliações realizadas pelo cliente", role: "client", gates: "Auth (necessitado)", states: "Lista de reviews", implemented: true },
      { path: "/avaliar/:id", description: "Formulário de avaliação pós-atendimento", role: "client", gates: "Auth, appointment COMPLETED", states: "Rating + comentário", implemented: true },
      { path: "/notifications", description: "Central de notificações", role: "client", gates: "Auth", states: "Lista de notificações", implemented: true },
    ],
  },
  {
    title: "Cuidador",
    routes: [
      { path: "/cuidador/dashboard", description: "Dashboard do cuidador com agenda", role: "caregiver", gates: "Auth (cuidador)", states: "Appointments, ganhos", implemented: true },
      { path: "/cuidador/perfil", description: "Edição de perfil profissional", role: "caregiver", gates: "Auth (cuidador)", states: "Dados, especialidades", implemented: true },
      { path: "/cuidador/verificacao", description: "Envio de documentos KYC", role: "caregiver", gates: "Auth (cuidador)", states: "NOT_STARTED → SUBMITTED → APPROVED/REJECTED", implemented: true },
      { path: "/cuidador/formacao", description: "Formação e certificações", role: "caregiver", gates: "Auth (cuidador)", states: "Lista de cursos", implemented: true },
      { path: "/cuidador/calendario", description: "Calendário do cuidador", role: "caregiver", gates: "Auth (cuidador)", states: "—", implemented: false },
      { path: "/cuidador/disponibilidade", description: "Gestão de disponibilidade", role: "caregiver", gates: "Auth (cuidador), KYC aprovado", states: "—", implemented: false },
    ],
  },
  {
    title: "Admin",
    routes: [
      { path: "/admin", description: "Dashboard administrativo com métricas", role: "admin", gates: "Auth (admin)", states: "Resumo geral", implemented: true },
      { path: "/admin/metrics", description: "Métricas detalhadas da plataforma", role: "admin", gates: "Auth (admin)", states: "Gráficos, KPIs", implemented: true },
      { path: "/admin/kyc", description: "Fila de verificação KYC", role: "admin", gates: "Auth (admin)", states: "Pending submissions", implemented: true },
      { path: "/admin/kyc/:submissionId", description: "Revisão individual de KYC", role: "admin", gates: "Auth (admin)", states: "Aprovar/Rejeitar/Pedir mais info", implemented: true },
      { path: "/admin/services", description: "Gestão de serviços da plataforma", role: "admin", gates: "Auth (admin)", states: "CRUD serviços", implemented: true },
      { path: "/admin/services/new", description: "Criar novo serviço", role: "admin", gates: "Auth (admin)", states: "Formulário", implemented: true },
      { path: "/admin/services/:id", description: "Editar serviço existente", role: "admin", gates: "Auth (admin)", states: "Formulário preenchido", implemented: true },
      { path: "/admin/payments", description: "Gestão de pagamentos e repasses", role: "admin", gates: "Auth (admin)", states: "Lista de transações", implemented: true },
      { path: "/admin/settings", description: "Configurações gerais e jobs", role: "admin", gates: "Auth (admin)", states: "Taxa, lembretes", implemented: true },
      { path: "/admin/legal", description: "Gestão de documentos legais", role: "admin", gates: "Auth (admin)", states: "Lista de docs", implemented: true },
      { path: "/admin/legal/new", description: "Criar documento legal", role: "admin", gates: "Auth (admin)", states: "Editor", implemented: true },
      { path: "/admin/legal/edit/:key", description: "Editar documento legal", role: "admin", gates: "Auth (admin)", states: "Editor preenchido", implemented: true },
      { path: "/admin/sitemap", description: "Mapa do produto (esta página)", role: "admin", gates: "Auth (admin)", states: "Tabs: Rotas, Gates, Fluxos, QA", implemented: true },
      { path: "/admin/incidents", description: "Gestão de incidentes", role: "admin", gates: "Auth (admin)", states: "—", implemented: false },
      { path: "/admin/incidents/:id", description: "Detalhes do incidente", role: "admin", gates: "Auth (admin)", states: "—", implemented: false },
    ],
  },
];

function RoutesTab() {
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar rota ou descrição…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {sections.map((section) => {
        const filtered = section.routes.filter(
          (r) => r.path.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
        );
        if (filtered.length === 0) return null;

        return (
          <div key={section.title}>
            <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-4 py-2 font-medium">Rota</th>
                    <th className="px-4 py-2 font-medium">Descrição</th>
                    <th className="px-4 py-2 font-medium">Role</th>
                    <th className="px-4 py-2 font-medium">Gates</th>
                    <th className="px-4 py-2 font-medium">Estados</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const badge = roleBadge[r.role];
                    return (
                      <tr key={r.path} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            {r.implemented ? (
                              <a
                                href={r.path.replace(/:[\w]+/g, "1")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-mono text-xs flex items-center gap-1"
                              >
                                {r.path}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="font-mono text-xs text-muted-foreground">
                                {r.path}{" "}
                                <span className="text-destructive font-sans text-[10px]">(não implementada)</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{r.description}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="outline" className={badge.className}>
                            {badge.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.gates}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.states}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────── Tab 2: Gates ───────── */

const gates = [
  { recurso: "Busca de cuidadores", role: "Público", condicao: "Cuidador com KYC=APPROVED e não suspenso", falha: "Cuidador não aparece nos resultados" },
  { recurso: "Receber atendimentos", role: "Cuidador", condicao: "KYC=APPROVED", falha: "Bloqueia aceitação; redireciona para /cuidador/verificacao" },
  { recurso: "Checkout / Pagamento", role: "Cliente", condicao: "Aceite de termos e regras do marketplace", falha: "Modal de aceite obrigatório antes de prosseguir" },
  { recurso: "Ver endereço completo", role: "Cliente/Cuidador", condicao: "Appointment status ≥ PAID", falha: "Endereço oculto; mostra apenas cidade/bairro" },
  { recurso: "Ações core (agendar, pagar)", role: "Qualquer", condicao: "Usuário não suspenso", falha: "Banner de suspensão; bloqueia ação" },
  { recurso: "Campo de notas do agendamento", role: "Cliente", condicao: "Anti-bypass ativo (sem telefone/email)", falha: "Validação bloqueia envio com dados de contato" },
  { recurso: "Avaliar atendimento", role: "Cliente", condicao: "Appointment status = COMPLETED", falha: "Botão de avaliação desabilitado" },
  { recurso: "Painel admin", role: "Admin", condicao: "Auth com userType=admin", falha: "Redirect para /login" },
];

function GatesTab() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 text-left">
            <th className="px-4 py-2 font-medium">Recurso / Tela</th>
            <th className="px-4 py-2 font-medium">Role</th>
            <th className="px-4 py-2 font-medium">Condição necessária</th>
            <th className="px-4 py-2 font-medium">Comportamento se falhar</th>
          </tr>
        </thead>
        <tbody>
          {gates.map((g, i) => (
            <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
              <td className="px-4 py-2.5 font-medium">{g.recurso}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{g.role}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{g.condicao}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{g.falha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────── Tab 3: Fluxos ───────── */

interface FlowStep {
  label: string;
  path: string;
  detail: string;
  implemented: boolean;
}

const flows: { title: string; steps: FlowStep[] }[] = [
  {
    title: "Fluxo 1 — Cliente agendar e pagar",
    steps: [
      { label: "Buscar serviço", path: "/services", detail: "Seleciona serviço desejado", implemented: true },
      { label: "Buscar cuidadores", path: "/buscar-cuidadores", detail: "Filtra e escolhe cuidador", implemented: true },
      { label: "Agendar", path: "/agendar/:id", detail: "Cria appointment → status PAYMENT_PENDING", implemented: true },
      { label: "Pagar", path: "/checkout/:appointmentId", detail: "Processa pagamento → status PAID", implemented: true },
      { label: "Acompanhar", path: "/cliente/dashboard", detail: "Endereço liberado após PAID", implemented: true },
      { label: "Avaliar", path: "/avaliar/:id", detail: "Após COMPLETED → enviar review", implemented: true },
    ],
  },
  {
    title: "Fluxo 2 — Cuidador onboarding (KYC)",
    steps: [
      { label: "Cadastro", path: "/cadastro", detail: "Cria conta como cuidador", implemented: true },
      { label: "Aceitar termos", path: "/termos", detail: "Aceite de termos gerais obrigatório", implemented: true },
      { label: "Enviar KYC", path: "/cuidador/verificacao", detail: "Envia documentos → status SUBMITTED", implemented: true },
      { label: "Admin revisa", path: "/admin/kyc", detail: "Admin aprova → KYC APPROVED", implemented: true },
      { label: "Perfil ativo", path: "/buscar-cuidadores", detail: "Cuidador aparece na busca", implemented: true },
    ],
  },
  {
    title: "Fluxo 3 — Incidente",
    steps: [
      { label: "Atendimento", path: "/cliente/dashboard", detail: "Cliente ou cuidador no atendimento", implemented: true },
      { label: "Reportar incidente", path: "/cliente/dashboard", detail: "Botão de reportar no atendimento", implemented: false },
      { label: "Admin analisa", path: "/admin/incidents/:id", detail: "Admin avalia o incidente", implemented: false },
      { label: "Ações", path: "/admin/incidents/:id", detail: "Warning / suspensão / ban / reembolso", implemented: false },
    ],
  },
];

function FlowsTab() {
  return (
    <div className="space-y-8">
      {flows.map((flow) => (
        <div key={flow.title}>
          <h3 className="text-lg font-semibold mb-4">{flow.title}</h3>
          <div className="relative pl-6 space-y-0">
            {flow.steps.map((step, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                {/* vertical line */}
                {i < flow.steps.length - 1 && (
                  <div className="absolute left-[-13px] top-6 bottom-0 w-0.5 bg-border" />
                )}
                {/* dot */}
                <div
                  className={`absolute left-[-17px] top-1.5 h-3 w-3 rounded-full border-2 ${
                    step.implemented
                      ? "bg-primary border-primary"
                      : "bg-muted border-muted-foreground/40"
                  }`}
                />
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono text-muted-foreground w-5 shrink-0 pt-0.5">
                    {i + 1}.
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      {step.implemented ? (
                        <a
                          href={step.path.replace(/:[\w]+/g, "1")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          {step.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">
                          {step.label}{" "}
                          <span className="text-destructive text-[10px]">(não implementado)</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                    <span className="text-[10px] font-mono text-muted-foreground/70">{step.path}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────── Tab 4: QA ───────── */

const qaItems = [
  "KYC bloqueia cuidador não aprovado de aparecer na busca",
  "Endereço completo só aparece após status PAID",
  "Anti-bypass bloqueia telefone/e-mail no campo de notas",
  "Cancelamento gera reembolso simulado corretamente",
  "Review só é possível após appointment COMPLETED",
  "Checkout exige aceite de termos antes de prosseguir",
  "Usuário suspenso vê banner e não consegue agendar",
  "Notificações são geradas nos fluxos de agendamento, pagamento e KYC",
];

function QaTab() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {doneCount} de {qaItems.length} verificados
        </p>
        <Badge variant={doneCount === qaItems.length ? "default" : "outline"}>
          {doneCount === qaItems.length ? "✓ Completo" : "Em andamento"}
        </Badge>
      </div>

      <div className="rounded-lg border divide-y">
        {qaItems.map((item, i) => (
          <label
            key={i}
            className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <Checkbox
              checked={!!checked[i]}
              onCheckedChange={() => toggle(i)}
              className="mt-0.5"
            />
            <span className={`text-sm ${checked[i] ? "line-through text-muted-foreground" : ""}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ───────── Page ───────── */

export default function AdminSitemap() {
  return (
    <AdminLayout title="Sitemap — Mapa do Produto" subtitle="Visão completa de rotas, gates, fluxos e checklist de QA">
      <Tabs defaultValue="rotas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="rotas" className="gap-1.5">
            <MapPin className="h-4 w-4" /> Rotas
          </TabsTrigger>
          <TabsTrigger value="gates" className="gap-1.5">
            <Shield className="h-4 w-4" /> Gates
          </TabsTrigger>
          <TabsTrigger value="fluxos" className="gap-1.5">
            <Route className="h-4 w-4" /> Fluxos
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-1.5">
            <ClipboardCheck className="h-4 w-4" /> QA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rotas"><RoutesTab /></TabsContent>
        <TabsContent value="gates"><GatesTab /></TabsContent>
        <TabsContent value="fluxos"><FlowsTab /></TabsContent>
        <TabsContent value="qa"><QaTab /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
