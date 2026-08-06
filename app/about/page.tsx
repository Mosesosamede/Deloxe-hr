'use client';

import { motion } from 'motion/react';
import { Target, Eye, Heart, Shield, Zap, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';

import Image from 'next/image';

export default function About() {
  return (
    <SmoothScroll>
      <main className="bg-soft-grey min-h-screen">
        <Navbar />
        
        {/* Cores Section */}
        <section className="pt-40 pb-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-charleston mb-6">Our Leadership</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Meet the masterminds and digital pioneers driving next-generation HR operations. Our multi-disciplinary team brings together elite regional management, global finance prowess, and bleeding-edge systems architecture to empower organizations worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                {
                  role: "Managing Director",
                  image: "https://i.ibb.co/ynmP4R1q/princes-gugua.jpg",
                  bio: "Guiding the strategic vision and continuous organizational growth at Deloxe HR with elite leadership."
                },
                {
                  role: "Chief Financial Officer",
                  image: "https://i.ibb.co/5WJWky3f/adward.png",
                  bio: "Directing financial strategies, asset growth, and sound fiscal administration globally."
                },
                {
                  role: "Chief Operating Officer",
                  image: "https://i.ibb.co/C5NW20vd/ruth-frances-peg.jpg",
                  bio: "Optimizing overall workflow systems, talent coordination, and internal operational dynamics."
                },
                {
                  role: "Chief Digital Architect",
                  image: "https://i.ibb.co/x8dR1xPf/moseso-o.jpg",
                  bio: "Designing reliable, high-performance, and futuristic digital systems for seamless workforce scaling."
                }
              ].map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-6 shadow-xl">
                    <Image 
                      src={member.image}
                      alt={member.role}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charleston/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                      <p className="text-white text-sm font-medium leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                  <p className="text-caribbean font-bold text-sm uppercase tracking-widest">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Box: Mission & Vision */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mission */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="md:col-span-2 p-12 rounded-[40px] bg-charleston text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-caribbean/10 rounded-full blur-[80px] group-hover:bg-caribbean/20 transition-colors" />
                <Target className="text-caribbean mb-8" size={48} />
                <h2 className="text-4xl font-display font-bold mb-6">Our Mission</h2>
                <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                  To empower organizations and individuals through innovative  HR solutions that bridge the gap between ambition and opportunity, fostering a global workforce that is efficient, compliant, and inspired.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="p-12 rounded-[40px] bg-white border border-gray-100 shadow-xl"
              >
                <Eye className="text-caribbean mb-8" size={48} />
                <h2 className="text-3xl font-display font-bold text-charleston mb-6">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To be the global benchmark for innovative HR consulting, where technology and human expertise converge.
                </p>
              </motion.div>

              {/* Values */}
              {[
                { icon: Heart, title: 'Empathy', desc: 'We put people first, always.' },
                { icon: Shield, title: 'Integrity', desc: 'Trust is our foundation.' },
                { icon: Zap, title: 'Innovation', desc: 'Always pushing boundaries.' },
              ].map((value, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-10 rounded-[40px] bg-white border border-gray-100 shadow-xl flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-soft-grey rounded-2xl flex items-center justify-center text-charleston mb-6">
                    <value.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-charleston mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm">{value.desc}</p>
                </motion.div>
              ))}
              
              {/* Stats */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="md:col-span-3 p-12 rounded-[40px] bg-caribbean text-charleston flex flex-wrap justify-around items-center gap-12"
              >
                <div className="text-center">
                  <span className="text-6xl font-display font-black block">500+</span>
                  <span className="font-bold uppercase tracking-widest text-sm">Clients Served</span>
                </div>
                <div className="text-center">
                  <span className="text-6xl font-display font-black block text-lemon">10k+</span>
                  <span className="font-bold uppercase tracking-widest text-sm">Talent Placed</span>
                </div>
                <div className="text-center">
                  <span className="text-6xl font-display font-black block">98%</span>
                  <span className="font-bold uppercase tracking-widest text-sm">Retention Rate</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  );
}
