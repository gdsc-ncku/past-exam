'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { ACADEMIES } from '@/module/data/departments';

interface DepartmentSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const DepartmentSelector = ({
  value,
  onChange,
  disabled,
  className = '',
}: DepartmentSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedAcademies, setExpandedAcademies] = useState<Set<string>>(
    new Set(),
  );

  const toggleAcademy = (code: string) => {
    setExpandedAcademies((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const selectedDept =
    value === 'all'
      ? '全部'
      : ACADEMIES.flatMap((a) => a.departments).find((d) => d.code === value)
          ?.name || '選擇系所';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
          ${className}`}
      >
        <span className="truncate">{selectedDept}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-1">
            <button
              onClick={() => {
                onChange('all');
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm
                ${value === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              <span className="flex-1 text-left">全部</span>
              {value === 'all' && <Check className="h-4 w-4" />}
            </button>

            {ACADEMIES.map((academy) => (
              <div key={academy.code} className="mt-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAcademy(academy.code);
                  }}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {expandedAcademies.has(academy.code) ? (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-1 h-4 w-4" />
                  )}
                  {academy.name}
                </button>

                {expandedAcademies.has(academy.code) && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {academy.departments.map((dept) => (
                      <button
                        key={dept.code}
                        onClick={() => {
                          onChange(dept.code);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm
                          ${value === dept.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                      >
                        <span className="flex-1 text-left">
                          {dept.name} ({dept.code})
                        </span>
                        {value === dept.code && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
