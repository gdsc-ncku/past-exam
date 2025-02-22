'use client';

import clsx from 'clsx';

export interface CheckBoxProps {
  label?: string;
  checked: boolean;
  onClick?: (checked: boolean) => void;
  className?: string;
}

export const CheckBox = ({
  label = 'Default',
  checked = false,
  onClick = () => {},
  className,
}: CheckBoxProps) => {
  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    onClick?.(e.target.checked);
  };

  return (
    <label
      className={clsx(
        'inline-flex cursor-pointer select-none items-center',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleClick}
        className={clsx('sr-only')}
      />

      <div
        className={clsx(
          'h-4 w-4 rounded-sm border transition-colors transition-colors',
          'duration-200 ease-in-out hover:border-secondary-900',
          checked
            ? 'border-transparent bg-black'
            : 'border-secondary-700 bg-white',
        )}
      />
      <span
        className={clsx('ml-2', 'noto-inter text-base font-normal text-black')}
      >
        {label}
      </span>
    </label>
  );
};
