import React from 'react';
import { Icon } from '@/ui/icons';
import { Button } from '@/ui/Button';
import { cn } from '@/lib/utils';

interface ExamItemProps {
  title: string;
  year: string;
  examType: string;
  downloadCount: number;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onDownload?: () => void;
}

export const ExamItem: React.FC<ExamItemProps> = ({
  title,
  year,
  examType,
  downloadCount,
  isFavorite = false,
  onFavoriteToggle,
  onDownload,
}) => {
  return (
    <div className="mb-2 flex rounded-lg border border-secondary-300 bg-white p-4 shadow-sm">
      <div className="">
        <p className="pl-1 text-p">{title}</p>
        <div className="flex items-center">
          <Icon name="user" size={20} className="mr-3" />
          <span className="pt-1 text-small">{title}</span>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="rounded-md bg-secondary-100 px-3 py-1">
              <span className="text-small">{year}</span>
            </div>
            <div className="rounded-md bg-secondary-100 px-3 py-1">
              <span className="text-small">{examType}</span>
            </div>
            <div className="flex w-16 items-center pl-2">
              <Icon
                name="download"
                size={20}
                className="mr-1 text-secondary-500"
              />
              <span className="w-10 text-small text-secondary">
                {downloadCount}
              </span>
            </div>
            <button
              onClick={onFavoriteToggle}
              className="flex items-center justify-center"
              aria-label={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Icon
                name="star"
                size={20}
                className={cn(
                  'transition-colors',
                  isFavorite ? 'text-primary-400' : 'text-secondary-500',
                )}
              />
            </button>
          </div>

          <Button
            variant="icon"
            onClick={onDownload}
            className="ml-20 bg-primary-300 hover:bg-primary-200"
            aria-label="Download exam"
          >
            <Icon name="download" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
