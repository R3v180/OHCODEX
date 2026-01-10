import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google' // 1. IMPORTAR ESTO

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "OHCodex",
  description: "Software Architecture & Development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
      {/* 2. AÑADIR EL COMPONENTE AQUÍ AL FINAL CON TU ID */}
      <GoogleAnalytics gaId="G-DBB581X6G4" />
    </html>
  );
}