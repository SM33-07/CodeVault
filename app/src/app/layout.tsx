import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeVault",
  description: "A clean foundation for your snippet manager.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
