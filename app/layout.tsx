import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PinIt Mumbai — Report Civic Issues',
  description:
    'Crowdsourced civic issue map for Mumbai & Thane. Report roads, garbage, streetlights, water, safety, and theft — no login needed.',
  openGraph: {
    title: 'PinIt Mumbai',
    description: 'Drop a pin. Fix the city.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
