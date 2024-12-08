'use client';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import pastExamApi from '@/module/pastExamApi';

interface FileWithPreview extends File {
  preview: string;
}
export const FileUploadField = () => {
  /**
   * @todo
   * 1. Use uploaderId from user global state
   * 2. Handle multiple file submit
   * 3. Handle filename (Base on file or explicit input)
   */
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [uploaderId] = useState(1);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      const mappedFile = Object.assign(uploadedFile, {
        preview: URL.createObjectURL(uploadedFile),
      });
      setFile(mappedFile);
      setFileName(uploadedFile.name);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const removeFile = (): void => {
    setFile(null);
    setFileName('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('No file uploaded!');
      return;
    }

    const formData = new FormData();
    formData.append('upload_file', file);
    formData.append('file_name', fileName || file.name);
    formData.append('uploader_id', uploaderId.toString());

    try {
      const response = await pastExamApi.uploadFile(formData);

      if (response) {
        alert('File uploaded successfully!');
        setFile(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <>
      <div
        {...getRootProps()}
        className="relative h-[50vh] cursor-pointer gap-y-4 rounded-2xl border-2 border-dotted border-gray-400 p-1 text-center transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 hover:bg-cyan-600"
      >
        <div className="flex h-full w-full flex-col justify-center rounded-xl border-2 border-dotted p-5">
          <input {...getInputProps()} />
          <p>Drag & drop a file here, or click to select a file</p>
          <button
            type="button"
            className="mt-2 max-w-40 self-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Select File
          </button>
        </div>
      </div>
      {file && (
        <div className="mt-4">
          <h3 className="font-semibold">Selected File</h3>
          <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-300 p-2">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 overflow-hidden rounded sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
                <Image
                  src={file.preview}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-slate-50">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="rounded-lg bg-red-500 px-2 py-1 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      {file && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Upload
          </button>
        </div>
      )}
    </>
  );
};
