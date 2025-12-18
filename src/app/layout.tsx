import { Sarabun, Noto_Sans_Thai, Inter } from 'next/font/google';

import '@/styles/globals.css';
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const sarabunFont = Sarabun({
  variable: '--font-sarabun',
  subsets: ['thai', 'latin'],
  weight: ['200', '400', '600', '800'],
});
const notoSansThaiFont = Noto_Sans_Thai({
  variable: '--font-noto-sans-thai',
  subsets: ['thai', 'latin'],
  weight: ['200', '400', '600', '800'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("overscroll-none", inter.variable)}>
      <body className={`${sarabunFont.variable} ${notoSansThaiFont.variable} overscroll-none`}>
        {children}
      </body>
    </html>
  );
}
