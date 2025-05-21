import { HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div className={`rounded-lg bg-white shadow-sm ${className}`} {...props} />
  );
}

Card.displayName = 'Card';
