import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '../hoc/ErrorBoundary';
import AppProviders from '../hoc/AppProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OllamaFlow - Configuration Manager',
  description: 'Create and manage your Ollama configuration files with ease',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzU1OEY0MiIvPgo8cGF0aCBkPSJNOCAxNkwyNCAxNkwyNCAyNEg4VjE2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTggOEgyNFYxNkg4VjhKIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
        <ErrorBoundary allowRefresh={true}>
          <AppProviders>{children}</AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
