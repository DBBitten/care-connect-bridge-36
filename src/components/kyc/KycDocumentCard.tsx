import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KycDocumentConfig, KycDocument } from '@/types/kyc';
import { validateFileSize, validateFileType, formatFileSize, MAX_FILE_SIZE } from '@/lib/validators';
import { cn } from '@/lib/utils';

interface KycDocumentCardProps {
  config: KycDocumentConfig;
  document?: KycDocument;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  disabled?: boolean;
}

export function KycDocumentCard({ config, document, onUpload, onRemove, disabled }: KycDocumentCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndUpload = async (file: File) => {
    setError(null);

    // Validate file size
    if (!validateFileSize(file)) {
      setError(`Arquivo muito grande. Máximo: ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    // Validate file type
    if (!validateFileType(file, config.acceptedFormats)) {
      const formats = config.acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ');
      setError(`Formato inválido. Aceitos: ${formats}`);
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError('Erro ao fazer upload. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      await validateAndUpload(file);
    }
  }, [disabled, config.acceptedFormats, onUpload]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await validateAndUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const isImage = document?.fileName?.match(/\.(jpg|jpeg|png)$/i);
  const isPdf = document?.fileName?.match(/\.pdf$/i);

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200",
      isDragging && "ring-2 ring-primary border-primary",
      error && "border-destructive"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Document info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-foreground">{config.label}</h4>
              {config.required ? (
                <Badge variant="secondary" className="text-xs">Obrigatório</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Opcional</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{config.description}</p>

            {/* Upload area or preview */}
            {document ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                {isImage ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-background">
                    <img 
                      src={document.fileUrl} 
                      alt={document.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{document.fileName}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(document.fileSize)}</p>
                </div>
                {document.verifiedFlag && (
                  <div className="flex items-center gap-1 text-success">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Verificado</span>
                  </div>
                )}
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={config.acceptedFormats.join(',')}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={disabled}
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Enviando...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arraste ou <span className="text-primary font-medium">clique para selecionar</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {config.acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} • Máx. 10MB
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 mt-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Admin comment */}
            {document?.adminComment && (
              <div className="mt-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning-foreground">{document.adminComment}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
