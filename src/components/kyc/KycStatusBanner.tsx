import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { KycStatus, KYC_DOCUMENT_CONFIGS } from '@/types/kyc';
import { cn } from '@/lib/utils';

interface KycStatusBannerProps {
  status: KycStatus;
  pendingItems?: string[];
  rejectionReason?: string;
  rejectionDetails?: string;
}

export function KycStatusBanner({ status, pendingItems, rejectionReason, rejectionDetails }: KycStatusBannerProps) {
  if (status === 'APPROVED') {
    return null; // Don't show banner when approved
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'NOT_STARTED':
      case 'IN_PROGRESS':
        return {
          icon: AlertCircle,
          title: 'Verificação pendente',
          description: 'Finalize sua verificação para começar a receber agendamentos.',
          variant: 'default' as const,
          showButton: true,
          buttonText: 'Completar verificação',
        };
      case 'SUBMITTED':
        return {
          icon: Clock,
          title: 'Em análise',
          description: 'Sua verificação foi enviada e está sendo analisada. Retornaremos em breve.',
          variant: 'default' as const,
          showButton: false,
          buttonText: '',
        };
      case 'NEEDS_MORE_INFO':
        return {
          icon: AlertTriangle,
          title: 'Ajustes necessários',
          description: 'Precisamos de algumas correções na sua verificação.',
          variant: 'destructive' as const,
          showButton: true,
          buttonText: 'Corrigir e reenviar',
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          title: 'Verificação reprovada',
          description: rejectionDetails || 'Sua verificação foi reprovada.',
          variant: 'destructive' as const,
          showButton: true,
          buttonText: 'Corrigir e reenviar',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className="mb-6">
      <Icon className="h-4 w-4" />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{config.description}</p>
        
        {/* Show pending items for NEEDS_MORE_INFO */}
        {status === 'NEEDS_MORE_INFO' && pendingItems && pendingItems.length > 0 && (
          <div className="mt-3">
            <p className="font-medium mb-2">Itens pendentes:</p>
            <ul className="list-disc list-inside space-y-1">
              {pendingItems.map((item) => {
                const docConfig = KYC_DOCUMENT_CONFIGS.find(d => d.type === item);
                return (
                  <li key={item} className="text-sm">
                    {docConfig?.label || item}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {config.showButton && (
          <Button 
            variant={config.variant === 'destructive' ? 'outline' : 'default'}
            size="sm" 
            className="mt-3"
            asChild
          >
            <Link to="/cuidador/verificacao">
              {config.buttonText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
