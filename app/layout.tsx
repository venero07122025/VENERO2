import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeneroPeru",
  description: "Sistema de gestión de ventas utilizando POS WEB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="
default-src 'self';

script-src
  'self'
  'unsafe-inline'
  'unsafe-eval'
  https://static.micuentaweb.pe
  https://secure.micuentaweb.pe
  https://*.online-metrix.net;

script-src-elem
  'self'
  'unsafe-inline'
  https://static.micuentaweb.pe
  https://secure.micuentaweb.pe
  https://*.online-metrix.net;

frame-src
  https://secure.micuentaweb.pe
  https://static.micuentaweb.pe
  https://*.online-metrix.net;

connect-src
  'self'
  https://api.micuentaweb.pe
  https://secure.micuentaweb.pe
  https://static.micuentaweb.pe
  https://*.online-metrix.net
  https://*.supabase.co;

img-src
  'self'
  data:
  https://static.micuentaweb.pe
  https://secure.micuentaweb.pe
  https://*.online-metrix.net;

style-src
  'self'
  'unsafe-inline'
  https://static.micuentaweb.pe
  https://fonts.googleapis.com;

font-src
  'self'
  https://fonts.gstatic.com;
"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}