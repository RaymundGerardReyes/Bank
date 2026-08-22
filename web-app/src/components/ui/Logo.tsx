import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md";
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", showText = true }) => {
  const isSmall = size === "sm";

  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className={`${isSmall ? "w-6 h-6 rounded" : "w-8 h-8 rounded-lg"} bg-accent flex items-center justify-center shadow-md shadow-accent/20`}>
        <span className={`text-dominant font-bold ${isSmall ? "text-xs" : "text-xl"} leading-none`}>N</span>
      </div>
      {showText && (
        <span className={`${isSmall ? "text-xl" : "text-2xl"} font-extrabold tracking-tight text-accent`}>
          NovaBank
        </span>
      )}
    </Link>
  );
};
