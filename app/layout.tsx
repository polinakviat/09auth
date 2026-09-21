import Providers from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css'; // Переконайтеся, що імпорт глобальних стилів збережено

// Налаштування шрифту Roboto
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub — Note Taking App',
  description: 'Manage your personal notes efficiently with NoteHub.',
  openGraph: {
    title: 'NoteHub — Note Taking App',
    description: 'Manage your personal notes efficiently with NoteHub.',
    url: 'https://notehub.com/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub App',
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <Providers>
          {children}
          {modal}
        </Providers>
      </body>
    </html>
  );
}