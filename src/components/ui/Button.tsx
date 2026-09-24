import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', size = 'md', fullWidth = false, loading, disabled, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-petoo-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      solid: "bg-petoo-primary text-petoo-textDark shadow-md hover:bg-petoo-primaryDark hover:shadow-lg border-2 border-transparent",
      outline: "bg-transparent text-petoo-textDark border-2 border-petoo-textDark hover:bg-black/5",
      ghost: "bg-transparent text-petoo-textDark hover:bg-black/5 border-2 border-transparent",
    };
    
    const sizes = {
      sm: "h-10 px-4 text-sm rounded-[12px]",
      md: "h-[52px] px-6 text-base rounded-[16px]",
      lg: "h-14 px-8 text-lg rounded-[24px]",
    };

    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
