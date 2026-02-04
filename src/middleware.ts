import {
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AllLocales, AppConfig } from './utils/AppConfig';
import { createMiddlewareClient } from './libs/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export async function middleware(request: NextRequest) {
  // Skip auth for API routes and public assets
  if (request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/monitoring')) {
    return NextResponse.next();
  }

  // Initialize Supabase client for middleware
  const { supabase } = createMiddlewareClient(request);

  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthPage = request.nextUrl.pathname.includes('/login') || 
                     request.nextUrl.pathname.includes('/signup');
  const isProtectedRoute = request.nextUrl.pathname.includes('/dashboard');

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const locale = request.nextUrl.pathname.split('/')[1] || AppConfig.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect to dashboard if accessing auth pages with active session
  if (isAuthPage && session) {
    const locale = request.nextUrl.pathname.split('/')[1] || AppConfig.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'],
};
