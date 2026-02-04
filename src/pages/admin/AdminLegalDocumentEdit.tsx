import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLegal } from '@/contexts/LegalContext';
import { LegalDocumentKey, LEGAL_DOCUMENT_INFO } from '@/types/legal';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, AlertTriangle } from 'lucide-react';

const AdminLegalDocumentEdit = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const { getActiveDocument, createNewVersion } = useLegal();
  
  const [selectedKey, setSelectedKey] = useState<LegalDocumentKey | ''>(key as LegalDocumentKey || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [forceReacceptance, setForceReacceptance] = useState(false);
  
  // Load existing document if editing
  useEffect(() => {
    if (key) {
      const doc = getActiveDocument(key as LegalDocumentKey);
      if (doc) {
        setSelectedKey(doc.key);
        setTitle(doc.title);
        setContent(doc.content);
      }
    }
  }, [key, getActiveDocument]);
  
  const handleSave = () => {
    if (!selectedKey || !title || !content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    createNewVersion(selectedKey, title, content, forceReacceptance);
    toast.success('Nova versão publicada com sucesso!');
    navigate('/admin/legal');
  };
  
  const docInfo = selectedKey ? LEGAL_DOCUMENT_INFO.find(d => d.key === selectedKey) : null;
  const currentDoc = selectedKey ? getActiveDocument(selectedKey) : null;
  
  return (
    <AdminLayout title={key ? 'Editar Documento' : 'Novo Documento'} subtitle="Crie ou atualize um documento legal">
      <button
        onClick={() => navigate('/admin/legal')}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Documento</CardTitle>
              <CardDescription>
                {key ? 'Edite o documento para criar uma nova versão' : 'Selecione o tipo e preencha os campos'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Documento</Label>
                <Select 
                  value={selectedKey} 
                  onValueChange={(value) => {
                    setSelectedKey(value as LegalDocumentKey);
                    const info = LEGAL_DOCUMENT_INFO.find(d => d.key === value);
                    if (info) setTitle(info.title);
                    const doc = getActiveDocument(value as LegalDocumentKey);
                    if (doc) setContent(doc.content);
                  }}
                  disabled={!!key}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEGAL_DOCUMENT_INFO.map(info => (
                      <SelectItem key={info.key} value={info.key}>
                        {info.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título do documento"
                />
              </div>
              
              {currentDoc && (
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  <p className="text-muted-foreground">
                    Versão atual: <strong className="text-foreground">v{currentDoc.version}</strong>
                  </p>
                  <p className="text-muted-foreground">
                    Salvar criará a <strong className="text-foreground">v{currentDoc.version + 1}</strong>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo (Markdown)</CardTitle>
              <CardDescription>
                Use Markdown para formatar o documento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Título&#10;&#10;Conteúdo do documento..."
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Opções de Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-xl bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="reaccept"
                      checked={forceReacceptance}
                      onCheckedChange={(checked) => setForceReacceptance(checked as boolean)}
                    />
                    <Label htmlFor="reaccept" className="font-medium cursor-pointer">
                      Forçar re-aceite
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Usuários que já aceitaram este documento precisarão aceitar novamente.
                  </p>
                </div>
              </div>
              
              <Button onClick={handleSave} className="w-full" disabled={!selectedKey || !title || !content}>
                <Save className="w-4 h-4 mr-2" />
                Publicar Nova Versão
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pré-visualização</CardTitle>
                <Eye className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList className="w-full">
                  <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                  <TabsTrigger value="raw" className="flex-1">Markdown</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4">
                  <div className="prose prose-sm max-w-none max-h-[500px] overflow-y-auto p-4 border rounded-lg bg-background">
                    {content ? (
                      <div dangerouslySetInnerHTML={{ 
                        __html: content
                          .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
                          .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
                          .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-1">$1</h3>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
                          .replace(/^---$/gm, '<hr class="my-4">')
                          .replace(/\n\n/g, '</p><p class="my-2">')
                      }} />
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Digite o conteúdo para ver a pré-visualização
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="raw" className="mt-4">
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
                    {content || 'Nenhum conteúdo'}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLegalDocumentEdit;
