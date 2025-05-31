'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/ui/Button';
import { FileText, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker with fallbacks
if (typeof window !== 'undefined') {
  // Use the local worker file with correct version
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

interface FilePreviewProps {
  filename: string;
  fileLocation: string;
  onDownload: () => void;
}

export const FilePreview = ({ filename, fileLocation, onDownload }: FilePreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fileExtension = filename.split('.').pop()?.toLowerCase();

  // Debug logging
  useEffect(() => {
    console.log('FilePreview mounted with:', { filename, fileLocation, fileExtension });
  }, [filename, fileLocation, fileExtension]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    console.error('File URL:', fileLocation);
    console.error('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc);
    setError(`無法載入 PDF 檔案: ${error.message}`);
    setIsLoading(false);
  };

  const changePage = (delta: number) => {
    const newPage = pageNumber + delta;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  const changeScale = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
  };

  // PDF Preview
  if (fileExtension === 'pdf') {
    return (
      <div className="space-y-4">
        {/* PDF Controls */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>上一頁</span>
            </Button>
            
            <span className="text-sm text-gray-600">
              第 {pageNumber} 頁，共 {numPages} 頁
            </span>
            
            <Button
              variant="secondary"
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className="flex items-center space-x-1"
            >
              <span>下一頁</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => changeScale(-0.2)}
              disabled={scale <= 0.5}
              className="flex items-center space-x-1"
            >
              <ZoomOut className="h-4 w-4" />
              <span>縮小</span>
            </Button>
            
            <span className="text-sm text-gray-600 min-w-[4rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button
              variant="secondary"
              onClick={() => changeScale(0.2)}
              disabled={scale >= 3}
              className="flex items-center space-x-1"
            >
              <ZoomIn className="h-4 w-4" />
              <span>放大</span>
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex justify-center overflow-auto">
          <div className="border border-gray-300 shadow-lg">
            <Document
              file={fileLocation}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex h-96 items-center justify-center">
                  <div className="text-center">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-gray-500">載入 PDF 中...</p>
                  </div>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        </div>

        {error && (
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={onDownload} variant="secondary" className="mt-2">
              下載檔案查看
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Image Preview
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension || '')) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="max-w-full overflow-auto rounded-lg border border-gray-300 shadow-lg">
            <img
              src={fileLocation}
              alt={filename}
              className="max-h-96 max-w-full object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('無法載入圖片檔案');
                setIsLoading(false);
              }}
            />
          </div>
        </div>
        
        {error && (
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={onDownload} variant="secondary" className="mt-2">
              下載檔案查看
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Text Preview (for small text files)
  if (['txt', 'md', 'json', 'csv'].includes(fileExtension || '')) {
    const [textContent, setTextContent] = useState<string>('');

    useEffect(() => {
      const fetchTextContent = async () => {
        try {
          const response = await fetch(fileLocation);
          if (response.ok) {
            const text = await response.text();
            // Limit preview to first 5000 characters
            setTextContent(text.length > 5000 ? text.substring(0, 5000) + '\n\n... (檔案已截斷，請下載查看完整內容)' : text);
          } else {
            setError('無法載入文字檔案');
          }
        } catch (err) {
          setError('無法載入文字檔案');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTextContent();
    }, [fileLocation]);

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
            {textContent}
          </pre>
        </div>
        
        {error && (
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={onDownload} variant="secondary" className="mt-2">
              下載檔案查看
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Unsupported file types
  return (
    <div className="text-center text-gray-500">
      <FileText className="mx-auto mb-4 h-16 w-16" />
      <h3 className="mb-2 text-lg font-medium">不支援預覽</h3>
      <p className="mb-4">
        此檔案類型 (.{fileExtension}) 目前不支援線上預覽。
        <br />
        請下載檔案查看完整內容。
      </p>
      <Button onClick={onDownload} variant="secondary">
        <Download className="mr-2 h-4 w-4" />
        下載檔案查看
      </Button>
    </div>
  );
}; 