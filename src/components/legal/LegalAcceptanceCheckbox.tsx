import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LegalDocumentKey, getDocumentInfo } from '@/types/legal';
import { ExternalLink } from 'lucide-react';

interface LegalAcceptanceCheckboxProps {
  documentKey: LegalDocumentKey;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  customLabel?: string;
  showExternalLink?: boolean;
  disabled?: boolean;
}

export function LegalAcceptanceCheckbox({
  documentKey,
  checked,
  onCheckedChange,
  customLabel,
  showExternalLink = true,
  disabled = false,
}: LegalAcceptanceCheckboxProps) {
  const info = getDocumentInfo(documentKey);
  
  if (!info) return null;
  
  const id = `legal-${documentKey.toLowerCase()}`;
  
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        disabled={disabled}
        className="mt-0.5"
      />
      <Label htmlFor={id} className="text-sm leading-relaxed cursor-pointer">
        {customLabel || (
          <>
            Li e aceito{' '}
            <Link
              to={info.route}
              target="_blank"
              className="text-primary hover:underline inline-flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {info.title}
              {showExternalLink && <ExternalLink className="w-3 h-3" />}
            </Link>
          </>
        )}
      </Label>
    </div>
  );
}

interface MultipleAcceptanceCheckboxesProps {
  documentKeys: LegalDocumentKey[];
  checkedState: Record<LegalDocumentKey, boolean>;
  onCheckedChange: (key: LegalDocumentKey, checked: boolean) => void;
  disabled?: boolean;
}

export function MultipleAcceptanceCheckboxes({
  documentKeys,
  checkedState,
  onCheckedChange,
  disabled = false,
}: MultipleAcceptanceCheckboxesProps) {
  return (
    <div className="space-y-4">
      {documentKeys.map(key => (
        <LegalAcceptanceCheckbox
          key={key}
          documentKey={key}
          checked={checkedState[key] || false}
          onCheckedChange={(checked) => onCheckedChange(key, checked)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
