/**
 * Supabase Client Setup
 * 
 * This file creates and exports Supabase client instances for both
 * client-side and server-side usage in the Next.js application.
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Create a Supabase client for client-side operations
 * This client is used in React components and client-side code
 * 
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
