import React from 'react';
import { Icon } from '@/ui/icons';

interface CourseNavigationProps {
  title: string;
}

export const CourseNavigation: React.FC<CourseNavigationProps> = ({
  title,
}) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto flex h-12 items-center px-4">
        <p className="text-small">{title}</p>
        <Icon name="chevron-right" size={16} className="mx-1" />
        <p className="font-medium text-small">考古題</p>
      </div>
    </div>
  );
};
