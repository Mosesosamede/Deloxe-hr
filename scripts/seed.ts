import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
  },
  {
    name: "Resourcing",
    slug: "resourcing",
    description: "Source, interview, evaluate, and onboard top-tier global technical talent effortlessly.",
    features: [
      'AI-vetted background check pipeline',
      'Automated calendar scheduler triggers',
      'Interactive coding sandbox testing',
      'Direct talent coordinator dashboard',
      'Dedicated success HR officer'
    ],
    tiers: [
      { tier_name: "Standard Recruitment", tier_description: "Standard hiring", is_custom_pricing: false, pricing: { monthly: 1000, quarterly: 2800, biannual: 5400 } },
      { tier_name: "Executive Search", tier_description: "Top-tier search", is_custom_pricing: false, pricing: { monthly: 2500, quarterly: 6900, biannual: 13200 } }
    ]
  },
  {
    name: "DocuMate",
    slug: "documate",
    description: "Automated standard employment agreements, offer letters, and localized NDA compliances.",
    features: [
      'Unlimited standard contracts',
      'Localized e-signature verification',
      'Secure SOC-2 certified cloud vault',
      'Automated regional tax forms',
      'API workspace webhooks triggers'
    ],
    tiers: [
      { tier_name: "Basic", tier_description: "Essential documents", is_custom_pricing: false, pricing: { monthly: 300, quarterly: 800, biannual: 1500 } },
      { tier_name: "Standard", tier_description: "Full compliance", is_custom_pricing: false, pricing: { monthly: 600, quarterly: 1700, biannual: 3200 } },
      { tier_name: "Premium", tier_description: "Enterprise level", is_custom_pricing: false, pricing: { monthly: 1000, quarterly: 2800, biannual: 5400 } }
    ]
  }
];

const rates = [
  { currency: "USD", rate: 1 },
  { currency: "NGN", rate: 1650 },
  { currency: "EUR", rate: 0.87 },
  { currency: "GBP", rate: 0.74 }
];

async function seed() {
  console.log("Seeding started...");
  for (const plan of plans) {
    await setDoc(doc(db, "plans", plan.slug), plan);
    console.log(`Seeded plan: ${plan.name}`);
  }
  for (const rate of rates) {
    await setDoc(doc(db, "exchange_rates", rate.currency), rate);
    console.log(`Seeded rate: ${rate.currency}`);
  }
  console.log("Seeding complete!");
}

seed().catch(console.error);
