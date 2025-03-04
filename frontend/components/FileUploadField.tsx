'use client';
import { iconsMap } from '@/ui/iconsMap';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview: string;
}

export const FileUploadField = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
    setFiles((prevFiles) => [...prevFiles, ...mappedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  // const removeFile = (fileName: string): void => {
  //   setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  // };

  // const formatFileSize = (bytes: number): string => {
  //   if (bytes >= 1024 * 1024) {
  //     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  //   }
  //   return `${(bytes / 1024).toFixed(2)} KB`;
  // };

  const handleUpload = () => {
    if (!files.length) return;
    setIsUploading(true);
    setUploadProgress(0);

    const totalSteps = 30;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setUploadProgress(Math.floor((step / totalSteps) * 100));

      if (step >= totalSteps) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 100);
  };
  const ImagePlusIcon = iconsMap['image-plus'];
  const FileDownIcon = iconsMap['file-down'];
  const FolderClosedIcon = iconsMap['folder-closed'];
  return (
    <div className="flex flex-col justify-center gap-y-10">
      <div
        {...getRootProps()}
        className="
  h-         
  group   
  flex   
  w-96        
  flex-col items-center justify-center rounded-xl
  border-2
  border-dashed
  border-gray-300
  bg-white
  p-6
  hover:bg-slate-100
"
      >
        <div className="flex h-full w-full flex-col justify-center rounded-xl p-5">
          <input {...getInputProps()} />
          <div className="flex items-end justify-center gap-3">
            <ImagePlusIcon className="size-12" />

            <FileDownIcon className="size-20" />

            <FolderClosedIcon className="size-12" />
          </div>
          <p className="text-center text-black">拖曳檔案到這裡</p>
          <p className="text-center text-black">或</p>
          <button
            type="button"
            className="bg-secondary-50 mt-2 max-w-40 self-center rounded bg-primary-100 px-4 py-2 text-black  hover:bg-primary-200 group-hover:bg-primary-200"
          >
            新增檔案
          </button>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-4 flex flex-col gap-y-10">
          <div className="mb-2 h-2 w-full overflow-hidden rounded bg-gray-200">
            <div
              className="h-2 bg-black transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`rounded px-4 py-2 text-black ${
                isUploading
                  ? 'bg-gray-400'
                  : 'bg-primary-300 hover:bg-primary-100'
              }`}
            >
              {isUploading ? '上傳中...' : '上傳'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
