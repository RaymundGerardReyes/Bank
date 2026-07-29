import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
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
      <body className="antialiased bg-dominant text-accent min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}