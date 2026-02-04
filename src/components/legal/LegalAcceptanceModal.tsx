import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LegalAcceptanceCheckbox } from './LegalAcceptanceCheckbox';
import { useLegal } from '@/contexts/LegalContext';
import { LegalDocumentKey } from '@/types/legal';
import { ShieldCheck } from 'lucide-react';

interface LegalAcceptanceModalProps {
  open: boolean;
  onAccepted: () => void;
  title?: string;
  description?: string;
  requiredDocuments?: LegalDocumentKey[];
}

export function LegalAcceptanceModal({
  open,
  onAccepted,
  title = 'Termos e Condições',
  description = 'Para continuar, você precisa aceitar nossos termos.',
  requiredDocuments = ['TERMS_OF_USE', 'PRIVACY_POLICY'],
}: LegalAcceptanceModalProps) {
  const { acceptMultipleDocuments } = useLegal();
  
  const [checkedState, setCheckedState] = useState<Record<LegalDocumentKey, boolean>>(
    () => requiredDocuments.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<LegalDocumentKey, boolean>)
  );
  
  const allChecked = requiredDocuments.every(key => checkedState[key]);
  
  const handleCheckedChange = (key: LegalDocumentKey, checked: boolean) => {
    setCheckedState(prev => ({ ...prev, [key]: checked }));
  };
  
  const handleAccept = () => {
    acceptMultipleDocuments(requiredDocuments);
    onAccepted();
  };
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {requiredDocuments.map(key => (
            <LegalAcceptanceCheckbox
              key={key}
              documentKey={key}
              checked={checkedState[key]}
              onCheckedChange={(checked) => handleCheckedChange(key, checked)}
            />
          ))}
        </div>
        
        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={!allChecked}
          >
            Aceitar e Continuar
          </Button>
        </DialogFooter>
        
        <p className="text-xs text-center text-muted-foreground">
          Ao aceitar, você confirma que leu e compreendeu os documentos acima.
        </p>
      </DialogContent>
    </Dialog>
  );
}
