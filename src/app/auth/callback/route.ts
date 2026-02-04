/**
 * Auth Callback Route Handler
 * 
 * This route handles the callback from Supabase email verification.
 * It exchanges the auth code for a session and redirects to the dashboard.
 */

import { createServerSupabaseClient } from '@/libs/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after email verification
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
