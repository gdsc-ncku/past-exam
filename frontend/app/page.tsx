import { FileUploadField } from '@/components/FileUploadField';
import { ExamCard } from '@/components/ExamCard/ExamCard';

export default function Page() {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium text-gray-300">Examples</h1>

      <div className="space-y-10 bg-cyan-700 text-white">
        <FileUploadField />
      </div>
      <div className="space-y-10 bg-red-700 text-white">
        <ExamCard />
      </div>
      <div className="space-y-10 text-white">xxsx</div>
    </div>
  );
}
