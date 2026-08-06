'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Send, ArrowRight, User, Mail, MessageSquare, CheckCircle, Users, ChevronLeft, Loader2, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';

const steps = [
  { id: 'name', label: "What's your name?", type: 'text', placeholder: 'John Doe', icon: User, description: "Let's start with a proper introduction." },
  { id: 'email', label: "What's your work email?", type: 'email', placeholder: 'john@company.com', icon: Mail, description: "We'll use this to send you our proposal." },
  { id: 'company', label: "Where do you work?", type: 'text', placeholder: 'Acme Corp', icon: Users, description: "Tell us about your organization." },
  { id: 'phone', label: "What's your phone number?", type: 'tel', placeholder: '+234 ...', icon: Phone, description: "We'll use this to reach out to you directly." },
  { id: 'subject', label: "What is the subject?", type: 'text', placeholder: 'Inquiry Title', icon: MessageSquare, description: "Give your inquiry a clear title." },
  { id: 'message', label: "How can we help you?", type: 'textarea', placeholder: 'Tell us about your HR needs...', icon: MessageSquare, description: "The more detail, the better we can prepare." },
];

export default function Contact() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', company: '', subject: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    const currentField = steps[currentStep].id as keyof typeof formData;
    if (!formData[currentField].trim()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        if (!supabase) {
          throw new Error('Supabase configuration is missing. Please check your environment variables.');
        }

        const { error: supabaseError } = await supabase
          .from('inquiries')
          .insert([
            { 
              name: formData.name, 
              email: formData.email, 
              company: formData.company, 
              subject: formData.subject, 
              message: formData.message,
              phone: formData.phone
            }
          ]);

        if (supabaseError) {
          console.error('Error saving inquiry:', supabaseError.message);
          setError('Something went wrong. Please try again.');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setIsSubmitted(true);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const stepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <SmoothScroll>
      <main className="bg-charleston min-h-screen flex flex-col">
        <Navbar isDark={true} />
        
        <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
          <div className="max-w-3xl w-full">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-12"
                >
                  {/* Progress Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-caribbean/10 rounded-2xl flex items-center justify-center text-caribbean">
                        <stepData.icon size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-caribbean">Step {currentStep + 1} of {steps.length}</span>
                        <h3 className="text-white font-bold text-sm">{stepData.id.charAt(0).toUpperCase() + stepData.id.slice(1)}</h3>
                      </div>
                    </div>
                    {currentStep > 0 && !isLoading && (
                      <button onClick={handleBack} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <ChevronLeft size={16} /> Back
                      </button>
                    )}
                  </div>

                  {/* Question Section */}
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">{stepData.label}</h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">{stepData.description}</p>
                  </div>

                  {/* Input Section */}
                  <div className="relative">
                    {stepData.type === 'textarea' ? (
                      <textarea
                        disabled={isLoading}
                        autoFocus
                        className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl md:text-4xl text-white focus:border-lemon outline-none transition-colors resize-none h-40 placeholder:text-white/10 disabled:opacity-50"
                        placeholder={stepData.placeholder}
                        value={formData[stepData.id as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [stepData.id]: e.target.value })}
                      />
                    ) : (
                      <input
                        disabled={isLoading}
                        autoFocus
                        type={stepData.type}
                        className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl md:text-4xl text-white focus:border-lemon outline-none transition-colors placeholder:text-white/10 disabled:opacity-50"
                        placeholder={stepData.placeholder}
                        value={formData[stepData.id as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [stepData.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      />
                    )}
                    {error && (
                      <p className="text-red-400 text-sm mt-4 font-bold uppercase tracking-widest">{error}</p>
                    )}
                  </div>

                  {/* Footer Controls */}
                  <div className="flex items-center justify-between pt-12">
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Press <span className="text-white">Enter ↵</span></p>
                      <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-caribbean" />
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleNext}
                      disabled={isLoading || !formData[steps[currentStep].id as keyof typeof formData].trim()}
                      className="group flex items-center gap-4 bg-lemon text-charleston px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          {currentStep === steps.length - 1 ? 'Submit Request' : 'Continue'}
                          {currentStep === steps.length - 1 ? <Send size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
                  <div className="w-24 h-24 bg-caribbean/20 text-caribbean rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={48} />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-display font-bold text-white">Message Received.</h2>
                  <p className="text-xl text-gray-400 max-w-md mx-auto">
                    Thank you, {formData.name.split(' ')[0]}. We&apos;ve received your request and our team will be in touch within 24 hours.
                  </p>
                  <div className="pt-8">
                    <button onClick={() => window.location.href = '/'} className="bg-white text-charleston px-12 py-5 rounded-2xl font-bold text-lg hover:bg-lemon transition-colors shadow-2xl">
                      Back to Home
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </main>
    </SmoothScroll>
  );
}
