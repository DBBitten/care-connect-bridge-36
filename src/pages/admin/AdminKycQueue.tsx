import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useKyc } from '@/contexts/KycContext';
import { KycStatus } from '@/types/kyc';
import { Search, Eye, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig: Record<KycStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  NOT_STARTED: { label: 'Não iniciado', variant: 'outline', icon: FileText },
  IN_PROGRESS: { label: 'Em progresso', variant: 'outline', icon: FileText },
  SUBMITTED: { label: 'Aguardando', variant: 'default', icon: Clock },
  APPROVED: { label: 'Aprovado', variant: 'secondary', icon: CheckCircle },
  REJECTED: { label: 'Reprovado', variant: 'destructive', icon: XCircle },
  NEEDS_MORE_INFO: { label: 'Pendente', variant: 'destructive', icon: AlertTriangle },
};

const AdminKycQueue = () => {
  const { allSubmissions } = useKyc();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<KycStatus | 'ALL'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');

  // Get unique cities
  const cities = useMemo(() => {
    const uniqueCities = new Set(allSubmissions.map(s => s.profile?.city).filter(Boolean));
    return Array.from(uniqueCities) as string[];
  }, [allSubmissions]);

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter(submission => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!submission.userName.toLowerCase().includes(search) && 
            !submission.userEmail.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'ALL' && submission.status !== statusFilter) {
        return false;
      }

      // City filter
      if (cityFilter !== 'ALL' && submission.profile?.city !== cityFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by status priority (SUBMITTED first) then by date
      const statusPriority: Record<KycStatus, number> = {
        SUBMITTED: 0,
        NEEDS_MORE_INFO: 1,
        REJECTED: 2,
        IN_PROGRESS: 3,
        NOT_STARTED: 4,
        APPROVED: 5,
      };
      
      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [allSubmissions, searchTerm, statusFilter, cityFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: allSubmissions.length,
    pending: allSubmissions.filter(s => s.status === 'SUBMITTED').length,
    needsInfo: allSubmissions.filter(s => s.status === 'NEEDS_MORE_INFO').length,
    approved: allSubmissions.filter(s => s.status === 'APPROVED').length,
  }), [allSubmissions]);

  return (
    <AdminLayout title="Fila de Verificações" subtitle="Gerencie as verificações de identidade dos cuidadores">
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aguardando</p>
                <p className="text-2xl font-bold text-primary">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendente</p>
                <p className="text-2xl font-bold text-warning">{stats.needsInfo}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as KycStatus | 'ALL')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os status</SelectItem>
                <SelectItem value="SUBMITTED">Aguardando</SelectItem>
                <SelectItem value="NEEDS_MORE_INFO">Pendente</SelectItem>
                <SelectItem value="REJECTED">Reprovado</SelectItem>
                <SelectItem value="APPROVED">Aprovado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as cidades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissões ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cuidador</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma submissão encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions.map(submission => {
                  const config = statusConfig[submission.status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.userName}</p>
                          <p className="text-sm text-muted-foreground">{submission.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.profile?.city ? (
                          <span>{submission.profile.city}, {submission.profile.state}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className="gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {submission.submittedAt 
                          ? format(new Date(submission.submittedAt), "dd/MM/yyyy", { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell>{submission.version}</TableCell>
                      <TableCell>
                        {format(new Date(submission.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/kyc/${submission.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Revisar
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminKycQueue;
