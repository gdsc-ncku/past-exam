import { Course } from '@/module/api/course';
import { getDepartmentInfo } from '@/module/data/departments';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const deptInfo = getDepartmentInfo(course.departmentId);
  const deptFirstChar = deptInfo.name.charAt(0); // Get first Chinese character of department name

  return (
    <div className="relative rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div className="p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          {/* Left circle icon with department's first character */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700">
            <span className="text-lg font-medium text-white">
              {deptFirstChar}
            </span>
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="truncate text-lg font-medium text-gray-900">
                {course.courseName}
              </h3>
              <span className="ml-2 text-sm text-gray-500">
                {course.departmentId}-{course.serialNumber}
              </span>
            </div>

            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span className="mr-1 font-medium">系所：</span>
                <span>{deptInfo.name}</span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span className="mr-1 font-medium">授課教師：</span>
                <span>{course.instructors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
