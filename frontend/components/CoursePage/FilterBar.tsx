import React from 'react';
import { Button } from '@/ui/Button';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  yearOptions: FilterOption[];
  examTypeOptions: FilterOption[];
  sortOptions: FilterOption[];
  selectedYear: string;
  selectedExamType: string;
  selectedSort: string;
  onYearChange: (year: string) => void;
  onExamTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  yearOptions,
  examTypeOptions,
  sortOptions,
  selectedYear,
  selectedExamType,
  selectedSort,
  onYearChange,
  onExamTypeChange,
  onSortChange,
}) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          className="bg-secondary-100 hover:bg-secondary-300"
          onClick={() => onYearChange('所有年份')}
        >
          所有年份
        </Button>

        <Button
          className="bg-secondary-100 hover:bg-secondary-300"
          onClick={() => onExamTypeChange('所有考試')}
        >
          所有考試
        </Button>

        <Button
          className="bg-secondary-100 hover:bg-secondary-300"
          onClick={() => onSortChange('評分:由高到低')}
        >
          評分:由高到低
        </Button>

        <Button
          className="bg-secondary-100 hover:bg-secondary-300"
          onClick={() => onSortChange('下載量:由高到低')}
        >
          下載量:由高到低
        </Button>
      </div>
    </div>
  );
};
