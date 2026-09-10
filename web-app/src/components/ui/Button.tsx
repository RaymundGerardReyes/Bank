import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "glass";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer inline-flex items-center justify-center gap-2 select-none";

  const variants = {
    primary:
      "bg-accent hover:bg-accent/90 text-dominant shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5",
    secondary:
      "bg-secondary/15 hover:bg-secondary/25 text-accent border border-secondary/30 hover:border-secondary/50 shadow-sm",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 hover:-translate-y-0.5",
    ghost:
      "bg-transparent hover:bg-secondary/10 text-accent/80 hover:text-accent",
    glass:
      "glass-panel text-accent hover:bg-white/90 shadow-sm border border-secondary/20 hover:border-secondary/40",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

