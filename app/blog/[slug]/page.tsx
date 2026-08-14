import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ArticleView from "./ArticleView"
import { createClient } from "@/utils/supabase/server"

interface PageProps {
  params: Promise<{ slug: string }>
}

// 1. Fetching Data
async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .eq('site_id', 'deloxehr')
    .single()
  
  if (error || !data) return null
  return data
}

async function getRelatedPosts(slug: string, category: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, content, excerpt, image_url, created_at, category, author_name, read_time')
    .eq('is_published', true)
    .eq('category', category)
    .eq('site_id', 'deloxehr')
    .neq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(2)
  
  if (error) return []
  return data
}

// Helper to parse tags from database
function parseTags(tags: any): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) {
    return tags.map(t => String(t).trim()).filter(Boolean)
  }
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) {
        return parsed.map(t => String(t).trim()).filter(Boolean)
      }
    } catch {
      return tags.split(',').map(t => t.trim()).filter(Boolean)
    }
  }
  return []
}

// 2. SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://deloxehr.com'
  const postUrl = `${baseUrl}/blog/${slug}`
  const tagsArray = parseTags(post.tags)

  return {
    title: `${post.meta_title || post.title} | Deloxe HR Consulting`,
    description: post.meta_description || post.excerpt,
    keywords: tagsArray.length > 0 ? tagsArray : undefined,
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      images: post.image_url ? [{ url: post.image_url, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : [],
    },
    other: {
      'monetag': '9b5e31398afe57d18fd4a76f5f2e4b6d',
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(slug, post.category)

  return <ArticleView post={post} relatedPosts={relatedPosts} />
}

