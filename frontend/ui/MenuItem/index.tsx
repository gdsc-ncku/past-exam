import React from 'react';
import clsx from 'clsx';

interface MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const MenuItem = ({ icon, children, className }: MenuItemProps) => {
  return (
    <div
      // If you want this to be purely non-interactive, remove hover/cursor classes
      className={clsx(
        'inline-flex items-center', // icon + text side by side
        'min-h-[44px] w-[214px]', // match Figma dimensions
        'gap-2 px-4', // internal padding & space between icon/text
        'text-[16px] text-base text-secondary-700',
        'transition-colors duration-200 hover:bg-primary-50', // highlight on hover
        className,
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
