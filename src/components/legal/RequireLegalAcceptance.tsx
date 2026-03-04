import { ReactNode, useState, useEffect } from 'react';
import { useLegal } from '@/contexts/LegalContext';
import { useAuth } from '@/contexts/AuthContext';
import { LegalAcceptanceModal } from './LegalAcceptanceModal';
import { LegalDocumentKey } from '@/types/legal';

interface RequireLegalAcceptanceProps {
  children: ReactNode;
  stage: 'registration' | 'kyc' | 'booking';
  onAccepted?: () => void;
}

export function RequireLegalAcceptance({ 
  children, 
  stage,
  onAccepted 
}: RequireLegalAcceptanceProps) {
  const { isAuthenticated, userType } = useAuth();
  const { getPendingDocuments, hasPendingInitialAcceptance, hasPendingCaregiverAcceptance } = useLegal();
  
  const [showModal, setShowModal] = useState(false);
  const [pendingDocs, setPendingDocs] = useState<LegalDocumentKey[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(false);
      return;
    }
    
    let pending: LegalDocumentKey[] = [];
    
    if (stage === 'registration') {
      if (hasPendingInitialAcceptance()) {
        pending = getPendingDocuments('registration');
      }
    } else if (stage === 'kyc') {
      // For KYC, need both initial + caregiver terms
      if (hasPendingInitialAcceptance()) {
        pending = getPendingDocuments('registration');
      } else if (hasPendingCaregiverAcceptance()) {
        pending = getPendingDocuments('kyc');
      }
    } else if (stage === 'booking') {
      // For booking, need initial + marketplace rules
      pending = getPendingDocuments('booking');
      if (hasPendingInitialAcceptance()) {
        pending = [...getPendingDocuments('registration'), ...pending];
      }
    }
    
    setPendingDocs(pending);
    setShowModal(pending.length > 0);
  }, [isAuthenticated, userType, stage, getPendingDocuments, hasPendingInitialAcceptance, hasPendingCaregiverAcceptance]);
  
  const handleAccepted = () => {
    setShowModal(false);
    onAccepted?.();
  };
  
  const getModalTitle = () => {
    if (stage === 'registration') return 'Termos de Uso';
    if (stage === 'kyc') return 'Termos do Cuidador';
    return 'Regras do Marketplace';
  };
  
  const getModalDescription = () => {
    if (stage === 'registration') {
      return 'Para usar a Cuidare, você precisa aceitar nossos termos.';
    }
    if (stage === 'kyc') {
      return 'Para iniciar sua verificação como cuidador, aceite os termos específicos.';
    }
    return 'Para confirmar seu agendamento, aceite as regras do marketplace.';
  };
  
  return (
    <>
      {children}
      
      {showModal && pendingDocs.length > 0 && (
        <LegalAcceptanceModal
          open={showModal}
          onAccepted={handleAccepted}
          title={getModalTitle()}
          description={getModalDescription()}
          requiredDocuments={pendingDocs}
        />
      )}
    </>
  );
}
