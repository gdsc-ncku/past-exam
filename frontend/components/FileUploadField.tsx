'use client';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview: string;
}

export const FileUploadField = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

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

  const removeFile = (fileName: string): void => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <>
      <div
        {...getRootProps()}
        className="relative h-[50vh] cursor-pointer gap-y-4 rounded-2xl border-2 border-dotted border-gray-400 p-1 text-center transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 hover:bg-cyan-600"
      >
        <div className="flex h-full w-full flex-col justify-center rounded-xl border-2 border-dotted p-5">
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select files</p>
          <button
            type="button"
            className="mt-2 max-w-40 self-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Select Files
          </button>
        </div>
      </div>
      {files.length !== 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Selected Files</h3>
          <ul className="mt-2 space-y-4">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-xl border border-gray-300 p-2"
              >
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
                      {`${file.name.split('.')[1]} - ${formatFileSize(file.size)}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="rounded-lg bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
