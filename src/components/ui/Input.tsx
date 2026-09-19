import React, { type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, onRightIconClick, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-petoo-primary flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              "flex w-full h-[52px] bg-white border border-gray-200 text-petoo-textDark rounded-[16px] px-4 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-petoo-primary/30 focus:border-petoo-primary placeholder:text-gray-400 disabled:bg-gray-50",
              leftIcon && "pl-[44px]",
              rightIcon && "pr-[44px]",
              error && "border-red-500 focus:ring-red-500/30 focus:border-red-500",
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div 
              className={cn(
                "absolute right-4 text-petoo-primary flex items-center justify-center",
                onRightIconClick ? "cursor-pointer hover:text-petoo-primary/80 transition-colors" : "pointer-events-none"
              )}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-sm text-red-500 font-medium px-2">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
