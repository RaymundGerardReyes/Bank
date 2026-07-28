import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 shadow-xl backdrop-blur-sm ${className}`}>
      {title && <h3 className="text-xl font-semibold text-slate-100 mb-4">{title}</h3>}
      {children}
    </div>
  );
};
