import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visible content inside the button */
  children?: ReactNode;
  /** Button style variant */
  variant?: 'main' | 'secondary' | 'ghost' | 'icon' | 'tag' | 'link';
  disabled?: boolean;
}

/**
 * A unified Button component that supports multiple variants:
 * - main: Primary button with bright background
 * - secondary: White background with black border
 * - ghost: Minimal background with hover effect
 * - icon: Circular button for icons
 */
export const Button = ({
  children,
  variant = 'main',
  disabled = false,
  ...props
}: ButtonProps) => {
  /**
   * Base styles shared across all variants:
   * - inline-flex for alignment
   * - center content
   * - transitions for hover effects
   */
  const baseStyles = `
    inline-flex items-center justify-center
    transition duration-200
    text-p
  `;

  /**
   * Variant-specific styles mapping
   */
  const variantStyles = {
    main: `
      min-w-[64px] h-[40px]
      px-4 py-2
      rounded-md
      text-black
      bg-primary-300
      hover:bg-primary-100
      disabled:bg-secondary-100
      disabled:text-secondary-500
      disabled:cursor-not-allowed
    `,
    secondary: `
      min-w-[96px] h-[40px]
      px-4 py-2
      border border-black rounded-md
      bg-white text-black
      hover:bg-black hover:text-white
      disabled:bg-secondary-100
      disabled:text-secondary-500
      disabled:border-secondary-500
      disabled:cursor-not-allowed
    `,
    ghost: `
      min-w-[76px] h-[44px]
      px-4 py-2
      rounded-md
      text-black
      bg-transparent
      hover:bg-primary-100
    `,
    icon: `
      w-[40px] h-[40px]
      p-2
      rounded-full
      bg-primary-300
      hover:bg-primary-100
    `,
    tag: `
      min-w-[45px]
      rounded-md
      text-black
      text-small
      bg-secondary-100
      hover:bg-primary-100
    `,
    link: `
      px-2 py-1
      text-primary-600
      hover:text-primary-700
      hover:underline
    `,
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant as keyof typeof variantStyles],
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface TextwithIconProps {
  /** Called when the button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The content displayed within the button.
   * Can include both text and an icon as React children.
   */
  children: ReactNode;
}

/**
 * A reusable button-like component that shows text alongside (or with) an icon.
 * It applies Tailwind-based styling for layout, sizing, coloring, and transitions.
 */
export const TextwithIcon = ({ children, onClick }: TextwithIconProps) => {
  // Define base styles with inline-flex for horizontal alignment,
  // small text size, black color, and medium weight
  const baseStyles = `
      inline-flex items-center justify-center px-4 py-2
      text-[14px] text-black font-medium
      transition-colors duration-200 focus:outline-none
    `;

  // Variant-specific styles: transparent background and
  // a hover state that changes text color to secondary-700
  const variantStyles = `
      bg-transparent text-black hover:text-secondary-700
    `;

  return (
    <button className={clsx(baseStyles, variantStyles)} onClick={onClick}>
      {children}
    </button>
  );
};

export interface RadioButtonProps {
  /** Text label next to the radio button */
  label?: string;

  /** Whether the radio button is checked */
  checked: boolean;

  /** Called when user toggles the radio button */
  onChange?: (checked: boolean) => void;
}

export const RadioButton = ({
  label = 'Default',
  checked,
  onChange,
}: RadioButtonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label
      className={clsx('inline-flex cursor-pointer select-none items-center')}
    >
      {/* The hidden native radio input */}
      <input
        type="radio"
        checked={checked}
        onChange={handleChange}
        className={clsx(
          'sr-only', // Visually hide the real <input>
        )}
      />

      <div className="relative h-4 w-4">
        {/* Outer circle */}
        <div
          className={clsx(
            'absolute left-0 top-0 h-4 w-4 rounded-full border bg-white hover:border-secondary-900',
            checked ? 'border-black' : 'border-secondary-700',
          )}
        />
        {/* Inner circle (visible only if checked) */}
        <div
          className={clsx(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform',
            'h-3 w-3 rounded-full bg-black transition-all duration-200',
            checked ? 'scale-100' : 'scale-0',
          )}
        />
      </div>

      {/* Label text */}
      <span
        className={clsx('noto-inter ml-2 text-base font-normal text-black')}
      >
        {label}
      </span>
    </label>
  );
};
