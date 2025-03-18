'use client';
import { iconsMap } from '@/ui/iconsMap';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview: string;
}

interface FileUploadFieldProps {
  uploadProgress: number;
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  uploadProgress,
  files,
  setFiles,
}) => {
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
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
    },
  });

  const ImagePlusIcon = iconsMap['image-plus'];
  const FileDownIcon = iconsMap['file-down'];
  const FolderClosedIcon = iconsMap['folder-closed'];

  return (
    <div className="flex flex-col justify-center gap-y-10">
      <div
        {...getRootProps()}
        className="
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
            className="bg-secondary-50 mt-2 max-w-40 self-center rounded bg-primary-100 px-4 py-2 text-black hover:bg-primary-200 group-hover:bg-primary-200"
          >
            新增檔案
          </button>
        </div>
      </div>
    </div>
  );
};
