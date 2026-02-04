import { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { formatCPF, validateCPF, unformatCPF } from '@/lib/validators';
import { cn } from '@/lib/utils';

interface CpfInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(
  ({ value, onChange, className, disabled }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => formatCPF(value));
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
      setDisplayValue(formatCPF(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const unformatted = unformatCPF(rawValue);
      
      // Limit to 11 digits
      if (unformatted.length > 11) return;
      
      const formatted = formatCPF(unformatted);
      setDisplayValue(formatted);
      
      // Only validate when complete
      if (unformatted.length === 11) {
        const valid = validateCPF(unformatted);
        setIsValid(valid);
        onChange(unformatted, valid);
      } else {
        setIsValid(null);
        onChange(unformatted, false);
      }
    };

    const handleBlur = () => {
      setTouched(true);
      const unformatted = unformatCPF(displayValue);
      if (unformatted.length === 11) {
        setIsValid(validateCPF(unformatted));
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            className,
            touched && isValid === false && "border-destructive focus-visible:ring-destructive",
            touched && isValid === true && "border-success focus-visible:ring-success"
          )}
        />
        {touched && isValid === false && (
          <p className="text-sm text-destructive mt-1">CPF inválido</p>
        )}
      </div>
    );
  }
);

CpfInput.displayName = 'CpfInput';
