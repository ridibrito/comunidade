import type { Metadata } from "next";
import { Montserrat, Noto_Sans } from "next/font/google";
import "./globals.css";
import "@/styles/layout.css";
import ToastProvider from "@/components/ui/ToastProvider";
import ConfirmProvider from "@/components/ui/ConfirmProvider";
// fontes: Montserrat (títulos) e Noto Sans (texto)

const montserrat = Montserrat({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const noto = Noto_Sans({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aldeia Singular - Comunidade",
  description: "Plataforma de aprendizado e comunidade da Aldeia Singular",
  icons: {
    icon: [
      { url: '/Coruja-colorida.png', sizes: '32x32', type: 'image/png' },
      { url: '/Coruja-colorida.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/Coruja-colorida.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${montserrat.variable} ${noto.variable} antialiased`}>
        <ToastProvider>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
