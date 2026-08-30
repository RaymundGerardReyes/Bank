import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label htmlFor={inputId} className="text-sm font-bold text-accent">{label}</label>}
        <input
          id={inputId}
          ref={ref}
          className={`px-3.5 py-2.5 bg-surface border ${
            error ? "border-rose-500" : "border-secondary/40"
          } rounded-lg text-accent font-medium placeholder:text-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-rose-500 font-bold">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
