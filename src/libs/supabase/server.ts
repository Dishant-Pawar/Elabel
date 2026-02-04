/**
 * Supabase Server Client Setup
 * 
 * This file creates Supabase client instances for server-side operations
 * including middleware and API routes.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client for server-side operations (Server Components, API Routes)
 * This client handles cookie-based authentication
 * 
 * @returns Supabase client instance with cookie handling
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Cookie setting can fail in Server Components
            // This is expected and can be ignored
          }
        },
      },
    }
  );
}
