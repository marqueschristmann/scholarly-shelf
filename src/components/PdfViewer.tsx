import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configuração necessária para o react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

export const PdfViewer = ({ pdfUrl, onClose }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPageNumber(prev => Math.min(numPages || prev, prev + 1))}
              disabled={pageNumber >= (numPages || 1)}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              Próxima
            </button>
            <span className="self-center">
              Página {pageNumber} de {numPages || '-'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Fechar
          </button>
        </div>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="border shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
};