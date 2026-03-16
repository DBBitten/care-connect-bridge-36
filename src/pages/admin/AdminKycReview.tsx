import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useKyc } from '@/contexts/KycContext';
import { KYC_DOCUMENT_CONFIGS, KYC_REJECTION_REASONS, KycDocumentType } from '@/types/kyc';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText, Image, Download, User, Calendar, MapPin, CreditCard, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const AdminKycReview = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    getSubmissionById, 
    approveSubmission, 
    rejectSubmission, 
    requestMoreInfo,
    updateDocumentVerification 
  } = useKyc();

  const submission = getSubmissionById(submissionId || '');
  
  // Local state for document verification
  const [docVerification, setDocVerification] = useState<Record<string, { verified: boolean; comment: string }>>({});
  
  // Notes
  const [notes, setNotes] = useState(submission?.notes || '');
  
  // Rejection dialog state
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionDetails, setRejectionDetails] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  // More info dialog state
  const [pendingItems, setPendingItems] = useState<string[]>([]);
  const [showMoreInfoDialog, setShowMoreInfoDialog] = useState(false);

  // Initialize doc verification from submission
  useEffect(() => {
    if (submission?.documents) {
      const initial: Record<string, { verified: boolean; comment: string }> = {};
      submission.documents.forEach(doc => {
        initial[doc.id] = {
          verified: doc.verifiedFlag,
          comment: doc.adminComment || '',
        };
      });
      setDocVerification(initial);
    }
  }, [submissionId]);

  if (!submission) {
    return (
      <AdminLayout title="Revisão KYC" subtitle="">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Submissão não encontrada.</p>
            <Button className="mt-4" onClick={() => navigate('/admin/kyc')}>
              Voltar para a fila
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const handleApprove = () => {
    // Save all doc verifications
    Object.entries(docVerification).forEach(([docId, data]) => {
      updateDocumentVerification(submission.id, docId, data.verified, data.comment);
    });
    
    approveSubmission(submission.id, notes);
    toast({
      title: 'Verificação aprovada',
      description: `A verificação de ${submission.userName} foi aprovada com sucesso.`,
    });
    navigate('/admin/kyc');
  };

  const handleReject = () => {
    if (!rejectionReason || !rejectionDetails) {
      toast({
        title: 'Erro',
        description: 'Preencha o motivo e os detalhes da reprovação.',
        variant: 'destructive',
      });
      return;
    }
    
    rejectSubmission(submission.id, rejectionReason, rejectionDetails);
    toast({
      title: 'Verificação reprovada',
      description: `A verificação de ${submission.userName} foi reprovada.`,
      variant: 'destructive',
    });
    setShowRejectDialog(false);
    navigate('/admin/kyc');
  };

  const handleRequestMoreInfo = () => {
    if (pendingItems.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um item pendente.',
        variant: 'destructive',
      });
      return;
    }
    
    requestMoreInfo(submission.id, pendingItems, notes);
    toast({
      title: 'Ajustes solicitados',
      description: `Foi solicitado ajustes para ${submission.userName}.`,
    });
    setShowMoreInfoDialog(false);
    navigate('/admin/kyc');
  };

  const getDocumentByType = (type: KycDocumentType) => 
    submission.documents.find(d => d.type === type);

  const isImage = (fileName: string) => /\.(jpg|jpeg|png)$/i.test(fileName);

  return (
    <AdminLayout title="Revisão de Verificação" subtitle={`Analisando submissão de ${submission.userName}`}>
      <Button variant="ghost" onClick={() => navigate('/admin/kyc')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a fila
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Data and Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Caregiver Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados do Cuidador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{submission.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{submission.profile?.cpf || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de nascimento</p>
                    <p className="font-medium">
                      {submission.profile?.birthDate 
                        ? format(new Date(submission.profile.birthDate + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
                        : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cidade/Estado</p>
                    <p className="font-medium">
                      {submission.profile?.city}, {submission.profile?.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{submission.profile?.phone || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos Enviados
              </CardTitle>
              <CardDescription>
                Verifique cada documento e marque como verificado ou adicione comentários.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {KYC_DOCUMENT_CONFIGS.map(config => {
                const doc = getDocumentByType(config.type);
                const verification = doc ? docVerification[doc.id] : null;

                return (
                  <div key={config.type} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {config.label}
                          {config.required && <Badge variant="secondary" className="text-xs">Obrigatório</Badge>}
                        </h4>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                      {doc && verification && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={verification.verified}
                            onCheckedChange={(checked) => {
                              setDocVerification(prev => ({
                                ...prev,
                                [doc.id]: { ...prev[doc.id], verified: checked as boolean }
                              }));
                            }}
                          />
                          <Label className="text-sm">Verificado</Label>
                        </div>
                      )}
                    </div>

                    {doc ? (
                      <div className="space-y-3">
                        {/* Document preview */}
                        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                          {isImage(doc.fileName) ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-background">
                              <img 
                                src={doc.fileUrl} 
                                alt={doc.fileName}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => window.open(doc.fileUrl, '_blank')}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-primary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-muted-foreground">
                              Enviado em {format(new Date(doc.uploadedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                            <Download className="w-4 h-4 mr-1" />
                            Abrir
                          </Button>
                        </div>

                        {/* Admin comment */}
                        {verification && (
                          <div>
                            <Label className="text-sm">Comentário (visível para o cuidador)</Label>
                            <Textarea
                              placeholder="Adicione um comentário sobre este documento..."
                              value={verification.comment}
                              onChange={(e) => {
                                setDocVerification(prev => ({
                                  ...prev,
                                  [doc.id]: { ...prev[doc.id], comment: e.target.value }
                                }));
                              }}
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                        Documento não enviado
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Actions */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={
                  submission.status === 'APPROVED' ? 'secondary' :
                  submission.status === 'REJECTED' ? 'destructive' :
                  submission.status === 'SUBMITTED' ? 'default' : 'outline'
                }
                className="text-sm"
              >
                {submission.status === 'APPROVED' && 'Aprovado'}
                {submission.status === 'REJECTED' && 'Reprovado'}
                {submission.status === 'SUBMITTED' && 'Aguardando análise'}
                {submission.status === 'NEEDS_MORE_INFO' && 'Pendente'}
                {submission.status === 'IN_PROGRESS' && 'Em progresso'}
                {submission.status === 'NOT_STARTED' && 'Não iniciado'}
              </Badge>
              <div className="mt-4 text-sm text-muted-foreground space-y-1">
                <p>Versão: {submission.version}</p>
                {submission.submittedAt && (
                  <p>Enviado: {format(new Date(submission.submittedAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                )}
                {submission.reviewedAt && (
                  <p>Revisado: {format(new Date(submission.reviewedAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notas Internas</CardTitle>
              <CardDescription>Estas notas não são visíveis para o cuidador.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Adicione notas internas sobre esta verificação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-success hover:bg-success/90" 
                onClick={handleApprove}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </Button>

              <Dialog open={showMoreInfoDialog} onOpenChange={setShowMoreInfoDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-warning text-warning hover:bg-warning/10">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Solicitar ajustes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar mais informações</DialogTitle>
                    <DialogDescription>
                      Selecione os itens que precisam ser corrigidos ou reenviados.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    {KYC_DOCUMENT_CONFIGS.map(config => (
                      <div key={config.type} className="flex items-center gap-2">
                        <Checkbox
                          checked={pendingItems.includes(config.type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPendingItems(prev => [...prev, config.type]);
                            } else {
                              setPendingItems(prev => prev.filter(i => i !== config.type));
                            }
                          }}
                        />
                        <Label>{config.label}</Label>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowMoreInfoDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleRequestMoreInfo}>
                      Enviar solicitação
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reprovar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reprovar verificação</DialogTitle>
                    <DialogDescription>
                      Informe o motivo da reprovação. O cuidador poderá corrigir e reenviar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Motivo</Label>
                      <Select value={rejectionReason} onValueChange={setRejectionReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {KYC_REJECTION_REASONS.map(reason => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Detalhes (obrigatório)</Label>
                      <Textarea
                        placeholder="Explique com mais detalhes o motivo da reprovação..."
                        value={rejectionDetails}
                        onChange={(e) => setRejectionDetails(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleReject}>
                      Confirmar reprovação
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminKycReview;
