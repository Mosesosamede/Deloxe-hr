'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-soft-grey flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-display font-bold text-charleston mb-6">Something went wrong!</h2>
      <p className="text-gray-500 max-w-sm mb-10">
        We encountered an unexpected error. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-[#1B4332] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-white text-charleston px-10 py-4 rounded-full font-bold border border-gray-100 shadow-sm transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
