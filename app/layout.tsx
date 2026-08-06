import type {Metadata} from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Deloxe HR | Innovative Human Resource Consulting',
  description: 'Deloxe HR provides premium HR consulting services for organizations and individuals. Where Ambition Meets Opportunity.',
  icons: {
    icon: 'https://i.ibb.co/pjxqNW0p/favicon.png',
  },
};

import { Providers } from '@/components/Providers';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="monetag" content="312aa61a7414c4802d07003b54896048" />
        <link rel="icon" href="https://i.ibb.co/pjxqNW0p/favicon.png" type="image/png" sizes="any" />
      </head>
      <body suppressHydrationWarning className="bg-soft-grey text-charleston antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
