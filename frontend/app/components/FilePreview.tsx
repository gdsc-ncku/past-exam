'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/ui/Button';
import {
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Polyfill for Promise.withResolvers (for Node.js < 22)
if (!Promise.withResolvers) {
  Promise.withResolvers = function <T>() {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
  };
}

// Set up PDF.js worker with fallbacks
if (typeof window !== 'undefined') {
  // Try multiple worker sources with fallbacks
  const workerSources = [
    '/pdf.worker.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js',
    'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.js',
  ];

  // Use the local worker file with correct version
  pdfjs.GlobalWorkerOptions.workerSrc = workerSources[0];

  // Add debug logging
  console.log('PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
  console.log('PDF.js version:', pdfjs.version);
}

interface FilePreviewProps {
  filename: string;
  fileLocation: string;
  onDownload: () => void;
}

export const FilePreview = ({
  filename,
  fileLocation,
  onDownload,
}: FilePreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('');

  const fileExtension = filename.split('.').pop()?.toLowerCase();

  // Responsive scale settings
  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth < 768) {
        setScale(0.8); // Smaller scale for mobile
      } else if (window.innerWidth < 1024) {
        setScale(1.0); // Medium scale for tablets
      } else {
        setScale(1.2); // Default scale for desktop
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('FilePreview mounted with:', {
      filename,
      fileLocation,
      fileExtension,
      workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    });
  }, [filename, fileLocation, fileExtension]);

  // Text content fetching for text files
  useEffect(() => {
    if (['txt', 'md', 'json', 'csv'].includes(fileExtension || '')) {
      const fetchTextContent = async () => {
        try {
          const response = await fetch(fileLocation);
          if (response.ok) {
            const text = await response.text();
            // Limit preview to first 5000 characters
            setTextContent(
              text.length > 5000
                ? text.substring(0, 5000) +
                    '\n\n... (檔案已截斷，請下載查看完整內容)'
                : text,
            );
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
    }
  }, [fileLocation, fileExtension]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully:', { numPages, fileLocation });
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', {
      error: error.message,
      fileLocation,
      workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
      stack: error.stack,
    });
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
        {/* PDF Controls - Mobile Responsive */}
        <div className="flex flex-col space-y-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Page Navigation */}
          <div className="flex items-center justify-center space-x-2 sm:justify-start sm:space-x-4">
            <Button
              variant="secondary"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">上一頁</span>
              <span className="sm:hidden">上一頁</span>
            </Button>

            <span className="whitespace-nowrap text-xs text-gray-600 sm:text-sm">
              第 {pageNumber} 頁，共 {numPages} 頁
            </span>

            <Button
              variant="secondary"
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">下一頁</span>
              <span className="sm:hidden">下一頁</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => changeScale(-0.2)}
              disabled={scale <= 0.5}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">縮小</span>
            </Button>

            <span className="min-w-[3rem] text-center text-xs text-gray-600 sm:min-w-[4rem] sm:text-sm">
              {Math.round(scale * 100)}%
            </span>

            <Button
              variant="secondary"
              onClick={() => changeScale(0.2)}
              disabled={scale >= 3}
              className="flex items-center space-x-1 text-xs sm:text-sm"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">放大</span>
            </Button>
          </div>
        </div>

        {/* PDF Viewer - Mobile Responsive */}
        <div className="flex justify-center">
          <div className="w-full max-w-full overflow-auto">
            <div
              className="mx-auto border border-gray-300 shadow-lg"
              style={{ width: 'fit-content' }}
            >
              <Document
                file={fileLocation}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex h-64 items-center justify-center sm:h-96">
                    <div className="text-center">
                      <FileText className="mx-auto mb-2 h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                      <p className="text-sm text-gray-500 sm:text-base">
                        載入 PDF 中...
                      </p>
                    </div>
                  </div>
                }
                error={
                  <div className="flex h-64 items-center justify-center sm:h-96">
                    <div className="p-4 text-center text-red-600">
                      <FileText className="mx-auto mb-2 h-6 w-6 sm:h-8 sm:w-8" />
                      <p className="mb-2 text-sm sm:text-base">PDF 載入失敗</p>
                      <Button
                        onClick={onDownload}
                        variant="secondary"
                        className="text-xs sm:text-sm"
                      >
                        下載檔案查看
                      </Button>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="max-w-full"
                  error={
                    <div className="flex h-64 items-center justify-center sm:h-96">
                      <div className="text-center text-red-600">
                        <p className="text-sm sm:text-base">頁面載入失敗</p>
                      </div>
                    </div>
                  }
                />
              </Document>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 text-center text-red-600">
            <p className="mb-2 text-sm sm:text-base">{error}</p>
            <Button
              onClick={onDownload}
              variant="secondary"
              className="text-xs sm:text-sm"
            >
              下載檔案查看
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Image Preview - Mobile Responsive
  if (
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension || '')
  ) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-full max-w-full overflow-auto rounded-lg border border-gray-300 shadow-lg">
            <img
              src={fileLocation}
              alt={filename}
              className="h-auto max-h-64 w-full object-contain sm:max-h-96"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('無法載入圖片檔案');
                setIsLoading(false);
              }}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 text-center text-red-600">
            <p className="mb-2 text-sm sm:text-base">{error}</p>
            <Button
              onClick={onDownload}
              variant="secondary"
              className="text-xs sm:text-sm"
            >
              下載檔案查看
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Text Preview - Mobile Responsive
  if (['txt', 'md', 'json', 'csv'].includes(fileExtension || '')) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 sm:p-4">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-gray-800 sm:text-sm">
            {textContent}
          </pre>
        </div>

        {error && (
          <div className="p-4 text-center text-red-600">
            <p className="mb-2 text-sm sm:text-base">{error}</p>
            <Button
              onClick={onDownload}
              variant="secondary"
              className="text-xs sm:text-sm"
            >
              下載檔案查看
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Unsupported file types - Mobile Responsive
  return (
    <div className="p-4 text-center text-gray-500">
      <FileText className="mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16" />
      <h3 className="mb-2 text-base font-medium sm:text-lg">不支援預覽</h3>
      <p className="mb-4 text-sm sm:text-base">
        此檔案類型 (.{fileExtension}) 目前不支援線上預覽。
        <br />
        請下載檔案查看完整內容。
      </p>
      <Button
        onClick={onDownload}
        variant="secondary"
        className="text-xs sm:text-sm"
      >
        <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        下載檔案查看
      </Button>
    </div>
  );
};
