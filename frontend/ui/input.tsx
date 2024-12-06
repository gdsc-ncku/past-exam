// frontend/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// 使用 React.forwardRef 來轉發 ref
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`mt-1 block w-full rounded border border-gray-300 p-2 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
