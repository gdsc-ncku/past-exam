import { Icon } from '@/ui/icons';

interface CourseTitleProps {
  title: string;
  courseId: string;
  professor: string;
  date: string;
  section: string;
}

export const CourseTitle = ({
  title,
  courseId,
  professor,
  date,
  section,
}: CourseTitleProps) => {
  return (
    <div className="mb-8">
      <p className="text-small text-secondary">{courseId}</p>
      <h1 className="text-h1">{title}</h1>
      <div className="flex items-center space-x-2">
        <p className="text-p text-secondary">{professor}</p>
        <div className="flex items-center space-x-1">
          <Icon name="calendar" size={16} />
          <p className="text-p text-secondary">[{date}]</p>
          <p className="text-p text-secondary">{section}</p>
        </div>
      </div>
    </div>
  );
};
