'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Check, Zap, Shield, Users, FileText, ChevronLeft, ChevronRight, Loader2, Globe2, ArrowRight, Copy, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, onSnapshot, getDocs, setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useCurrency } from '@/lib/CurrencyContext';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

// Interfaces for structured data
interface PlanTier {
  tier_name: string;
  tier_description: string;
  is_custom_pricing: boolean;
  pricing: {
    monthly: number | null;
    quarterly: number | null;
    biannual: number | null;
  };
}

interface DBPlan {
  name: string;
  slug: string;
  description: string;
  features: string[];
  tiers: PlanTier[];
}

interface ExchangeRate {
  currency: string;
  rate: number;
}

const USD_DEFAULT: ExchangeRate = { currency: 'USD', rate: 1.0 };

export default function Pricing() {
  const { currency, setCurrency } = useCurrency();
  const [plans, setPlans] = useState<DBPlan[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User preference states initialized safely
  const [selectedCurrency, setSelectedCurrency] = useState<ExchangeRate>(USD_DEFAULT);

  useEffect(() => {
    const rate = exchangeRates.find((r) => r.currency === currency) || USD_DEFAULT;
    setSelectedCurrency(rate);
  }, [currency, exchangeRates]);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Quarterly' | 'Biannual'>('Monthly');
  const [selectedTiers, setSelectedTiers] = useState<{ [planName: string]: string }>({});

  // Carousel slider indices for mobile view
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && plans.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get('plan');
      if (planParam) {
        const lowerPlan = planParam.toLowerCase();
        setHighlightedPlan(lowerPlan);
        
        // Find if this plan exists in our plans array
        const matchedIndex = plans.findIndex(
          (p) => p.slug.toLowerCase() === lowerPlan || p.name.toLowerCase() === lowerPlan
        );
        if (matchedIndex !== -1) {
          setCurrentIndex(matchedIndex);
        }

        setTimeout(() => {
          const element = document.getElementById(`plan-card-${lowerPlan}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    }
  }, [isLoading, plans]);

  // Form modal triggers & states
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<{
    plan: DBPlan;
    tier: PlanTier;
  } | null>(null);

  const [formFields, setFormFields] = useState({
    companyName: '',
    contactName: '',
    emailAddress: '',
    phoneNumber: '',
    additionalNotes: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [txRef, setTxRef] = useState('');
  const [paymentTriggered, setPaymentTriggered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormFields((prev) => ({
          ...prev,
          emailAddress: currentUser.email || prev.emailAddress,
          contactName: currentUser.displayName || prev.contactName,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Compute exact amounts dynamically
  const usdPrice = activeSubscription?.tier.pricing[billingCycle.toLowerCase() as 'monthly' | 'quarterly' | 'biannual'] || 0;
  const currentRateObj = selectedCurrency;
  let calculatedAmount = usdPrice * (currentRateObj?.rate || 1);
  if (currentRateObj?.currency === 'NGN') {
    calculatedAmount = Math.round(calculatedAmount / 100) * 100;
  } else {
    calculatedAmount = Math.round(calculatedAmount);
  }
  const calculatedCurrency = currentRateObj?.currency || 'USD';

  const flutterwaveConfig = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: txRef,
    amount: calculatedAmount,
    currency: calculatedCurrency,
    payment_options: 'card,banktransfer,ussd,mobilemoney',
    customer: {
      email: formFields.emailAddress,
      phone_number: formFields.phoneNumber,
      name: formFields.contactName,
    },
    customizations: {
      title: formFields.contactName || activeSubscription?.plan.name || 'Deloxe Subscription',
      description: `Subscription for ${activeSubscription?.plan.name} - ${activeSubscription?.tier.tier_name} (${billingCycle})`,
      logo: 'https://ais-dev-ezzonyhwhrl7i6njocr4rw-406872955515.europe-west2.run.app/favicon.ico',
    },
  };

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);

  useEffect(() => {
    if (paymentTriggered && txRef) {
      setPaymentTriggered(false);
      handleFlutterwavePayment({
        callback: async (response: any) => {
          console.log("Flutterwave payment response:", response);
          closePaymentModal();
          
          if (response.status === 'successful' || response.status === 'completed') {
            setFormLoading(true);
            try {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  transaction_id: response.transaction_id,
                  tx_ref: response.tx_ref,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setFormSuccess(true);
              } else {
                setFormError(verifyData.error || 'Payment verification failed. Please contact support.');
              }
            } catch (err) {
              console.error("Verification error:", err);
              setFormError('An error occurred while verifying payment. Please contact support.');
            } finally {
              setFormLoading(false);
            }
          } else {
            setFormError('Payment was not successful. Please try again.');
            setFormLoading(false);
          }
        },
        onClose: () => {
          setFormLoading(false);
        }
      });
    }
  }, [paymentTriggered, txRef, handleFlutterwavePayment]);

  useEffect(() => {
    const unsubPlans = onSnapshot(collection(db, 'plans'), (snapshot) => {
      const plansData: DBPlan[] = [];
      snapshot.forEach((doc) => {
        plansData.push(doc.data() as DBPlan);
      });
      setPlans(plansData);
      
      // Initialize selectedTiers
      const initialTiers: { [planName: string]: string } = {};
      plansData.forEach((plan) => {
        if (plan.tiers.length > 0) {
          initialTiers[plan.name] = plan.tiers[0].tier_name;
        }
      });
      setSelectedTiers(initialTiers);
      
      setIsLoading(false);
    });

    const unsubRates = onSnapshot(collection(db, 'exchange_rates'), (snapshot) => {
      const ratesData: ExchangeRate[] = [];
      snapshot.forEach((doc) => {
        ratesData.push(doc.data() as ExchangeRate);
      });
      setExchangeRates(ratesData);
    });

    return () => {
      unsubPlans();
      unsubRates();
    };
  }, []);

  // Frontend currency converter
  const formatValue = (usdPrice: number | null, rate: ExchangeRate): string => {
    if (usdPrice === null) return 'Contact Sales';
    const converted = usdPrice * rate.rate;
    
    let rounded = Math.round(converted);
    if (rate.currency === 'NGN') {
      rounded = Math.round(converted / 100) * 100;
    }

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: rate.currency,
        maximumFractionDigits: 0
      }).format(rounded);
    } catch {
      return `${rate.currency} ${rounded}`;
    }
  };

  // Prepares the modal with prefilled data
  const handleOpenSubscription = (plan: DBPlan) => {
    const selectedTierName = selectedTiers[plan.name];
    const tierObject = plan.tiers.find(t => t.tier_name === selectedTierName) || plan.tiers[0];
    
    setActiveSubscription({
      plan,
      tier: tierObject
    });
    setFormSuccess(false);
    setShowPaymentInfo(false);
    setCopiedAccount(false);
    setFormError(null);
    setModalOpen(true);
  };
    
  const seedDatabase = async () => {
    try {
        const { setDoc, doc } = await import('firebase/firestore');
        const plans = [
          {
            name: "FlexiForce",
            slug: "flexiforce",
            description: "Deploy agile on-demand support teams and task squads across multiple time zones instantly.",
            features: [
              'On-demand visual squad builder',
              'Time-tracker & task automated logs',
              'Direct integration with Slack & Teams',
              'Shared collaborative whiteboard',
              'Priority squad lead support'
            ],
            tiers: [
              { tier_name: "Small Team (1-10 employees)", tier_description: "For small squads", is_custom_pricing: false, pricing: { monthly: 500, quarterly: 1350, biannual: 2500 } },
              { tier_name: "Medium Team (11-50 employees)", tier_description: "For growing teams", is_custom_pricing: false, pricing: { monthly: 1200, quarterly: 3200, biannual: 6000 } },
              { tier_name: "Large Team (51+ employees)", tier_description: "For larger enterprises", is_custom_pricing: true, pricing: { monthly: null, quarterly: null, biannual: null } }
            ]
          },
          {
            name: "Remotely",
            slug: "remotely",
            description: "All-in-one distributed HR ledger, payroll operations, global benefits, and compliance suite.",
            features: [
              'Pre-configured global general ledger',
              'Cross-border payroll mechanics',
              'Regional benefits automatic allocation',
              'Custom enterprise directory RBAC',
              'Dedicated compliance lawyer access'
            ],
            tiers: [
              { tier_name: "Virtual Assistant", tier_description: "For remote support", is_custom_pricing: false, pricing: { monthly: 800, quarterly: 2250, biannual: 4200 } },
              { tier_name: "HR Generalist", tier_description: "For HR management", is_custom_pricing: false, pricing: { monthly: 1200, quarterly: 3300, biannual: 6300 } },
              { tier_name: "Admin Interns", tier_description: "For administrative tasks", is_custom_pricing: false, pricing: { monthly: 500, quarterly: 1350, biannual: 2500 } }
            ]
          }
        ];
        const rates = [
          { currency: "USD", rate: 1 },
          { currency: "NGN", rate: 1650 }
        ];
        for (const plan of plans) await setDoc(doc(db, "plans", plan.slug), plan);
        for (const rate of rates) await setDoc(doc(db, "exchange_rates", rate.currency), rate);
        alert('Seeding complete!');
    } catch (e) {
        console.error(e);
        alert('Seeding failed: ' + e);
    }
  };
  
  // Icon resolver needs to be updated because I renamed attributes (e.g. plan_name to name)
  const getPlanIcon = (name: string) => {
    const norm = (name || '').toLowerCase();
    if (norm.includes('force') || norm.includes('flexi')) return Zap;
    if (norm.includes('remotely') || norm.includes('remote')) return Shield;
    if (norm.includes('resource') || norm.includes('hire') || norm.includes('talent')) return Users;
    if (norm.includes('doc') || norm.includes('contract') || norm.includes('mate')) return FileText;
    return Zap;
  };

  // Captures and validates registration inputs
  const handleSubmitSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    // Basic Validation Check
    if (!formFields.companyName.trim() || !formFields.contactName.trim() || !formFields.emailAddress.trim() || !formFields.phoneNumber.trim()) {
      setFormError('Please fill in all required fields.');
      setFormLoading(false);
      return;
    }

    // Email format simple check
    if (!formFields.emailAddress.includes('@')) {
      setFormError('Please enter a valid work email address.');
      setFormLoading(false);
      return;
    }

    if (!activeSubscription) {
      setFormError('No active subscription selected.');
      setFormLoading(false);
      return;
    }

    try {
      // 1. Generate unique tx_ref
      const cleanTierName = activeSubscription.tier.tier_name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const generatedTxRef = `tx-${activeSubscription.plan.slug}-${cleanTierName}-${billingCycle.toLowerCase()}-${Date.now()}`;

      // 2. Save pending payment info to Firestore
      await setDoc(doc(db, 'pending_payments', generatedTxRef), {
        userId: user?.uid || null,
        companyName: formFields.companyName,
        customerName: formFields.contactName,
        email: formFields.emailAddress,
        phoneNumber: formFields.phoneNumber,
        additionalNotes: formFields.additionalNotes || '',
        packageName: activeSubscription.plan.name,
        packageId: activeSubscription.plan.slug,
        tierName: activeSubscription.tier.tier_name,
        billingCycle: billingCycle,
        amount: calculatedAmount,
        currency: calculatedCurrency,
        txRef: generatedTxRef,
        status: 'Pending Payment Instructions',
        createdAt: Date.now(),
      });

      setTxRef(generatedTxRef);
    } catch (err: any) {
      console.warn("Firestore save optional, proceeding to payment screen:", err);
    } finally {
      setFormLoading(false);
      setShowPaymentInfo(true);
    }
  };

  const handleConfirmIHavePaid = async () => {
    setFormLoading(true);
    try {
      if (txRef) {
        await setDoc(doc(db, 'pending_payments', txRef), {
          status: 'Payment Submitted - Awaiting Verification',
          paidAt: Date.now(),
          paymentMethod: 'Bank Transfer',
          beneficiaryDetails: {
            bankName: 'Providus Bank',
            accountNumber: '1307218912',
            accountName: 'DELOXE HR',
          },
        }, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore payment status update optional:", err);
    } finally {
      setFormLoading(false);
      setShowPaymentInfo(false);
      setFormSuccess(true);
    }
  };

  // Automatic Swiping navigation controllers for mobile
  const nextSlide = () => {
    if (plans.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % plans.length);
    }
  };
  const prevSlide = () => {
    if (plans.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length);
    }
  };

  return (
    <SmoothScroll>
      <main className="bg-soft-grey min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-12 md:pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="bg-caribbean/13 text-caribbean px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-6 shadow-sm">
              Standard Plans
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-display font-bold text-midnight mb-6 md:mb-8 leading-tight"
            >
              Enterprise-Grade <br />
              <span className="text-gradient">Flexible Subscriptions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-4"
            >
              Streamline your HR operations with our highly polished plan ecosystem. Configured to align with your organization&apos;s scale, cycle, and location.
            </motion.p>

            {/* Controls panel: Billing Cycles & Currency Switcher */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-2xl mx-auto bg-white p-4 rounded-3xl shadow-lg border border-gray-100">
              {/* Billing Cycle Segmented Selector */}
              <div className="flex items-center gap-2 bg-soft-grey p-1.5 rounded-2xl w-full md:w-auto">
                {(['Monthly', 'Quarterly', 'Biannual'] as const).map((cycle) => (
                  <button
                     key={cycle}
                     onClick={() => setBillingCycle(cycle)}
                     className={`flex-1 md:flex-initial py-2 px-4 rounded-xl text-xs md:text-sm font-bold transition-all relative ${
                       billingCycle === cycle ? 'bg-charleston text-white shadow-md' : 'text-gray-500 hover:text-charleston'
                     }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-gray-200 hidden md:block" />

              {/* Currency Selector Dropdown */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-center font-sans">
                <Globe2 className="text-gray-400" size={18} />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Currency:</span>
                <select
                  value={selectedCurrency.currency}
                  onChange={(e) => {
                    setCurrency(e.target.value as any);
                  }}
                  className="bg-soft-grey border border-gray-100 rounded-xl px-3 py-1.5 text-xs md:text-sm font-bold text-charleston outline-none focus:border-caribbean transition-colors cursor-pointer font-sans"
                >
                  {exchangeRates.map((rate) => (
                    <option key={rate.currency} value={rate.currency} className="font-sans">
                      {rate.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards Catalog Core Section */}
        <section className="pb-32 px-4 md:px-6 relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
              <Loader2 className="animate-spin text-caribbean mb-4" size={48} />
              <p className="text-gray-500 text-sm font-semibold">Preparing subscription catalog...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto relative animate-fade-in">
              
              {/* Desktop view Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {plans.map((plan) => {
                  const IconComponent = getPlanIcon(plan.name);
                  const currentTierName = selectedTiers[plan.name];
                  const currentTier = plan.tiers.find((t) => t.tier_name === currentTierName) || plan.tiers[0];
                  const currentPrice = currentTier?.pricing[billingCycle.toLowerCase() as 'monthly' | 'quarterly' | 'biannual'];
                  const isCustom = currentTier?.is_custom_pricing || currentPrice === null;

                  const isHighlighted = highlightedPlan === plan.slug.toLowerCase() || highlightedPlan === plan.name.toLowerCase();

                  return (
                    <motion.div
                      key={plan.name}
                      id={`plan-card-${plan.slug.toLowerCase()}`}
                      whileHover={{ y: -8 }}
                      className={`flex flex-col justify-between bg-white rounded-[32px] border-2 p-6 lg:p-8 transition-all duration-300 h-full relative ${
                        isHighlighted 
                          ? 'border-caribbean shadow-[0_0_25px_rgba(15,191,159,0.3)] scale-[1.02] ring-4 ring-caribbean/15' 
                          : 'border-gray-100 shadow-xl hover:border-caribbean'
                      }`}
                    >
                      {plan.name === 'Remotely' && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lemon text-charleston px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                          Enterprise Choice
                        </div>
                      )}

                      <div>
                        {/* Plan Header */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-charleston text-caribbean rounded-2xl flex items-center justify-center flex-shrink-0">
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-black text-charleston">{plan.name}</h3>
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed mb-6 min-h-[48px] h-auto">{plan.description}</p>

                        <div className="border-t border-b border-gray-100 py-4 mb-6">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-sans">
                            Select Scale Tier:
                          </label>
                          <div className="flex flex-col gap-1.5">
                            {plan.tiers.map((t) => (
                              <button
                                key={t.tier_name}
                                onClick={() => setSelectedTiers((prev) => ({ ...prev, [plan.name]: t.tier_name }))}
                                className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border flex justify-between items-center cursor-pointer ${
                                  currentTierName === t.tier_name
                                    ? 'bg-charleston text-white border-charleston'
                                    : 'bg-soft-grey text-gray-600 border-transparent hover:bg-gray-200'
                                }`}
                              >
                                <span className="font-sans">{t.tier_name}</span>
                                {currentTierName === t.tier_name && <Check size={12} className="text-caribbean" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dynamics Pricing Counter */}
                        <div className="mb-6">
                          {isCustom ? (
                            <div className="min-h-[76px] py-2 flex items-center">
                              <span className="text-3xl font-display font-black text-charleston">Contact Sales</span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-baseline gap-1.5 min-h-[76px] py-2">
                              <span className="text-3xl md:text-2xl lg:text-3xl xl:text-4xl font-display font-black text-charleston tracking-tight break-all">
                                {formatValue(currentPrice, selectedCurrency)}
                              </span>
                              <span className="text-gray-400 font-semibold text-xs lowercase font-sans whitespace-nowrap">
                                /{billingCycle === 'Monthly' ? 'mo' : billingCycle === 'Quarterly' ? 'qtr' : '6mo'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Features List */}
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block font-sans">Included Modules:</h4>
                        <ul className="space-y-2.5 mb-8">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2.5 text-charleston font-medium text-xs leading-normal">
                              <div className="w-4.5 h-4.5 rounded-full bg-caribbean/13 flex items-center justify-center text-caribbean flex-shrink-0 mt-0.5">
                                <Check size={11} />
                              </div>
                              <span className="font-sans">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Checkout actions */}
                      <button
                        onClick={() => handleOpenSubscription(plan)}
                        className={`w-full py-4.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm font-sans ${
                          plan.name === 'Remotely'
                            ? 'bg-caribbean text-charleston hover:bg-charleston hover:text-white'
                            : 'bg-charleston text-white hover:bg-caribbean hover:text-charleston'
                        }`}
                      >
                        <span className="font-sans">{isCustom ? 'Reach Out to Sales' : 'Subscribe Now'}</span>
                        <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Swipe-Smooth responsive layout */}
              <div className="md:hidden block">
                <div className="relative overflow-hidden py-4 px-2">
                  <div className="flex flex-col gap-6">
                    {plans.map((plan, i) => {
                      if (currentIndex !== i) return null;
                      const IconComponent = getPlanIcon(plan.name);
                      const currentTierName = selectedTiers[plan.name];
                      const currentTier = plan.tiers.find((t) => t.tier_name === currentTierName) || plan.tiers[0];
                      const currentPrice = currentTier?.pricing[billingCycle.toLowerCase() as 'monthly' | 'quarterly' | 'biannual'];
                      const isCustom = currentTier?.is_custom_pricing || currentPrice === null;

                      const isHighlighted = highlightedPlan === plan.slug.toLowerCase() || highlightedPlan === plan.name.toLowerCase();

                      return (
                        <motion.div
                          key={plan.name}
                          id={`plan-card-mobile-${plan.slug.toLowerCase()}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`bg-white rounded-[32px] border-2 p-6.5 relative transition-all duration-300 ${
                            isHighlighted 
                              ? 'border-caribbean shadow-[0_0_25px_rgba(15,191,159,0.3)] ring-4 ring-caribbean/15' 
                              : 'border-gray-100 shadow-xl'
                          }`}
                        >
                          <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 bg-charleston text-caribbean rounded-2xl flex items-center justify-center flex-shrink-0">
                              <IconComponent size={24} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-display font-black text-charleston">{plan.name}</h3>
                            </div>
                          </div>

                          <p className="text-gray-500 text-sm leading-relaxed mb-6 font-sans">{plan.description}</p>

                          <div className="border-t border-b border-gray-100 py-4 mb-6">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-sans">
                              Select Scale Tier:
                            </label>
                            <div className="flex flex-col gap-1.5">
                              {plan.tiers.map((t) => (
                                <button
                                  key={t.tier_name}
                                  onClick={() => setSelectedTiers((prev) => ({ ...prev, [plan.name]: t.tier_name }))}
                                  className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border flex justify-between items-center cursor-pointer ${
                                    currentTierName === t.tier_name
                                      ? 'bg-charleston text-white border-charleston'
                                      : 'bg-soft-grey text-gray-600 border-transparent'
                                  }`}
                                >
                                  <span className="font-sans">{t.tier_name}</span>
                                  {currentTierName === t.tier_name && <Check size={12} className="text-caribbean" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="mb-6">
                            {isCustom ? (
                              <span className="text-3xl font-display font-black text-charleston">Contact Sales</span>
                            ) : (
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-display font-black text-charleston tracking-tight">
                                  {formatValue(currentPrice, selectedCurrency)}
                                </span>
                                <span className="text-gray-400 font-semibold text-xs uppercase font-sans">
                                  /{billingCycle === 'Monthly' ? 'mo' : billingCycle === 'Quarterly' ? 'qtr' : '6mo'}
                                </span>
                              </div>
                            )}
                          </div>

                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block font-sans">Included Modules:</h4>
                          <ul className="space-y-2.5 mb-8">
                            {plan.features.map((f) => (
                              <li key={f} className="flex items-start gap-2.5 text-charleston font-medium text-xs leading-normal">
                                <div className="w-4.5 h-4.5 rounded-full bg-caribbean/13 flex items-center justify-center text-caribbean flex-shrink-0 mt-0.5">
                                  <Check size={11} />
                                </div>
                                <span className="font-sans">{f}</span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={() => handleOpenSubscription(plan)}
                            className="w-full py-4 bg-charleston text-white rounded-2xl font-bold text-sm hover:bg-caribbean hover:text-charleston transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm font-sans"
                          >
                            <span className="font-sans">{isCustom ? 'Reach Out to Sales' : 'Subscribe Now'}</span>
                            <ArrowRight size={16} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Swiper controls for mobile */}
                  <div className="flex items-center justify-between mt-6 px-4">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-charleston active:bg-caribbean cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2.5">
                      {plans.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? 'bg-caribbean w-6' : 'bg-gray-200 w-2'}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-charleston active:bg-caribbean cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Dynamic checkout Modal */}
        <AnimatePresence>
          {modalOpen && activeSubscription && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="absolute inset-0 bg-charleston/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-2xl bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]"
              >
                {formSuccess ? (
                  <div className="text-center py-8 font-sans">
                    <div className="w-16 h-16 bg-caribbean/15 rounded-full flex items-center justify-center mx-auto mb-6 text-caribbean">
                      <Check size={36} />
                    </div>
                    <h2 className="text-3xl font-display font-black text-charleston mb-3">Payment Notification Received!</h2>
                    <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto mb-4 font-sans leading-relaxed">
                      Thank you for confirming your payment transfer to <strong className="text-charleston">DELOXE HR</strong> at <strong className="text-charleston">Providus Bank</strong> (Account: <span className="font-mono font-bold text-caribbean">1307218912</span>).
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm max-w-md mx-auto mb-8 font-sans">
                      Our accounting and client onboarding team is verifying your deposit. Your subscription portal and integrations will be activated shortly.
                    </p>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="bg-charleston text-white font-bold py-4 px-8 rounded-xl hover:scale-[1.02] transition-all cursor-pointer font-sans"
                    >
                      Return to Catalog
                    </button>
                  </div>
                ) : showPaymentInfo ? (
                  <div className="py-2 font-sans">
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-caribbean/15 text-caribbean flex items-center justify-center flex-shrink-0">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-display font-black text-charleston">Payment Information</h2>
                        <p className="text-gray-500 text-xs md:text-sm font-sans">
                          Please complete your bank transfer using the corporate account details below.
                        </p>
                      </div>
                    </div>

                    {/* Official Beneficiary Account Card */}
                    <div className="bg-charleston text-white p-5 md:p-6 rounded-3xl mb-6 shadow-xl relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-caribbean/15 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-caribbean font-sans">
                          Official Bank Details
                        </span>
                        <span className="bg-white/10 text-lemon text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-sans shrink-0">
                          Direct Transfer
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 font-sans">
                        {/* Bank Name Box */}
                        <div className="bg-white/10 p-3.5 md:p-4 rounded-2xl border border-white/10 flex flex-col justify-center min-w-0">
                          <span className="text-[10px] uppercase text-gray-400 font-bold block mb-1 tracking-wider">
                            Bank Name
                          </span>
                          <span className="text-base md:text-lg font-bold tracking-tight text-white font-sans truncate">
                            Providus Bank
                          </span>
                        </div>

                        {/* Beneficiary Name Box */}
                        <div className="bg-white/10 p-3.5 md:p-4 rounded-2xl border border-white/10 flex flex-col justify-center min-w-0">
                          <span className="text-[10px] uppercase text-gray-400 font-bold block mb-1 tracking-wider">
                            Account Name
                          </span>
                          <span className="text-base md:text-lg font-bold tracking-tight text-white font-sans truncate">
                            DELOXE HR
                          </span>
                        </div>

                        {/* Account Number Box (Full width row with copy button) */}
                        <div className="sm:col-span-2 bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3 min-w-0">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5 tracking-wider">
                              Account Number
                            </span>
                            <span className="text-xl md:text-2xl font-mono font-bold tracking-widest text-lemon truncate block">
                              1307218912
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText('1307218912');
                              setCopiedAccount(true);
                              setTimeout(() => setCopiedAccount(false), 2500);
                            }}
                            className="shrink-0 px-3.5 py-2.5 rounded-xl bg-caribbean text-charleston hover:bg-caribbean/90 active:scale-95 transition-all flex items-center gap-2 text-xs font-black cursor-pointer shadow-md"
                            title="Copy Account Number"
                          >
                            {copiedAccount ? (
                              <>
                                <Check size={15} className="text-charleston" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={15} />
                                <span>Copy Number</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Breakdown Summary */}
                    <div className="bg-soft-grey p-5 rounded-2xl border border-gray-100 mb-6 space-y-2.5 text-xs md:text-sm font-sans">
                      <div className="flex justify-between items-center text-gray-600 gap-2">
                        <span className="shrink-0">Subscription Plan:</span>
                        <span className="font-bold text-charleston text-right truncate">
                          {activeSubscription.plan.name} — <span className="text-caribbean">{activeSubscription.tier.tier_name}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 gap-2">
                        <span className="shrink-0">Billing Cycle:</span>
                        <span className="font-bold text-charleston text-right">{billingCycle}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 gap-2">
                        <span className="shrink-0">Organization / Contact:</span>
                        <span className="font-bold text-charleston text-right truncate">
                          {formFields.companyName} ({formFields.contactName})
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center text-base font-bold text-charleston gap-2">
                        <span className="shrink-0">Total Payable Amount:</span>
                        <span className="text-caribbean font-black text-lg text-right">
                          {formatValue(activeSubscription.tier.pricing[billingCycle.toLowerCase() as 'monthly' | 'quarterly' | 'biannual'], selectedCurrency)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs text-center mb-6 leading-relaxed font-sans px-2">
                      After initiating your transfer, please click the button below to notify our accounting desk to confirm your payment.
                    </p>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col md:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPaymentInfo(false)}
                        className="w-full md:w-1/3 border border-gray-200 text-charleston font-bold py-4 rounded-xl hover:bg-soft-grey transition-all cursor-pointer font-sans text-sm"
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmIHavePaid}
                        disabled={formLoading}
                        className="w-full md:w-2/3 bg-caribbean text-charleston font-black py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans shadow-lg shadow-caribbean/20 text-base"
                      >
                        {formLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Confirming Payment...</span>
                          </>
                        ) : (
                          <>
                            <Check size={20} />
                            <span>I Have Paid</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-charleston mb-2">Commit Subscription</h2>
                    <p className="text-gray-500 text-xs md:text-sm mb-6 font-sans">
                      Review your subscription parameters below and supply your organization&apos;s primary point of contact to establish provisioning.
                    </p>

                    {/* Snapshot of chosen subscription parameters */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-soft-grey border border-gray-100 mb-6 font-sans">
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5 font-sans">Selected Plan & Tier</span>
                        <span className="text-xs font-bold text-charleston font-sans">
                          {activeSubscription.plan.name} —{' '}
                          <span className="text-caribbean font-sans">{activeSubscription.tier.tier_name}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5 font-sans">Billing Cycle</span>
                        <span className="text-xs font-bold text-charleston font-sans">{billingCycle}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5 font-sans">Preferred Currency</span>
                        <span className="text-xs font-bold text-charleston font-sans">
                          {selectedCurrency.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5 font-sans">Provisioned Price</span>
                        <span className="text-xs font-bold text-charleston font-sans">
                          {formatValue(activeSubscription.tier.pricing[billingCycle.toLowerCase() as 'monthly' | 'quarterly' | 'biannual'], selectedCurrency)}
                        </span>
                      </div>
                    </div>

                    {formError && (
                      <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100 mb-6 font-sans">
                        {formError}
                      </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmitSubscription}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Company Name <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={formFields.companyName}
                            onChange={(e) => setFormFields((prev) => ({ ...prev, companyName: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="Acme Corp"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Contact Name <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={formFields.contactName}
                            onChange={(e) => setFormFields((prev) => ({ ...prev, contactName: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Work Email <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="email"
                            value={formFields.emailAddress}
                            onChange={(e) => setFormFields((prev) => ({ ...prev, emailAddress: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="john@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Phone Number <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="tel"
                            value={formFields.phoneNumber}
                            onChange={(e) => setFormFields((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                          Additional Requirements / Notes
                        </label>
                        <textarea
                          rows={3}
                          value={formFields.additionalNotes}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                          className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all resize-none font-sans"
                          placeholder="Tell us about custom compliance integrations or specialized remote requirements..."
                        />
                      </div>

                      <div className="flex flex-col md:flex-row gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="w-full md:w-1/3 border border-gray-200 text-charleston font-bold py-4 rounded-xl hover:bg-soft-grey transition-all cursor-pointer font-sans"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={formLoading}
                          className="w-full md:w-2/3 bg-caribbean text-charleston font-bold py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                        >
                          {formLoading ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              <span className="font-sans">Processing Checkout...</span>
                            </>
                          ) : (
                            <>
                              <span className="font-sans">Complete Checkout</span>
                              <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </main>
    </SmoothScroll>
  );
}
