'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AdBanner from '@/components/AdBanner';

interface BlogArticleContentProps {
  rawContent: string;
}

export default function BlogArticleContent({ rawContent }: BlogArticleContentProps) {
  // Smooth scroll helper
  const handleScrollToSection = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 110; // Offset for sticky navbar
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Helper to split raw markdown content into structured, navigable sections
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

    // 3. Fallback: Split by paragraphs into chunks of 3-4 paragraphs
    const paragraphs = markdown.split(/\n\n+/).filter(p => p.trim().length > 0);
    const chunkSize = 3;
    const chunks: string[] = [];
    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      chunks.push(paragraphs.slice(i, i + chunkSize).join('\n\n'));
    }
    return chunks.length > 0 ? chunks : [markdown];
  };

  const sections = parseSections(rawContent);

  return (
    <div className="relative space-y-16">
      {sections.map((sectionContent, index) => {
        const sectionId = `blog-section-${index + 1}`;
        const nextSectionId = index < sections.length - 1 ? `blog-section-${index + 2}` : 'author-section';
        const isLastSection = index === sections.length - 1;

        // Insert ad placeholder in middle section if multiple sections exist
        const showAdAfter = sections.length > 1 && index === Math.floor(sections.length / 2);

        return (
          <section
            key={sectionId}
            id={sectionId}
            className="scroll-mt-32 transition-all duration-300"
          >
            {/* Markdown Renderer */}
            <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
              prose-headings:font-display prose-headings:text-charleston prose-headings:font-bold
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg md:prose-p:text-xl
              prose-strong:text-charleston prose-strong:font-bold
              prose-hr:border-gray-100 prose-hr:my-16
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
                        <h2 className="text-3xl md:text-4xl lg:text-5xl mt-14 mb-8 flex items-baseline gap-2 font-display font-bold text-charleston tracking-tight">
                          <span>{match[1]}</span>
                          <span className="text-caribbean font-light">{match[2]}</span>
                          <span>{match[3]}</span>
                        </h2>
                      );
                    }
                    return (
                      <h2 className="text-3xl md:text-4xl lg:text-5xl mt-14 mb-8 font-display font-bold text-charleston tracking-tight" {...props} />
                    );
                  },
                  h3: ({ node, ...props }) => {
                    const text = String(props.children);
                    if (text.toLowerCase().includes('key takeaways')) {
                      return (
                        <div className="bg-soft-grey/40 border border-gray-100 p-8 md:p-12 rounded-[36px] my-14 group transition-all hover:shadow-xl shadow-sm">
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
                      );
                    }
                    return <h3 className="text-2xl md:text-3xl mt-12 mb-6 font-display font-bold text-charleston" {...props} />;
                  },
                  // iOS-style polished Image rendering with proper spacing and extended section margins
                  img: ({ node, ...props }) => {
                    if (!props.src) return null;
                    return (
                      <figure className="my-12 md:my-16 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 relative group">
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
                    <blockquote className="relative border-l-4 border-[#1B4332] bg-soft-grey/30 px-8 md:px-12 py-8 rounded-r-[32px] my-12 group border-0 shadow-sm">
                      <div className="text-xl md:text-2xl text-charleston italic font-display leading-[1.6] opacity-95">
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
                    <div className="overflow-x-auto my-12 rounded-[28px] border border-gray-200/80 shadow-md">
                      <table className="w-full text-left border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => <thead className="bg-soft-grey/80" {...props} />,
                  th: ({ node, ...props }) => <th className="p-6 text-xs font-black uppercase tracking-widest text-charleston/70 border-b border-gray-200" {...props} />,
                  td: ({ node, ...props }) => <td className="p-6 text-sm md:text-base text-gray-600 border-b border-gray-100 last:border-0" {...props} />,
                }}
              >
                {sectionContent}
              </ReactMarkdown>
            </div>

            {/* Ad Banner between sections if applicable */}
            {showAdAfter && (
              <div className="my-14">
                <AdBanner />
              </div>
            )}

            {/* Bouncing "Read More" Section Link */}
            <div className="mt-12 pt-8 pb-4 flex flex-col items-center justify-center border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleScrollToSection(nextSectionId)}
                className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm md:text-base font-extrabold text-[#1B4332] hover:text-[#2D6A4F] active:scale-95 bg-transparent border-0 transition-all cursor-pointer select-none rounded-full"
                aria-label={isLastSection ? 'Scroll to conclusion' : `Read section ${index + 2}`}
              >
                <span className="tracking-wide">
                  {isLastSection ? 'Read Conclusion' : 'Read More'}
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
  );
}
