import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaBank Secure Portal",
  description: "Next.js + TypeScript Hardened Enterprise Banking Client",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* We set a clean white background and deep navy text as the global default */}
      <body className="antialiased bg-[#FFFFFF] text-[#003366] min-h-screen">
        {children}
      </body>
    </html>
  );
}