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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('sb_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 antialiased selection:bg-[#0E0830] selection:text-white">
        {children}
      </body>
    </html>
  );
}
