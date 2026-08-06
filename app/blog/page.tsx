'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, ArrowRight, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { Badge, Card, CardContent, TopBar } from '@/components/UI-Components';
import { createClient } from '@/utils/supabase/client';
import AdBanner from '@/components/AdBanner';

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'new' | 'old'>('new');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let meta = document.querySelector('meta[name="monetag"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'monetag');
      meta.setAttribute('content', '9b5e31398afe57d18fd4a76f5f2e4b6d');
      document.head.appendChild(meta);
    }

    async function fetchPosts() {
      const supabase = createClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('site_id', 'deloxehr');

      if (error) {
        console.error('Error fetching posts:', error.message || error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'new' ? dateB - dateA : dateA - dateB;
    });

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-soft-grey">
        <TopBar />
        <Navbar isDark={false} />

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <Badge className="mb-6">Our Perspective</Badge>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-charleston mb-8 leading-tight">
                  Insights for the <br />
                  <span className="text-[#1B4332]">Future of Work.</span>
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed">
                  Deep dives into HR tech, cultural excellence, and strategic growth.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full pl-12 pr-4 py-3 bg-soft-grey rounded-2xl border-0 focus:ring-2 focus:ring-[#1B4332] outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center bg-soft-grey p-1 rounded-2xl gap-1">
                  <button 
                    onClick={() => setSortOrder('new')}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${sortOrder === 'new' ? 'bg-[#1B4332] text-white' : 'text-gray-500 hover:text-charleston'}`}
                  >
                    Newest
                  </button>
                  <button 
                    onClick={() => setSortOrder('old')}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${sortOrder === 'old' ? 'bg-[#1B4332] text-white' : 'text-gray-500 hover:text-charleston'}`}
                  >
                    Oldest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {!loading && filteredPosts.length > 0 && searchQuery === '' && (
          <section className="pb-12 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              <Link href={`/blog/${filteredPosts[0].slug}`} className="group">
                <div className="relative aspect-[4/3] md:aspect-[21/9] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 bg-white">
                  {filteredPosts[0].image_url ? (
                    <Image 
                      src={filteredPosts[0].image_url} 
                      alt={filteredPosts[0].title} 
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      priority
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-soft-grey flex items-center justify-center text-gray-300">
                      Featured Insight
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charleston/80 via-charleston/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
                    <Badge className="bg-caribbean text-charleston mb-6 border-0">Featured Post</Badge>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight group-hover:text-lemon transition-colors">
                      {filteredPosts[0].title}
                    </h2>
                    <div className="flex items-center gap-8 text-white/60 text-[10px] uppercase font-bold tracking-[0.2em]">
                      <span className="flex items-center gap-2"><User size={12} className="text-caribbean"/> {filteredPosts[0].author_name || 'Deloxe Team'}</span>
                      <span className="flex items-center gap-2"><Calendar size={12}/> {new Date(filteredPosts[0].created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-2 font-black text-caribbean tracking-[0.4em]">Read Article <ArrowRight size={12}/></span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex items-center justify-between">
               <h2 className="text-3xl font-display font-bold text-charleston">
                 {searchQuery ? `Search results for "${searchQuery}"` : 'Recent Articles'}
               </h2>
               <div className="h-px flex-1 mx-8 bg-gray-100 hidden md:block" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-[40px] h-[500px]" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <AnimatePresence>
                  {(searchQuery !== '' ? filteredPosts : filteredPosts.slice(1)).map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      layout
                    >
                      <Link href={`/blog/${post.slug}`} className="group">
                        <Card className="h-full flex flex-col hover:-translate-y-2">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            {post.image_url ? (
                              <Image 
                                src={post.image_url} 
                                alt={post.title} 
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-soft-grey flex items-center justify-center text-gray-300">
                                No Image Available
                              </div>
                            )}
                            <div className="absolute top-6 left-6">
                              <Badge className="bg-white/90 backdrop-blur-md border-0">{post.category}</Badge>
                            </div>
                          </div>
                          <CardContent className="flex-1 flex flex-col">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                              <span className="flex items-center gap-1.5"><Calendar size={12} /> <span suppressHydrationWarning>{new Date(post.created_at).toLocaleDateString()}</span></span>
                              <span className="flex items-center gap-1.5"><Clock size={12} /> {post.read_time || '5 min read'}</span>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-charleston mb-4 group-hover:text-[#1B4332] transition-colors leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                              {post.excerpt || post.content.substring(0, 150) + '...'}
                            </p>
                            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center text-white text-[10px] uppercase font-bold">
                                  {post.author_name?.charAt(0) || 'D'}
                                </div>
                                <span className="text-xs font-bold text-charleston">{post.author_name || 'Deloxe Team'}</span>
                              </div>
                              <ArrowRight className="text-gray-300 group-hover:text-[#1B4332] group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border border-gray-100">
                <Search size={48} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-2xl font-display font-bold text-charleston mb-4">No insights found.</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                  We couldn&apos;t find any articles matching your search criteria. Try a different keyword or category.
                </p>
                <button onClick={() => { setSearchQuery(''); setSortOrder('new'); }} className="text-[#1B4332] font-bold hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 mb-12">
          <AdBanner />
        </div>

        <Footer />
      </main>
    </SmoothScroll>
  );
}
