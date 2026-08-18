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
        <link rel="icon" href="https://i.ibb.co/pjxqNW0p/favicon.png" type="image/png" sizes="any" />
        <meta name="msvalidate.01" content="3CD52608B2A22C800848484576FCF4F8" />
      </head>
      <body suppressHydrationWarning className="bg-soft-grey text-charleston antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
