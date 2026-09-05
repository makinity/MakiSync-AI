import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LoadingOverlayProvider from '@/components/LoadingOverlayProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mark Vencent Juntilla | AI Video Creator & Creative Technologist (MakiSync)',
  description: 'Director-led AI Video Advertising, commercial conceptualization, shot architecture, and creative technology.',
  keywords: ['AI Video Creator', 'AI Commercial Director', 'AI Advertising', 'Google Flow Video', 'Creative Technologist', 'MakiSync'],
  authors: [{ name: 'Mark Vencent L. Juntilla' }],
  openGraph: {
    title: 'Mark Vencent Juntilla | AI Video Creator Portfolio',
    description: 'Director-led AI Video Advertising & Creative Direction.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Reads localStorage before first paint — eliminates theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <LoadingOverlayProvider>
          {children}
        </LoadingOverlayProvider>
      </body>
    </html>
  );
}
