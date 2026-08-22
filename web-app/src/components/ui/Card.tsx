import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`bg-dominant border border-secondary/30 rounded-xl p-6 shadow-xl shadow-secondary/10 ${className}`}>
      {title && <h3 className="text-xl font-extrabold text-accent mb-4">{title}</h3>}
      {children}
    </div>
  );
};
