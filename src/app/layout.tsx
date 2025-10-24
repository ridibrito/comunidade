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
  title: {
    default: "Aldeia Singular - Plataforma de Aprendizado",
    template: "%s | Aldeia Singular"
  },
  description: "Plataforma completa de desenvolvimento e aprendizado para famílias com crianças AHSD. Acesse trilhas educacionais, rodas de conversa, plantão de dúvidas e muito mais.",
  keywords: [
    "Aldeia Singular",
    "AHSD",
    "Altas Habilidades",
    "Superdotação",
    "Educação",
    "Aprendizado",
    "Desenvolvimento Infantil",
    "Família",
    "Comunidade",
    "Trilhas Educacionais"
  ],
  authors: [{ name: "Aldeia Singular" }],
  creator: "Aldeia Singular",
  publisher: "Aldeia Singular",
  metadataBase: new URL('https://app.aldeiasingular.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://app.aldeiasingular.com.br',
    title: 'Aldeia Singular - Plataforma de Aprendizado',
    description: 'Plataforma completa de desenvolvimento e aprendizado para famílias com crianças AHSD.',
    siteName: 'Aldeia Singular',
    images: [
      {
        url: '/logo_full.png',
        width: 1200,
        height: 630,
        alt: 'Aldeia Singular',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aldeia Singular - Plataforma de Aprendizado',
    description: 'Plataforma completa de desenvolvimento e aprendizado para famílias com crianças AHSD.',
    images: ['/logo_full.png'],
  },
  icons: {
    icon: [
      { url: '/favico.ico', sizes: 'any' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/favico.ico',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
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
