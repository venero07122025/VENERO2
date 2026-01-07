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
  description: "Sistema de gestión de ventas utilizando POS",
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
              https://js.stripe.com
              https://m.stripe.network
              https://*.stripe.com
              https://geoissuer.cardinalcommerce.com
              https://*.cardinalcommerce.com
              https://*.online-metrix.net;

            frame-src
              https://js.stripe.com
              https://hooks.stripe.com
              https://geoissuer.cardinalcommerce.com
              https://*.cardinalcommerce.com
              https://*.stripe.com;

            connect-src
              'self'
              https://api.stripe.com
              https://stripe.com
              https://hooks.stripe.com
              https://m.stripe.com
              https://m.stripe.network
              https://r.stripe.com
              https://*.stripe.com
              https://*.online-metrix.net
              https://*.cardinalcommerce.com
              https://*.supabase.co;

            img-src
              'self'
              data:
              https://*.stripe.com;

            style-src
              'self'
              'unsafe-inline'
              https://js.stripe.com
              https://*.stripe.com;
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
