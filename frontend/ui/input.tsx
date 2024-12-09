// frontend/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={`mt-1 block w-full rounded border p-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } ${className}`}
          {...props}
        />
        {error && helperText && (
          <p className="mt-1 text-sm text-red-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
