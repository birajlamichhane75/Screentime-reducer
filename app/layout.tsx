import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['500', '600', '700'],
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
    <html lang="en" className={`${jakarta.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
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
      <body className="min-h-screen bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 antialiased selection:bg-[#0E0830] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
