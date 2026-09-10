import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  subtitle,
  interactive = false,
}) => {
  return (
    <div
      className={`bg-dominant/90 backdrop-blur-md border border-secondary/20 rounded-2xl p-6 shadow-md transition-all duration-300 ${
        interactive
          ? "hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 hover:border-secondary/50 cursor-pointer active:scale-[0.99]"
          : ""
      } ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-extrabold text-accent tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs font-semibold text-accent/50 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

