import { cn } from '@/lib/utils';
import React, { ChangeEvent, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // The current text value of the textarea
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'error';
}

export const Input = ({
  value,
  onChange,
  placeholder = 'Type your message here',
  variant = 'default',
  disabled = false,
  className,
  ...props
}: InputProps) => {
  return (
    // Renders a <textarea> element styled with Tailwind classes via cn.
    // It's intentionally constrained in width (210px) and height (40px by h-10).
    <input
      // The current text value
      value={value}
      disabled={disabled}
      // Called whenever the user types or deletes
      onChange={onChange}
      // Placeholder text if empty
      placeholder={placeholder}
      className={cn(
        // Base styles
        'h-10 w-full resize-none gap-2.5 overflow-hidden rounded-md border-t px-3 py-2 text-black',
        'disabled:cursor-not-allowed disabled:border-secondary-500 disabled:bg-secondary-300 disabled:text-secondary-700',
        'placeholder:text-[14px] placeholder:text-secondary-700',
        'focus:ring-0',

        // Variant-specific styles
        variant === 'default' && [
          'border-secondary-500',
          'hover:border-secondary-700 focus:border-secondary-900',
        ],
        variant === 'error' && [
          'border-warning',
          'hover:border-warning focus:border-warning',
        ],
        className,
      )}
      {...props}
    />
  );
};
