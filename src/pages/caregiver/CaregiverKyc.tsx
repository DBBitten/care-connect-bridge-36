import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CaregiverLayout } from '@/components/caregiver/CaregiverLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KycProgressBar } from '@/components/kyc/KycProgressBar';
import { KycDocumentCard } from '@/components/kyc/KycDocumentCard';
import { CpfInput } from '@/components/kyc/CpfInput';
import { useKyc } from '@/contexts/KycContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLegal } from '@/contexts/LegalContext';
import { KYC_DOCUMENT_CONFIGS, KycDocumentType } from '@/types/kyc';
import { LegalDocumentKey } from '@/types/legal';
import { validateBirthDate, formatPhone, validatePhone } from '@/lib/validators';
import { ArrowLeft, ArrowRight, Send, CheckCircle, Clock, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const STEPS = [
  { id: 0, label: 'Termos' },
  { id: 1, label: 'Dados Pessoais' },
  { id: 2, label: 'Documentos' },
  { id: 3, label: 'Revisão' },
];

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const CaregiverKyc = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    currentSubmission, 
    kycStatus, 
    saveProfile, 
    uploadDocument, 
    removeDocument, 
    submitForReview,
    resubmit 
  } = useKyc();
  const { hasAccepted, acceptDocument } = useLegal();

  // Check if caregiver terms are already accepted
  const hasCaregiverTerms = hasAccepted('CAREGIVER_LIABILITY_TERM');
  const hasMarketplaceRules = hasAccepted('MARKETPLACE_RULES');
  const hasAllCaregiverTerms = hasCaregiverTerms && hasMarketplaceRules;

  const [currentStep, setCurrentStep] = useState(hasAllCaregiverTerms ? 1 : 0);
  
  // Form state for step 0 (terms)
  const [acceptedCaregiverTerm, setAcceptedCaregiverTerm] = useState(hasCaregiverTerms);
  const [acceptedMarketplaceRules, setAcceptedMarketplaceRules] = useState(hasMarketplaceRules);
  
  // Form state for step 1
  const [cpf, setCpf] = useState(currentSubmission?.profile?.cpf || '');
  const [cpfValid, setCpfValid] = useState(false);
  const [birthDate, setBirthDate] = useState(currentSubmission?.profile?.birthDate || '');
  const [city, setCity] = useState(currentSubmission?.profile?.city || 'Porto Alegre');
  const [state, setState] = useState(currentSubmission?.profile?.state || 'RS');
  const [phone, setPhone] = useState(currentSubmission?.profile?.phone || '');
  
  // Form state for step 3
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Update form when submission changes
  useEffect(() => {
    if (currentSubmission?.profile) {
      setCpf(currentSubmission.profile.cpf);
      setBirthDate(currentSubmission.profile.birthDate);
      setCity(currentSubmission.profile.city);
      setState(currentSubmission.profile.state);
      setPhone(currentSubmission.profile.phone || '');
    }
  }, [currentSubmission]);

  // Check if step 0 is valid (terms accepted)
  const isStep0Valid = acceptedCaregiverTerm && acceptedMarketplaceRules;

  // Check if step 1 is valid
  const isStep1Valid = cpfValid && birthDate && validateBirthDate(birthDate) && city && state && validatePhone(phone);
  
  // Handle step 0 save (accept terms)
  const handleAcceptTerms = () => {
    if (acceptedCaregiverTerm) {
      acceptDocument('CAREGIVER_LIABILITY_TERM');
    }
    if (acceptedMarketplaceRules) {
      acceptDocument('MARKETPLACE_RULES');
    }
    toast({
      title: 'Termos aceitos',
      description: 'Você aceitou os termos do cuidador.',
    });
    setCurrentStep(1);
  };

  // Check required documents for step 2
  const getDocumentByType = (type: KycDocumentType) => 
    currentSubmission?.documents.find(d => d.type === type);

  const requiredDocs = KYC_DOCUMENT_CONFIGS.filter(c => c.required);
  const hasAllRequiredDocs = requiredDocs.every(doc => getDocumentByType(doc.type));

  // Handle step 1 save
  const handleSaveProfile = () => {
    saveProfile({
      cpf,
      birthDate,
      city,
      state,
      phone,
    });
    toast({
      title: 'Dados salvos',
      description: 'Seus dados pessoais foram salvos com sucesso.',
    });
    setCurrentStep(2);
  };

  // Handle document upload
  const handleUpload = async (type: KycDocumentType, file: File) => {
    await uploadDocument(type, file);
    toast({
      title: 'Documento enviado',
      description: 'Seu documento foi carregado com sucesso.',
    });
  };

  // Handle document remove
  const handleRemove = (documentId: string) => {
    removeDocument(documentId);
    toast({
      title: 'Documento removido',
      description: 'O documento foi removido.',
      variant: 'destructive',
    });
  };

  // Handle submission
  const handleSubmit = () => {
    if (kycStatus === 'REJECTED' || kycStatus === 'NEEDS_MORE_INFO') {
      resubmit();
    } else {
      submitForReview();
    }
    toast({
      title: 'Verificação enviada!',
      description: 'Sua verificação foi enviada para análise. Retornaremos em breve.',
    });
  };

  // If already submitted/approved, show status
  if (kycStatus === 'SUBMITTED') {
    return (
      <CaregiverLayout title="Verificação" subtitle="Status da sua verificação de identidade">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Em análise</h2>
            <p className="text-muted-foreground mb-6">
              Sua verificação foi enviada e está sendo analisada pela nossa equipe.
              Retornaremos em breve com o resultado.
            </p>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                Enviado em: {currentSubmission?.submittedAt ? new Date(currentSubmission.submittedAt).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </CaregiverLayout>
    );
  }

  if (kycStatus === 'APPROVED') {
    return (
      <CaregiverLayout title="Verificação" subtitle="Status da sua verificação de identidade">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Verificação aprovada!</h2>
            <p className="text-muted-foreground mb-6">
              Parabéns! Sua verificação foi aprovada. Agora você pode receber agendamentos
              e atender pacientes na plataforma.
            </p>
            <div className="bg-success/10 rounded-xl p-4">
              <p className="text-sm text-success">
                Aprovado em: {currentSubmission?.reviewedAt ? new Date(currentSubmission.reviewedAt).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </CaregiverLayout>
    );
  }

  return (
    <CaregiverLayout title="Verificação" subtitle="Complete sua verificação para começar a receber agendamentos">
      <div className="max-w-3xl mx-auto">
        {/* Status alerts for rejected/needs more info */}
        {kycStatus === 'REJECTED' && currentSubmission?.rejectionDetails && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verificação reprovada</AlertTitle>
            <AlertDescription>
              {currentSubmission.rejectionDetails}
              <p className="mt-2 font-medium">Corrija os problemas indicados e reenvie sua verificação.</p>
            </AlertDescription>
          </Alert>
        )}

        {kycStatus === 'NEEDS_MORE_INFO' && currentSubmission?.pendingItems && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ajustes necessários</AlertTitle>
            <AlertDescription>
              <p>Precisamos de algumas correções na sua verificação:</p>
              <ul className="list-disc list-inside mt-2">
                {currentSubmission.pendingItems.map(item => {
                  const doc = KYC_DOCUMENT_CONFIGS.find(d => d.type === item);
                  return <li key={item}>{doc?.label || item}</li>;
                })}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Progress bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <KycProgressBar steps={STEPS} currentStep={currentStep} />
          </CardContent>
        </Card>

        {/* Step 0: Caregiver Terms */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Termos do Cuidador</CardTitle>
                  <CardDescription>
                    Antes de iniciar, leia e aceite os termos específicos para cuidadores.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para atuar como cuidador na plataforma Cuidare, você precisa aceitar:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border rounded-xl bg-background">
                    <Checkbox
                      id="caregiver-term"
                      checked={acceptedCaregiverTerm}
                      onCheckedChange={(checked) => setAcceptedCaregiverTerm(checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="caregiver-term" className="text-sm font-medium cursor-pointer">
                        Li e aceito o{' '}
                        <Link
                          to="/termo-cuidador"
                          target="_blank"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Termo de Responsabilidade do Cuidador
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Define suas responsabilidades, limites de atuação e conduta profissional.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 border rounded-xl bg-background">
                    <Checkbox
                      id="marketplace-rules"
                      checked={acceptedMarketplaceRules}
                      onCheckedChange={(checked) => setAcceptedMarketplaceRules(checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="marketplace-rules" className="text-sm font-medium cursor-pointer">
                        Li e aceito as{' '}
                        <Link
                          to="/regras"
                          target="_blank"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Regras do Marketplace
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        O que pode e não pode fazer como cuidador na plataforma.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleAcceptTerms} disabled={!isStep0Valid}>
                  Aceitar e continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Personal Data */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>
                Preencha seus dados pessoais para iniciar a verificação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={user?.email?.split('@')[0] || 'Usuário'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Nome vinculado à sua conta</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <CpfInput
                  value={cpf}
                  onChange={(value, isValid) => {
                    setCpf(value);
                    setCpfValid(isValid);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
                {birthDate && !validateBirthDate(birthDate) && (
                  <p className="text-sm text-destructive">Você deve ter pelo menos 18 anos</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Porto Alegre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAZILIAN_STATES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(51) 99999-9999"
                  maxLength={15}
                />
                {phone && !validatePhone(phone) && (
                  <p className="text-sm text-destructive">Telefone inválido</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} disabled={!isStep1Valid}>
                  Salvar e continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documents */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>
                  Envie os documentos necessários para sua verificação. Documentos obrigatórios estão marcados.
                </CardDescription>
              </CardHeader>
            </Card>

            {KYC_DOCUMENT_CONFIGS.map(config => (
              <KycDocumentCard
                key={config.type}
                config={config}
                document={getDocumentByType(config.type)}
                onUpload={(file) => handleUpload(config.type, file)}
                onRemove={() => {
                  const doc = getDocumentByType(config.type);
                  if (doc) handleRemove(doc.id);
                }}
              />
            ))}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={() => setCurrentStep(3)} disabled={!hasAllRequiredDocs}>
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Submit */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Revisão e Envio</CardTitle>
              <CardDescription>
                Revise suas informações antes de enviar para análise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal data summary */}
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-foreground">Dados Pessoais</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-muted-foreground">CPF:</p>
                  <p className="text-foreground">{currentSubmission?.profile?.cpf || cpf}</p>
                  <p className="text-muted-foreground">Data de nascimento:</p>
                  <p className="text-foreground">{birthDate ? new Date(birthDate + 'T12:00:00').toLocaleDateString('pt-BR') : '-'}</p>
                  <p className="text-muted-foreground">Cidade/Estado:</p>
                  <p className="text-foreground">{city}, {state}</p>
                  <p className="text-muted-foreground">Telefone:</p>
                  <p className="text-foreground">{phone || '-'}</p>
                </div>
              </div>

              {/* Documents checklist */}
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-foreground">Documentos enviados</h4>
                {KYC_DOCUMENT_CONFIGS.map(config => {
                  const doc = getDocumentByType(config.type);
                  return (
                    <div key={config.type} className="flex items-center gap-3">
                      {doc ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 ${config.required ? 'border-destructive' : 'border-muted-foreground'}`} />
                      )}
                      <span className={doc ? 'text-foreground' : 'text-muted-foreground'}>
                        {config.label}
                        {!doc && config.required && <span className="text-destructive ml-1">*</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-3 p-4 border rounded-xl">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  Declaro que todas as informações fornecidas são verdadeiras e que os documentos
                  enviados são autênticos. Estou ciente de que informações falsas podem resultar
                  em suspensão permanente da plataforma.
                </Label>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!hasAllRequiredDocs || !acceptedTerms}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar para análise
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverKyc;
