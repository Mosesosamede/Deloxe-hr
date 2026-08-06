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
        <meta name="monetag" content="9b5e31398afe57d18fd4a76f5f2e4b6d" />
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
