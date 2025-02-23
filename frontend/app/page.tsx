'use client';
import { useState } from 'react';
import { TextwithIcon } from '@/ui/Button';
import { Icon } from '@/ui/icons';

export default function Page() {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Welcome to the Exam Portal</h1>
        <p className="text-gray-600">
          This is the main page of the exam portal. Here you can find all the
          information you need about the exams.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <TextwithIcon>
          <Icon name="arrow-left-right" className="text-red-500" />
        </TextwithIcon>
      </div>
    </div>
  );
}
