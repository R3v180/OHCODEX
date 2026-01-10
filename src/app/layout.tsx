import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

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
  // Obtenemos el ID desde las variables de entorno
  // Si no existe (ej: en desarrollo local sin .env), usamos string vacío para no romper
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';

  return (
    // Definimos el idioma base como 'es' por defecto para la raíz técnica
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

      {/* Google Analytics 4: Solo se carga si existe el ID */}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}