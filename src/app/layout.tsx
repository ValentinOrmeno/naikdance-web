import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 

// Configuración de la fuente Inter (Google Fonts)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naik Dance Studio",
  description: "Academia de danza urbana profesional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}