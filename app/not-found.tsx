import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-soft-grey flex flex-col">
      <Navbar isDark={false} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-40">
        <h1 className="text-9xl font-display font-black text-caribbean opacity-20">404</h1>
        <h2 className="text-4xl font-display font-bold text-charleston -mt-12 mb-6">Page Not Found</h2>
        <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
          The insight you&apos;re looking for has moved or hasn&apos;t been published yet. 
        </p>
        <Link 
          href="/"
          className="bg-charleston text-white px-10 py-4 rounded-full font-bold hover:bg-caribbean transition-colors shadow-lg"
        >
          Return to Hub
        </Link>
      </div>
      <Footer />
    </main>
  );
}
