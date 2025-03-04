import { FileUploadField } from '@/components/FileUploadField';
import UploadForm from '@/components/UploadForm';
import React from 'react';

export default function Page() {
  return (
    <div className="mt-20 flex h-full w-full justify-between bg-white">
      <UploadForm />
      <FileUploadField />
    </div>
  );
}
