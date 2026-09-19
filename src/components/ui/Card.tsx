import React, { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-[28px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden",
          paddings[padding],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
