import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', size = 'md', fullWidth = false, ...props }, ref) => {
    
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
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
