import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HabitForge: Realms of Progress | Gamified Habit Tracker',
  description:
    'Grow virtual botanical gardens, military strongholds, medieval kingdoms, space colonies, and arcane spires by conquering daily habits and building unbreakable streaks.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#111713',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚔️</text></svg>" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#111713] text-[#eee9d9] antialiased selection:bg-[#c8a96c] selection:text-[#111713]">
        {children}
      </body>
    </html>
  );
}
