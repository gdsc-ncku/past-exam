'use client';
import { FileUploadField } from '@/components/FileUploadField';
import UploadForm from '@/components/UploadForm';
import { fileAPI } from '@/module/api';
import React, { useState } from 'react';
import JSZip from 'jszip';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFormSchema } from '@/schemas/uploadFormSchema';
import { z } from 'zod';
interface FileWithPreview extends File {
  preview: string;
}
type UploadFormData = z.infer<typeof uploadFormSchema>;
export default function Page() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const methods = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    mode: 'onChange',
    defaultValues: {
      examType: 'midtermExam',
      semester: 'firstSemester',
      isAnonymous: 'anonymous',
    },
  });
  const { trigger, formState } = methods;
  const handleUpload = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const zip = new JSZip();
      files.forEach((file) => {
        zip.file(file.name, file);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const formData = new FormData();
      formData.append('upload_file', zipBlob, 'files.zip');
      formData.append('file_name', 'files.zip');

      await fileAPI.createFile(formData, (progress) => {
        setUploadProgress(50 + Math.round(progress / 2));
      });

      setUploadProgress(100);
    } catch (error) {
      console.error('Upload failed:', (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <div className="mt-20 flex h-full w-full justify-evenly bg-white">
        <UploadForm />
        <div className="flex flex-col justify-center">
          <FileUploadField
            uploadProgress={uploadProgress}
            files={files}
            setFiles={setFiles}
          />
          {files.length > 0 && (
            <div className="mt-4 flex flex-col gap-y-10">
              <div className="flex flex-col gap-y-1">
                <p className="flex justify-end">{uploadProgress + ' %'}</p>
                <div className="mb-2 h-2 w-full overflow-hidden rounded bg-gray-200">
                  <div
                    className="h-2 bg-black transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
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
                  {isUploading ? '上傳中...' : '提交項目'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
