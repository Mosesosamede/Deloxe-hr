import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, MessageCircle, ArrowRight, CheckCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Badge, Card, CardContent, TopBar } from "@/components/UI-Components"
import AdBanner from "@/components/AdBanner"
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

// 2. SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const postUrl = `${baseUrl}/blog/${slug}`

  return {
    title: `${post.meta_title || post.title} | Deloxe HR Consulting`,
    description: post.meta_description || post.excerpt,
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

  // Ad Injection Logic
  const paragraphs = post.content.split(/\n\n+/)
  const midIndex = Math.floor(paragraphs.length / 2)
  
  const contentWithAds = paragraphs.reduce((acc: any[], p: string, i: number) => {
    acc.push(p)
    if (i === midIndex) {
      acc.push("AD_PLACEHOLDER")
    }
    return acc
  }, [])
  contentWithAds.push("AD_PLACEHOLDER") // Add at the end

  return (
    <main className="min-h-screen bg-white">
      <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='10894500',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />
      <TopBar />
      <Navbar isDark={true} />

      {/* Hero Section - Luxury Green */}
      <section className="relative pt-40 pb-20 bg-[#1B4332] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-caribbean/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-all uppercase tracking-widest text-[10px] font-bold">
              <ArrowLeft className="h-3 w-3" /> Back to Articles
            </Link>
            <div className="flex justify-center mb-8">
              <Badge className="bg-[#D4AF37] text-white border-0 shadow-lg px-6 py-2">{post.category}</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-10 leading-tight">
              {post.title}
            </h1>
            <div className="flex justify-center flex-wrap items-center gap-x-6 gap-y-3 text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">
                <span className="flex items-center gap-2 underline underline-offset-4 decoration-[#D4AF37]"><User size={12} className="text-[#D4AF37]"/> {post.author_name}</span>
                <span className="flex items-center gap-2"><Calendar size={12}/> {new Date(post.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><Clock size={12}/> {post.read_time || '5 MIN READ'}</span>
            </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-20">
        <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group bg-white">
          {post.image_url ? (
            <Image 
              src={post.image_url} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
              priority 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              Featured Image Not Found
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16">
          
          {/* Social Sidebar */}
          <aside className="lg:w-20 flex lg:flex-col items-center gap-6">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest lg:[writing-mode:vertical-lr] lg:rotate-180">Share Content</span>
            <div className="w-px h-12 bg-gray-100 hidden lg:block" />
            <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] transition-all"><Facebook size={18}/></button>
            <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] transition-all"><Twitter size={18}/></button>
            <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] transition-all"><Linkedin size={18}/></button>
            <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] transition-all"><MessageCircle size={18}/></button>
          </aside>

          <div className="flex-1 max-w-3xl">
            <article className="max-w-none">
              <p className="text-xl md:text-2xl text-gray-500 italic font-display leading-relaxed mb-16 border-b border-gray-100 pb-16">
                {post.excerpt}
              </p>
              
              <div className="prose prose-lg xl:prose-xl prose-slate max-w-none 
                prose-headings:font-display prose-headings:text-charleston prose-headings:font-bold
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-8
                prose-strong:text-charleston prose-strong:font-bold
                prose-img:rounded-[32px] prose-img:shadow-2xl prose-img:my-16
                prose-hr:border-gray-100 prose-hr:my-20
                prose-a:text-[#1B4332] prose-a:font-bold hover:prose-a:text-[#D4AF37] transition-all">
                
                {contentWithAds.map((content: string, idx: number) => {
                  if (content === "AD_PLACEHOLDER") {
                    return <AdBanner key={`ad-${idx}`} />
                  }
                  return (
                    <ReactMarkdown 
                      key={idx} 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({node, ...props}) => {
                          const text = String(props.children);
                          const match = text.match(/(.*?)(#\d+)(.*)/);
                          if (match) {
                            return (
                              <h2 className="text-3xl md:text-4xl mt-20 mb-10 flex items-baseline gap-2">
                                <span className="font-display font-bold text-charleston">{match[1]}</span>
                                <span className="text-gray-300 font-light">{match[2]}</span>
                                <span className="font-display font-bold text-charleston">{match[3]}</span>
                              </h2>
                            )
                          }
                          return <h2 className="text-3xl md:text-4xl mt-20 mb-10 font-display font-bold text-charleston" {...props} />
                        },
                        h3: ({node, ...props}) => {
                          const text = String(props.children);
                          if (text.toLowerCase().includes('key takeaways')) {
                            return (
                              <div className="bg-soft-grey/30 border border-gray-100 p-8 md:p-12 rounded-[40px] my-16 group transition-all hover:shadow-xl">
                                <div className="flex items-center gap-4 mb-8">
                                  <div className="w-10 h-10 bg-[#1B4332] rounded-full flex items-center justify-center text-white ring-8 ring-[#1B4332]/5">
                                    <CheckCircle size={20} />
                                  </div>
                                  <h3 className="text-2xl font-display font-bold text-charleston !m-0">Key Takeaways</h3>
                                </div>
                                <div className="prose-ul:m-0 takeaways-list">
                                  {props.children}
                                </div>
                              </div>
                            )
                          }
                          return <h3 className="text-2xl md:text-3xl mt-16 mb-8 font-display font-bold text-charleston" {...props} />
                        },
                        blockquote: ({node, ...props}) => (
                          <blockquote className="relative border-l-4 border-[#D4AF37] bg-soft-grey/20 px-8 md:px-12 py-8 rounded-r-[32px] my-16 group">
                            <div className="text-xl md:text-2xl text-charleston italic font-display leading-[1.6] opacity-90 group-hover:opacity-100 transition-opacity">
                              {props.children}
                            </div>
                          </blockquote>
                        ),
                        ul: ({node, ...props}) => (
                          <ul className="space-y-4 my-8 list-none !pl-0" {...props} />
                        ),
                        li: ({node, ...props}) => (
                          <li className="flex gap-4 items-start text-gray-600">
                            <div className="w-1.5 h-1.5 bg-caribbean rounded-full mt-2.5 shrink-0" />
                            <span>{props.children}</span>
                          </li>
                        ),
                        table: ({node, ...props}) => (
                          <div className="overflow-x-auto my-16 rounded-[32px] border border-gray-100 shadow-sm">
                            <table className="w-full text-left border-collapse" {...props} />
                          </div>
                        ),
                        thead: ({node, ...props}) => <thead className="bg-soft-grey/50" {...props} />,
                        th: ({node, ...props}) => <th className="p-6 text-xs font-black uppercase tracking-widest text-charleston/60 border-b border-gray-100" {...props} />,
                        td: ({node, ...props}) => <td className="p-6 text-sm text-gray-600 border-b border-gray-100 last:border-0" {...props} />,
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  )
                })}

              </div>
            </article>

            {/* Author Card */}
            <div className="mt-24 p-12 rounded-[40px] border border-gray-100 bg-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-[#1B4332]" />
               <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                 <div className="w-24 h-24 bg-[#1B4332] rounded-3xl flex items-center justify-center text-white text-4xl font-display font-bold shadow-2xl">
                    {post.author_name?.charAt(0) || 'D'}
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2 block">The Author</span>
                    <h3 className="text-2xl font-display font-bold text-charleston mb-4">{post.author_name || "Deloxe Team"}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed italic">
                      Specialist in human capital management and technological integration. Dedicated to redefining the modern workplace through empathy and data.
                    </p>
                 </div>
               </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-32">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-display font-bold text-charleston">Related Insights</h3>
                  <Link href="/blog" className="text-sm font-bold text-[#1B4332] hover:text-[#D4AF37] flex items-center gap-2">View all <ArrowRight size={16}/></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {relatedPosts.map((rPost) => (
                    <Link key={rPost.slug} href={`/blog/${rPost.slug}`} className="group">
                      <Card className="h-full hover:-translate-y-2">
                        <div className="relative aspect-video overflow-hidden bg-soft-grey">
                          {rPost.image_url ? (
                            <Image src={rPost.image_url} alt={rPost.title} fill className="object-cover" referrerPolicy="no-referrer" />
                          ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest font-bold">No Image</div>
                          )}
                        </div>
                        <CardContent>
                          <Badge className="mb-4">{rPost.category}</Badge>
                          <h4 className="text-xl font-display font-bold text-charleston group-hover:text-[#1B4332] transition-colors line-clamp-2">{rPost.title}</h4>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
