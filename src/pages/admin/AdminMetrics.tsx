import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { usePayments } from "@/contexts/PaymentContext";
import { useKyc } from "@/contexts/KycContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, parseISO, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Download, TrendingUp, DollarSign, Users, XCircle, AlertTriangle, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCsv } from "@/lib/csvExport";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type PeriodKey = "7" | "30" | "90" | "custom";

export default function AdminMetrics() {
  const { appointments, payments, refunds } = usePayments();
  const { allSubmissions } = useKyc();

  const [period, setPeriod] = useState<PeriodKey>("30");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const { startDate, endDate } = useMemo(() => {
    if (period === "custom" && customFrom && customTo) {
      return { startDate: startOfDay(customFrom), endDate: endOfDay(customTo) };
    }
    const days = period === "custom" ? 30 : Number(period);
    return { startDate: startOfDay(subDays(new Date(), days)), endDate: endOfDay(new Date()) };
  }, [period, customFrom, customTo]);

  const filteredAppointments = useMemo(() =>
    appointments.filter(a => {
      const d = new Date(a.createdAt);
      return d >= startDate && d <= endDate;
    }), [appointments, startDate, endDate]);

  const filteredPayments = useMemo(() =>
    payments.filter(p => {
      const d = new Date(p.createdAt);
      return d >= startDate && d <= endDate;
    }), [payments, startDate, endDate]);

  // KPI calculations
  const paidCompleted = useMemo(() =>
    filteredAppointments.filter(a => a.status === "PAID" || a.status === "COMPLETED"), [filteredAppointments]);
  const gmv = useMemo(() => paidCompleted.reduce((s, a) => s + a.totalPrice, 0), [paidCompleted]);
  const platformRevenue = useMemo(() => paidCompleted.reduce((s, a) => s + a.platformFee, 0), [paidCompleted]);
  const totalCreated = filteredAppointments.length;
  const totalPaid = paidCompleted.length;
  const conversionRate = totalCreated > 0 ? (totalPaid / totalCreated) * 100 : 0;
  const canceled = filteredAppointments.filter(a => a.status === "CANCELED");
  const noShow = filteredAppointments.filter(a => a.status === "NO_SHOW");
  const cancelRate = totalCreated > 0 ? (canceled.length / totalCreated) * 100 : 0;
  const noShowRate = totalCreated > 0 ? (noShow.length / totalCreated) * 100 : 0;

  // Funnel
  const kycSubmitted = allSubmissions.filter(s => ["SUBMITTED", "APPROVED", "REJECTED", "NEEDS_MORE_INFO"].includes(s.status)).length;
  const kycApproved = allSubmissions.filter(s => s.status === "APPROVED").length;
  const paymentsPaid = filteredPayments.filter(p => p.status === "PAID").length;

  // Daily series
  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayAppts = filteredAppointments.filter(a => a.createdAt.startsWith(dayStr) || a.dates.includes(dayStr));
      const dayPaid = dayAppts.filter(a => a.status === "PAID" || a.status === "COMPLETED");
      const dayCanceled = dayAppts.filter(a => a.status === "CANCELED");
      const dayNoShow = dayAppts.filter(a => a.status === "NO_SHOW");
      return {
        date: format(day, "dd/MM", { locale: ptBR }),
        criados: dayAppts.length,
        pagos: dayPaid.length,
        gmv: dayPaid.reduce((s, a) => s + a.totalPrice, 0),
        cancelamentos: dayCanceled.length,
        noShow: dayNoShow.length,
      };
    });
  }, [filteredAppointments, startDate, endDate]);

  // Top caregivers
  const topCaregivers = useMemo(() => {
    const map = new Map<string, number>();
    filteredAppointments
      .filter(a => a.status === "COMPLETED" || a.status === "PAID")
      .forEach(a => map.set(a.caregiverName, (map.get(a.caregiverName) || 0) + 1));
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [filteredAppointments]);

  // Avg time to pay
  const avgTimeToPay = useMemo(() => {
    const times: number[] = [];
    filteredPayments
      .filter(p => p.status === "PAID" && p.paidAt)
      .forEach(p => {
        const appt = appointments.find(a => a.id === p.appointmentId);
        if (appt) {
          const diff = differenceInMinutes(new Date(p.paidAt!), new Date(appt.createdAt));
          if (diff >= 0) times.push(diff);
        }
      });
    if (times.length === 0) return { avg: 0, median: 0, count: 0 };
    const sorted = [...times].sort((a, b) => a - b);
    const avg = Math.round(times.reduce((s, t) => s + t, 0) / times.length);
    const median = sorted[Math.floor(sorted.length / 2)];
    return { avg, median, count: times.length };
  }, [filteredPayments, appointments]);

  // Export handlers
  const handleExportAppointments = () => {
    exportToCsv("appointments.csv",
      ["ID", "Cliente", "Cuidador", "Serviço", "Datas", "Início", "Término", "Valor Total", "Taxa", "Payout", "Status", "Criado em"],
      filteredAppointments.map(a => [a.id, a.clientEmail, a.caregiverName, a.serviceName, a.dates.join("; "), a.startTime, a.endTime, a.totalPrice, a.platformFee, a.caregiverPayout, a.status, a.createdAt])
    );
  };
  const handleExportPayments = () => {
    exportToCsv("payments.csv",
      ["ID", "Appointment ID", "Status", "Valor", "Taxa", "Payout", "Método", "Criado em", "Pago em", "Reembolsado em"],
      filteredPayments.map(p => [p.id, p.appointmentId, p.status, p.amountTotal, p.platformFee, p.caregiverPayout, p.method, p.createdAt, p.paidAt, p.refundedAt])
    );
  };

  const fmtBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AdminLayout title="Métricas do Piloto">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Período</label>
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodKey)}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {period === "custom" && (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">De</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !customFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customFrom ? format(customFrom, "dd/MM/yyyy") : "Início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={customFrom} onSelect={setCustomFrom} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Até</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !customTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customTo ? format(customTo, "dd/MM/yyyy") : "Fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={customTo} onSelect={setCustomTo} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Cidade</label>
          <Select defaultValue="poa">
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="poa">Porto Alegre</SelectItem>
              <SelectItem value="all">Todas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={handleExportAppointments}><Download className="w-4 h-4 mr-1" />Appointments</Button>
          <Button variant="outline" size="sm" onClick={handleExportPayments}><Download className="w-4 h-4 mr-1" />Payments</Button>
          <Button variant="outline" size="sm" disabled><Download className="w-4 h-4 mr-1" />Reviews (TODO)</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard icon={DollarSign} label="GMV" value={fmtBRL(gmv)} />
        <MetricCard icon={TrendingUp} label="Receita Plataforma" value={fmtBRL(platformRevenue)} />
        <MetricCard icon={BarChart3} label="Criados" value={totalCreated} sub={`${totalPaid} pagos`} />
        <MetricCard icon={Users} label="Conversão" value={`${conversionRate.toFixed(1)}%`} sub={`${totalPaid}/${totalCreated}`} />
        <MetricCard icon={XCircle} label="Cancelamentos" value={canceled.length} sub={`${cancelRate.toFixed(1)}%`} />
        <MetricCard icon={AlertTriangle} label="No-show" value={noShow.length} sub={`${noShowRate.toFixed(1)}%`} />
        <MetricCard icon={Clock} label="Tempo médio até pagar" value={avgTimeToPay.count > 0 ? `${avgTimeToPay.avg} min` : "—"} sub={avgTimeToPay.count > 0 ? `mediana ${avgTimeToPay.median} min` : "sem dados"} />
        <MetricCard icon={Users} label="Nota Média" value="—" sub="TODO: integrar reviews" />
      </div>

      {/* Funnel */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Funil de Conversão</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etapa</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <FunnelRow label="Visitantes" value="TODO: tracking" />
              <FunnelRow label="Cadastros clientes" value="TODO: tracking" />
              <FunnelRow label="Cadastros cuidadores" value="TODO: tracking" />
              <FunnelRow label="KYC Submitted" value={kycSubmitted} />
              <FunnelRow label="KYC Approved" value={kycApproved} />
              <FunnelRow label="Appointments criados" value={totalCreated} />
              <FunnelRow label="Payments PAID" value={paymentsPaid} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Atendimentos: Criados vs Pagos</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="criados" name="Criados" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="pagos" name="Pagos" stroke="hsl(var(--accent-foreground))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">GMV Diário</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis />
                <Tooltip formatter={(v: number) => fmtBRL(v)} />
                <Bar dataKey="gmv" name="GMV" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Cancelamentos e No-show</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cancelamentos" name="Cancelamentos" stroke="hsl(var(--destructive))" strokeWidth={2} />
                <Line type="monotone" dataKey="noShow" name="No-show" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Caregivers */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Top 10 Cuidadores (atendimentos)</CardTitle></CardHeader>
          <CardContent>
            {topCaregivers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados no período.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Cuidador</TableHead><TableHead className="text-right">Atendimentos</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {topCaregivers.map((c, i) => (
                    <TableRow key={c.name}>
                      <TableCell className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs w-6 justify-center">{i + 1}</Badge>
                        {c.name}
                      </TableCell>
                      <TableCell className="text-right font-medium">{c.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Top 10 Cuidadores (rating)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">TODO: integrar ReviewContext para exibir ranking por nota média (mín. 3 reviews).</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function MetricCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <p className="text-xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function FunnelRow({ label, value }: { label: string; value: string | number }) {
  const isTodo = typeof value === "string" && value.startsWith("TODO");
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell className={cn("text-right", isTodo && "text-muted-foreground italic text-xs")}>{isTodo ? <Badge variant="outline" className="text-xs">{value}</Badge> : <span className="font-medium">{value}</span>}</TableCell>
    </TableRow>
  );
}
