import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLegal } from '@/contexts/LegalContext';
import { LEGAL_DOCUMENT_INFO } from '@/types/legal';
import { FileText, Plus, Eye, Edit, Users, Calendar } from 'lucide-react';

const AdminLegalDocuments = () => {
  const { documents, getAcceptanceStats, acceptances } = useLegal();
  const stats = getAcceptanceStats();
  
  // Get unique users count
  const uniqueUsers = new Set(acceptances.map(a => a.userId)).size;
  
  // Group documents by key to show all versions
  const documentsByKey = LEGAL_DOCUMENT_INFO.map(info => {
    const allVersions = documents.filter(d => d.key === info.key).sort((a, b) => b.version - a.version);
    const activeDoc = allVersions.find(d => d.isActive);
    const statForActive = stats.find(s => s.key === info.key && s.version === activeDoc?.version);
    
    return {
      info,
      activeDoc,
      allVersions,
      acceptanceCount: statForActive?.count || 0,
    };
  });
  
  return (
    <AdminLayout title="Documentos Legais" subtitle="Gerencie termos, políticas e regras da plataforma">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{LEGAL_DOCUMENT_INFO.length}</p>
                <p className="text-sm text-muted-foreground">Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{uniqueUsers}</p>
                <p className="text-sm text-muted-foreground">Usuários com aceites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{acceptances.length}</p>
                <p className="text-sm text-muted-foreground">Total de aceites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Edit className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Versões totais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Documents table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documentos</CardTitle>
          <Link to="/admin/legal/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova versão
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Versão Ativa</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Aceites</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsByKey.map(({ info, activeDoc, acceptanceCount }) => (
                <TableRow key={info.key}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{info.title}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">v{activeDoc?.version || 1}</Badge>
                  </TableCell>
                  <TableCell>
                    {activeDoc ? new Date(activeDoc.createdAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }) : '—'}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{acceptanceCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-success/10 text-success border-success/20">
                      Ativo
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={info.route} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/legal/edit/${info.key}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Recent acceptances */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Aceites Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {acceptances.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum aceite registrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Perfil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acceptances.slice(-10).reverse().map((acceptance) => {
                  const docInfo = LEGAL_DOCUMENT_INFO.find(d => d.key === acceptance.documentKey);
                  return (
                    <TableRow key={acceptance.id}>
                      <TableCell className="font-medium">{acceptance.userId}</TableCell>
                      <TableCell>{docInfo?.shortTitle || acceptance.documentKey}</TableCell>
                      <TableCell>
                        <Badge variant="outline">v{acceptance.documentVersion}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(acceptance.acceptedAt).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {acceptance.metadata?.role === 'cuidador' ? 'Cuidador' : 'Familiar'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminLegalDocuments;
