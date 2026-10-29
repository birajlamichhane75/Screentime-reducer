import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'SkillBridge — Turn Your Passion Into Opportunity',
  description:
    'Help Gen Z replace passive social-media consumption with focused hobby practice, creative skill development, portfolio building, and real-world opportunities.',
  keywords: [
    'SkillBridge',
    'screen time reducer',
    'hobby tracking',
    'portfolio builder',
    'Gen Z opportunities',
    'scholarships',
    'internships',
    'mentorships',
  ],
  authors: [{ name: 'SkillBridge Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
