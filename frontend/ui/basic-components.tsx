import React, { ReactNode } from 'react';
import clsx from "clsx";

interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** The visible content inside the button */
    children?: ReactNode;
  }
  
  /**
   * A primary "main" button with a bright background (C3FF46),
   * black text, and hover transitions. It has a minimum width of 64px,
   * fixed height of 40px, rounded corners, and 16px text size.
   */
  export const MainButton: React.FC<MainButtonProps> = ({ children, ...props }) => {
    /**
     * Base styles:
     * - inline-flex to align items horizontally
     * - center the content with items-center and justify-center
     * - minimum width 64px, height 40px for a consistent size
     * - padding for comfortable click area
     * - bright background (C3FF46) with black text
     * - 16px text, rounded corners, transition for hover/focus
     */
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[64px] h-[40px]
      px-4 py-2
      rounded-md
      bg-[#C3FF46]
      text-black
      text-[16px]
      transition
      duration-200
    `;
  
    /**
     * Variant styles:
     * - primary background color with a lighter hover
     */
    const variantStyles = `
      bg-primary-300
      hover:bg-primary-100
    `;
  
    return (
      <button
        className={clsx(baseStyles, variantStyles)}
        {...props}
      >
        {children}
      </button>
    );
  };

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** The visible content inside the button */
    children?: ReactNode;
  }
  
  /**
   * A "secondary" style button with a white background, black text,
   * and a hover transition that inverts the colors.  
   * Fixed size: min-width of 96px, height of 40px, 16px text, and slight rounding.
   */
  export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    children,
    ...props
  }) => {
    /**
     * Base styles:
     * - inline-flex to align items horizontally
     * - center content via items-center and justify-center
     * - min-width of 96px, fixed height of 40px
     * - padding and border for a basic button shape
     * - white background, black text
     * - text size of 16px
     * - short transition for hover/focus
     */
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[96px] h-[40px]
      px-4 py-2
      border border-black rounded-md
      bg-white text-black
      text-[16px]
      transition duration-200
    `;
  
    /**
     * Variant styles:
     * - white background and black text by default
     * - on hover, invert colors to black background and white text
     */
    const variantStyles = `
      bg-white text-black
      hover:bg-black hover:text-white
    `;
  
    return (
      <button
        className={clsx(baseStyles, variantStyles)}
        {...props}
      >
        {children}
      </button>
    );
  };

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** The button's content, typically text or an icon */
    children?: ReactNode;
  }
  
  /**
   * A "ghost" style button with minimal background.
   * It has a minimum width of 76px and a fixed height of 44px,
   * with hover transitioning to a light primary background.
   */
  export const GhostButton: React.FC<GhostButtonProps> = ({ children, ...props }) => {
    /**
     * Base styles:
     * - inline-flex to align items horizontally
     * - center content with items-center/justify-center
     * - fixed height of 44px and minimum width of 76px
     * - padding for comfortable click area
     * - slightly rounded corners
     * - smooth transition on hover/focus
     * - black text at 16px size
     */
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[76px] h-[44px]
      px-4 py-2
      rounded-md
      text-black
      text-[16px]
      transition
      duration-200
    `;
  
    /**
     * Variant styles:
     * - transparent background and black text by default
     * - on hover, light primary background color
     */
    const variantStyles = `
      bg-transparent
      text-black
      hover:bg-primary-100
    `;
  
    return (
      <button
        className={clsx(baseStyles, variantStyles)}
        {...props}
      >
        {children}
      </button>
    );
  };

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** The content of the button, typically an icon */
    children?: ReactNode;
  }
  
  /**
   * A circular button primarily for icons. It has a minimum size
   * of 40x40px, rounded corners, and uses Tailwind classes for
   * background/hover transitions.
   */
  export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
    /**
     * Base styles:
     * - inline-flex for horizontal alignment of children
     * - center content (icon) using items-center & justify-center
     * - minimum 40px width & height
     * - small padding around the icon
     * - fully rounded corners (rounded-full)
     * - transition for smooth hover/focus animations
     */
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[40px] min-h-[40px]
      px-3 py-3
      rounded-full
      transition
      duration-200
    `;
  
    /**
     * Variant styles:
     * - Primary background color with a hover effect
     */
    const variantStyles = `
      bg-primary-300
      hover:bg-primary-100
    `;
  
    return (
      <button
        className={clsx(baseStyles, variantStyles)}
        {...props}
      >
        {children}
      </button>
    );
  };;

interface TagButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** The content inside the tag, usually text (and possibly an icon). */
    children: ReactNode;
  }
  
  /**
   * A small pill-like button (tag) that displays minimal text and provides
   * styling via Tailwind classes. It supports hover effects, rounding, and
   * transitions. Additional props like `onClick` or `disabled` can be passed in.
   */
  export const TagButton: React.FC<TagButtonProps> = ({ children, ...props }) => {
    /**
     * Base styles:
     * - Use inline-flex to align content horizontally.
     * - Minimum size: 45px wide and 28px tall.
     * - Small padding around the text.
     * - Slightly rounded corners and a base text style.
     */
    const baseStyles = `
      inline-flex items-center justify-center
      min-w-[45px] min-h-[28px]
      px-3 py-1 rounded-md
      transition duration-200
      text-[14px] text-black
    `;
  
    /**
     * Variant styles:
     * - Default background in "secondary-100" with black text.
     * - On hover, background changes to "secondary-300".
     */
    const variantStyles = `
      bg-secondary-100
      text-black
      hover:bg-secondary-300
    `;
  
    return (
      <button
        className={clsx(baseStyles, variantStyles)}
        {...props}
      >
        {children}
      </button>
    );
  };

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
}

export const LinkButton = ({ children, href, ...props }) => {
    // Base styles that apply to all link variants.
    const baseStyles = 
        `font-inter text-[14px] font-medium 
        leading-[24px] text-left no-underline 
        transition duration-200 text-primary-600 `;

  // On hover, add an underline with the specific style properties:
  // - underline style: solid
  // - underline position: from-font
  // - no ink skipping.
  const variantStyles = `
    hover:underline hover:[text-decoration-style:solid] 
    hover:[text-underline-position:from-font] 
    hover:[text-decoration-skip-ink:none]`;
  
    // If an href is provided, render an <a> element.
    if (href) {
      return (
        <a
          href={href}
          className={clsx(baseStyles, variantStyles)}
          {...props}
        >
          {children}
        </a>
      );
    }
  
    // Otherwise, render a <button> element.
    return (
      <button className={clsx(baseStyles, variantStyles)} {...props}>
        {children}
      </button>
    );
  };

  interface TextwithIconProps {
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
  export const TextwithIcon: React.FC<TextwithIconProps> = ({ children }) => {
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
      <button className={clsx(baseStyles, variantStyles)}>
        {children}
      </button>
    );
  };

interface MenuItemProps {
    /** Optional icon (e.g., an SVG) shown on the left */
    icon?: React.ReactNode;
    /** The text or label displayed to the right of the icon */
    children: React.ReactNode;
  }
  
  export const MenuItem: React.FC<MenuItemProps> = ({ icon, children }) => {
    return (
      <div
        // If you want this to be purely non-interactive, remove hover/cursor classes
        className={clsx(
          'inline-flex items-center',    // icon + text side by side
          'w-[214px] min-h-[44px]',          // match Figma dimensions
          'px-4 gap-2',                  // internal padding & space between icon/text
          'text-secondary-700 text-base text-[16px]',
          'hover:bg-primary-50 transition-colors duration-200', // highlight on hover
        )}
        // If you’re using this in a <nav> or <ul>, consider a11y attributes:
        // role="menuitem"
      >
        {/* Icon on the left if provided */}
        {icon && <span>{icon}</span>}
        {/* Text label on the right */}
        <span>{children}</span>
      </div>
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
  
  export const RadioButton: React.FC<RadioButtonProps> = ({
    label = 'Default',
    checked,
    onChange,
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };
  
    return (
      <label
        className={clsx(
          'inline-flex items-center cursor-pointer select-none',
        )}
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
  
        <div className="relative w-4 h-4">
          {/* Outer circle */}
          <div
            className={clsx(
              'absolute top-0 left-0 w-4 h-4 rounded-full border bg-white hover:border-secondary-900',
              checked ? 'border-black' : 'border-secondary-700',
            )}
          />
          {/* Inner circle (visible only if checked) */}
          <div
            className={clsx(
              'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
              'w-3 h-3 rounded-full transition-all duration-200 bg-black',
              checked ? 'scale-100' : 'scale-0'
            )}
          />
        </div>
  
        {/* Label text */}
        <span
          className={clsx(
            'ml-2 text-base font-normal noto-inter text-black',
          )}
        >
          {label}
        </span>
      </label>
    );
  };

  export interface CheckBoxProps {
    /** Text label next to the checkbox */
    label?: string;
  
    /** Whether the checkbox is checked */
    checked: boolean;
  
    /** Called when user toggles the checkbox */
    onChange?: (checked: boolean) => void;
  }
  
  export const CheckBox: React.FC<CheckBoxProps> = ({
    label = 'Default',
    checked,
    onChange,
    ...props
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };
  
    return (
      <label
        className={clsx(
          'inline-flex items-center cursor-pointer select-none',
        )}
      >
        {/* The hidden native checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className={clsx(
            'sr-only', // Hide the real <input> visually (screen-reader only)
          )}
        />
  
        {/* The custom box that visually represents the checkbox */}
        <div
          className={clsx(
            'w-4 h-4 rounded-sm transition-colors border transition-colors',
          'duration-200 ease-in-out hover:border-secondary-900',
          // If checked, fill in black and remove border
          checked ? 'bg-black border-transparent' : 'border-secondary-700 bg-white'
          )}
        />
  
        {/* Label text */}
        <span
          className={clsx(
            'ml-2',
            'text-base font-normal noto-inter text-black',
          )}
        >
          {label}
        </span>
      </label>
    );
  };


  interface TextAreaProps {
    // The current text value of the textarea
    value: string;
    // A function called each time the user changes the content
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    // Optional placeholder text displayed when empty
    placeholder?: string;
  }
  
  export const TextArea: React.FC<TextAreaProps> = ({
    value,
    onChange,
    placeholder = 'Type your message here',
  }) => {
    return (
      // Renders a <textarea> element styled with Tailwind classes via clsx.
      // It's intentionally constrained in width (210px) and height (40px by h-10).
      <textarea
        // The current text value
        value={value}
        // Called whenever the user types or deletes
        onChange={onChange}
        // Placeholder text if empty
        placeholder={placeholder}
        className={clsx(
          // Fixed width and height, with some padding and rounded corners
          'w-[210px] h-10 px-3 py-2 rounded-md border-t resize-none gap-2.5 overflow-hidden text-black border-secondary-500',
  
          // Smaller placeholder text in a muted color
          'placeholder:text-[14px] placeholder:text-secondary-700',
  
          // Border darkens on hover or focus, no focus ring
          'hover:border-secondary-900 focus:border-secondary-900 focus:ring-0'
        )}
      />
    );
  };