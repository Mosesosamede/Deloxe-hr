'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge, Card, CardContent, TopBar } from '@/components/UI-Components';
import AdBanner from '@/components/AdBanner';

interface ArticleViewProps {
  post: any;
  relatedPosts: any[];
}

export default function ArticleView({ post, relatedPosts }: ArticleViewProps) {
  // Smooth scroll handler with clearance for sticky navbar
  const handleScrollToSection = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 110;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Helper to divide article markdown content into logical sections for progressive reading
  const parseSections = (markdown: string) => {
    if (!markdown) return [];

    // 1. Try splitting by H2 headings (## Heading)
    const h2Split = markdown.split(/(?=\n##\s+)/g);
    if (h2Split.length > 1) {
      return h2Split.filter(s => s.trim().length > 0);
    }

    // 2. Try splitting by H3 headings (### Heading)
    const h3Split = markdown.split(/(?=\n###\s+)/g);
    if (h3Split.length > 1) {
      return h3Split.filter(s => s.trim().length > 0);
    }

    // 3. Fallback: Split by paragraph blocks into chunks of 3-4 paragraphs
    const paragraphs = markdown.split(/\n\n+/).filter(p => p.trim().length > 0);
    const chunkSize = 3;
    const chunks: string[] = [];
    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      chunks.push(paragraphs.slice(i, i + chunkSize).join('\n\n'));
    }
    return chunks.length > 0 ? chunks : [markdown];
  };

  const sections = parseSections(post.content || '');

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="vignette-ad"
        strategy="lazyOnload"
        src="https://n6wxm.com/vignette.min.js"
        data-zone="10894500"
      />
      <TopBar />
      <Navbar isDark={true} />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-[#1B4332] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-caribbean/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-all uppercase tracking-widest text-[10px] font-bold"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Articles
          </Link>
          <div className="flex justify-center mb-8">
            <Badge className="bg-[#D4AF37] text-white border-0 shadow-lg px-6 py-2 font-bold">{post.category}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-white mb-10 leading-tight">
            {post.title}
          </h1>
          <div className="flex justify-center flex-wrap items-center gap-x-6 gap-y-3 text-white/60 text-[10px] uppercase font-bold tracking-[0.2em]">
            <span className="flex items-center gap-2 underline underline-offset-4 decoration-[#D4AF37]">
              <User size={12} className="text-[#D4AF37]"/> {post.author_name || 'Deloxe Team'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={12}/> {new Date(post.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={12}/> {post.read_time || '5 MIN READ'}
            </span>
          </div>
        </div>
      </section>

      {/* Featured Image - iOS style with softly rounded corners and polished border */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 sm:-mt-24 relative z-20 mb-12 md:mb-16">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl md:rounded-[40px] overflow-hidden shadow-2xl border border-gray-200/90 ring-1 ring-black/5 bg-white p-2 md:p-3 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] group">
          <div className="relative w-full h-full rounded-[18px] md:rounded-[32px] overflow-hidden bg-gray-100">
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
              <div className="w-full h-full flex items-center justify-center text-gray-300 font-sans font-medium">
                Featured Image Not Found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Social Sidebar */}
          <aside className="lg:w-20 flex lg:flex-col items-center gap-6 shrink-0">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest lg:[writing-mode:vertical-lr] lg:rotate-180">Share Content</span>
            <div className="w-px h-12 bg-gray-100 hidden lg:block" />
            <button className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] hover:bg-soft-grey/50 transition-all">
              <Facebook size={18}/>
            </button>
            <button className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] hover:bg-soft-grey/50 transition-all">
              <Twitter size={18}/>
            </button>
            <button className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] hover:bg-soft-grey/50 transition-all">
              <Linkedin size={18}/>
            </button>
            <button className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1B4332] hover:border-[#1B4332] hover:bg-soft-grey/50 transition-all">
              <MessageCircle size={18}/>
            </button>
          </aside>

          {/* Main Content Column */}
          <div className="flex-1 max-w-3xl">
            <article className="max-w-none">
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-gray-600 italic font-display leading-relaxed mb-12 border-b border-gray-100 pb-10">
                  {post.excerpt}
                </p>
              )}

              {/* Sections with Progressive Navigation */}
              <div className="space-y-12">
                {sections.map((sectionContent, index) => {
                  const sectionId = `section-${index + 1}`;
                  const nextSectionId = index < sections.length - 1 ? `section-${index + 2}` : 'author-section';
                  const isLastSection = index === sections.length - 1;
                  const showAd = sections.length > 1 && index === Math.floor(sections.length / 2);

                  return (
                    <section
                      key={sectionId}
                      id={sectionId}
                      className="scroll-mt-32 transition-all duration-300"
                    >
                      {/* Markdown Content */}
                      <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
                        prose-headings:font-display prose-headings:text-charleston prose-headings:font-bold
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg md:prose-p:text-xl
                        prose-strong:text-charleston prose-strong:font-bold
                        prose-hr:border-gray-100 prose-hr:my-14
                        prose-a:text-[#1B4332] prose-a:font-bold hover:prose-a:text-[#D4AF37] transition-all"
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h2: ({ node, ...props }) => {
                              const text = String(props.children);
                              const match = text.match(/(.*?)(#\d+)(.*)/);
                              if (match) {
                                return (
                                  <h2 className="text-3xl md:text-4xl mt-12 mb-8 flex items-baseline gap-2 font-display font-bold text-charleston tracking-tight">
                                    <span>{match[1]}</span>
                                    <span className="text-caribbean font-light">{match[2]}</span>
                                    <span>{match[3]}</span>
                                  </h2>
                                );
                              }
                              return (
                                <h2 className="text-3xl md:text-4xl mt-12 mb-8 font-display font-bold text-charleston tracking-tight" {...props} />
                              );
                            },
                            h3: ({ node, ...props }) => {
                              const text = String(props.children);
                              if (text.toLowerCase().includes('key takeaways')) {
                                return (
                                  <div className="bg-soft-grey/40 border border-gray-100 p-8 md:p-10 rounded-[32px] my-12 group transition-all hover:shadow-lg shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                      <div className="w-10 h-10 bg-[#1B4332] rounded-full flex items-center justify-center text-white ring-8 ring-[#1B4332]/5">
                                        <CheckCircle size={20} />
                                      </div>
                                      <h3 className="text-2xl font-display font-bold text-charleston !m-0">Key Takeaways</h3>
                                    </div>
                                    <div className="prose-ul:m-0 takeaways-list">
                                      {props.children}
                                    </div>
                                  </div>
                                );
                              }
                              return <h3 className="text-2xl md:text-3xl mt-10 mb-6 font-display font-bold text-charleston" {...props} />;
                            },
                            // iOS-style polished Image rendering with proper spacing and extended section margins
                            img: ({ node, ...props }) => {
                              if (!props.src) return null;
                              return (
                                <figure className="my-12 md:my-16 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 relative block group">
                                  <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] border border-gray-200/90 shadow-2xl ring-1 ring-black/5 bg-white p-1.5 sm:p-2 md:p-2.5 transition-transform duration-700 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)]">
                                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[12px] md:rounded-[24px] overflow-hidden bg-gray-100">
                                      <img
                                        src={props.src}
                                        alt={props.alt || 'Article visual'}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                                        loading="lazy"
                                      />
                                    </div>
                                  </div>
                                  {props.alt && (
                                    <figcaption className="mt-3 md:mt-4 text-center text-xs md:text-sm text-gray-500 italic font-sans font-medium px-4">
                                      {props.alt}
                                    </figcaption>
                                  )}
                                </figure>
                              );
                            },
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="relative border-l-4 border-[#1B4332] bg-soft-grey/30 px-6 md:px-10 py-6 rounded-r-[28px] my-10 group border-0 shadow-sm">
                                <div className="text-lg md:text-xl text-charleston italic font-display leading-relaxed opacity-95">
                                  {props.children}
                                </div>
                              </blockquote>
                            ),
                            p: ({ node, ...props }) => (
                              <p className="text-gray-600 text-lg md:text-xl leading-relaxed md:leading-loose mb-8 font-normal" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="space-y-4 my-8 list-none !pl-0" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="flex gap-4 items-start text-gray-600 text-lg md:text-xl">
                                <div className="w-2 h-2 bg-caribbean rounded-full mt-3 shrink-0" />
                                <span>{props.children}</span>
                              </li>
                            ),
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-10 rounded-[24px] border border-gray-200/80 shadow-sm">
                                <table className="w-full text-left border-collapse" {...props} />
                              </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-soft-grey/80" {...props} />,
                            th: ({ node, ...props }) => <th className="p-5 text-xs font-black uppercase tracking-widest text-charleston/70 border-b border-gray-200" {...props} />,
                            td: ({ node, ...props }) => <td className="p-5 text-sm md:text-base text-gray-600 border-b border-gray-100 last:border-0" {...props} />,
                          }}
                        >
                          {sectionContent}
                        </ReactMarkdown>
                      </div>

                      {/* Ad Banner insertion */}
                      {showAd && (
                        <div className="my-12">
                          <AdBanner />
                        </div>
                      )}

                      {/* Subtle Bouncing "Read More" Link for smooth section scrolling */}
                      <div className="mt-10 pt-6 pb-2 flex flex-col items-center justify-center border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleScrollToSection(nextSectionId)}
                          className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm md:text-base font-extrabold text-[#1B4332] hover:text-[#2D6A4F] active:scale-95 bg-transparent border-0 transition-all cursor-pointer select-none rounded-full"
                          aria-label={isLastSection ? 'Scroll to conclusion and author' : `Read section ${index + 2}`}
                        >
                          <span className="tracking-wide">
                            {isLastSection ? 'Read Conclusion & Author' : 'Read More'}
                          </span>
                          <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                            className="text-caribbean group-hover:text-[#1B4332] transition-colors"
                          >
                            <ChevronDown size={20} className="stroke-[2.5]" />
                          </motion.div>
                        </button>
                      </div>
                    </section>
                  );
                })}
              </div>
            </article>

            {/* Author Card */}
            <div id="author-section" className="scroll-mt-32 mt-20 p-8 md:p-12 rounded-[36px] border border-gray-200/80 bg-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#1B4332]" />
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1B4332] rounded-3xl flex items-center justify-center text-white text-3xl md:text-4xl font-display font-bold shadow-xl shrink-0">
                  {post.author_name?.charAt(0) || 'D'}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2 block">The Author</span>
                  <h3 className="text-2xl font-display font-bold text-charleston mb-3">{post.author_name || "Deloxe Team"}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    Specialist in human capital management and technological integration. Dedicated to redefining the modern workplace through empathy and data.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div id="related-section" className="scroll-mt-32 mt-24">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-charleston">Related Insights</h3>
                  <Link href="/blog" className="text-sm font-bold text-[#1B4332] hover:text-[#D4AF37] flex items-center gap-2">
                    View all <ArrowRight size={16}/>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedPosts.map((rPost) => (
                    <Link key={rPost.slug} href={`/blog/${rPost.slug}`} className="group block">
                      <Card className="h-full hover:-translate-y-2 rounded-3xl border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 p-2 bg-white">
                        <div className="relative aspect-video overflow-hidden rounded-[20px] bg-soft-grey">
                          {rPost.image_url ? (
                            <Image 
                              src={rPost.image_url} 
                              alt={rPost.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-105" 
                              referrerPolicy="no-referrer" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest font-bold">No Image</div>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <Badge className="mb-3">{rPost.category}</Badge>
                          <h4 className="text-lg font-display font-bold text-charleston group-hover:text-[#1B4332] transition-colors line-clamp-2">
                            {rPost.title}
                          </h4>
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
  );
}
