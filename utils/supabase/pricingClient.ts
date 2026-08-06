import { createBrowserClient } from "@supabase/ssr";

export const createPricingClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_PRICING_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_PRICING_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return null during build/SSR if keys are missing to avoid crashing
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
