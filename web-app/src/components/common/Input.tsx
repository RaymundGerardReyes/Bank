import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
        <input
          ref={ref}
          className={`px-3.5 py-2 bg-slate-800 border ${
            error ? "border-rose-500" : "border-slate-700"
          } rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
