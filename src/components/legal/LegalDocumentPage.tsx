import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLegal } from '@/contexts/LegalContext';
import { LegalDocumentKey, LEGAL_DOCUMENT_INFO, getDocumentInfo } from '@/types/legal';
import { ArrowLeft, Printer, FileText, Calendar } from 'lucide-react';

interface LegalDocumentPageProps {
  documentKey: LegalDocumentKey;
}

export function LegalDocumentPage({ documentKey }: LegalDocumentPageProps) {
  const { getActiveDocument } = useLegal();
  const document = getActiveDocument(documentKey);
  const info = getDocumentInfo(documentKey);
  
  const otherDocuments = LEGAL_DOCUMENT_INFO.filter(d => d.key !== documentKey);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Documento não encontrado.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Simple markdown to HTML converter
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-4 text-foreground/80">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };
    
    const flushTable = () => {
      if (tableRows.length > 1) {
        const headers = tableRows[0];
        const rows = tableRows.slice(2); // Skip header separator row
        elements.push(
          <div key={`table-${elements.length}`} className="my-4 overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  {headers.map((h, i) => (
                    <th key={i} className="border border-border px-4 py-2 text-left font-semibold">
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-border px-4 py-2">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    };
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Table handling
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (!inTable) {
          flushList();
          inTable = true;
        }
        const cells = trimmed.split('|').filter(c => c.trim() !== '');
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable();
      }
      
      // Empty line
      if (trimmed === '') {
        flushList();
        return;
      }
      
      // Horizontal rule
      if (trimmed === '---') {
        flushList();
        elements.push(<hr key={`hr-${index}`} className="my-6 border-border" />);
        return;
      }
      
      // Headers
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${index}`} className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">
            {trimmed.slice(2)}
          </h1>
        );
        return;
      }
      
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-bold text-foreground mt-6 mb-3">
            {trimmed.slice(3)}
          </h2>
        );
        return;
      }
      
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-foreground mt-4 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
        return;
      }
      
      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true;
        listItems.push(trimmed.slice(2));
        return;
      }
      
      // Flush list if we hit non-list content
      if (inList) {
        flushList();
      }
      
      // Bold text and regular paragraphs
      const processText = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/);
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };
      
      elements.push(
        <p key={`p-${index}`} className="text-foreground/80 my-3 leading-relaxed">
          {processText(trimmed)}
        </p>
      );
    });
    
    // Flush any remaining list/table
    flushList();
    flushTable();
    
    return elements;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 print:pt-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back link - hide on print */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 print:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
            
            {/* Document header */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{document.title}</h1>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Versão {document.version}
                        </span>
                        <span>
                          Atualizado em {document.createdAt.toLocaleDateString('pt-BR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" onClick={handlePrint} className="print:hidden">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Document content */}
            <Card className="mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-lg max-w-none">
                  {renderContent(document.content)}
                </div>
              </CardContent>
            </Card>
            
            {/* Other documents - hide on print */}
            <div className="print:hidden">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Outros documentos legais
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherDocuments.map(doc => (
                  <Link key={doc.key} to={doc.route}>
                    <Card className="hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground">{doc.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
