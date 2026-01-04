import { Inter } from "next/font/google";
import "./globals.css";

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
    // Definimos el idioma base como 'es' por defecto para la raíz técnica,
    // pero el contenido real será manejado por [locale]
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {/* 
          IMPORTANTE:
          Aquí NO cargamos Header, Footer ni Toaster.
          Este layout solo sirve de contenedor base.
          Toda la interfaz de usuario se carga en src/app/[locale]/layout.tsx
        */}
        {children}
      </body>
    </html>
  );
}