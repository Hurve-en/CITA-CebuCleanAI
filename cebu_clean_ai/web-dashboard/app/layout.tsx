import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'SmartBin Cebu Dashboard',
  description: 'Smart waste, routing, and resilience for Cebu City',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="text-gray-100 bg-night">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
