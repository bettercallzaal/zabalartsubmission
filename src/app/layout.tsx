import type { Metadata } from 'next';
import { MiniAppReady } from '@/components/MiniAppReady';

export const metadata: Metadata = {
  title: 'ZABAL',
  description: 'Vote on ZAO Direction',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <MiniAppReady />
        {children}
      </body>
    </html>
  );
}
