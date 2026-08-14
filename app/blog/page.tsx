import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import BlogIndexView from './BlogIndexView';

export const revalidate = 60; // Revalidate every minute for SEO freshness

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://deloxehr.com';

export const metadata: Metadata = {
  title: 'HR Insights, Leadership & Work Culture Blog | Deloxe HR',
  description: 'Explore deep-dive articles, HR technology trends, leadership strategies, talent acquisition tips, and workplace culture insights from Deloxe HR.',
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  openGraph: {
    title: 'HR Insights, Leadership & Work Culture Blog | Deloxe HR',
    description: 'Explore deep-dive articles, HR technology trends, leadership strategies, talent acquisition tips, and workplace culture insights from Deloxe HR.',
    url: `${baseUrl}/blog`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HR Insights & Work Culture Blog | Deloxe HR',
    description: 'Explore deep-dive articles, HR technology trends, leadership strategies, talent acquisition tips, and workplace culture insights from Deloxe HR.',
  },
  other: {
    monetag: '9b5e31398afe57d18fd4a76f5f2e4b6d',
  },
};

async function getPublishedPosts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .eq('site_id', 'deloxehr')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts for SSR:', error.message || error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to query Supabase server client:', err);
    return [];
  }
}

export default async function BlogListPage() {
  const posts = await getPublishedPosts();
  return <BlogIndexView initialPosts={posts} />;
}
