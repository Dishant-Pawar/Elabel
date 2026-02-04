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
  // Skip auth for API routes, public assets, and static files
  if (request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/monitoring') ||
      request.nextUrl.pathname.includes('/public/')) {
    return NextResponse.next();
  }

  // Initialize Supabase client for middleware
  const { supabase } = createMiddlewareClient(request);

  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();

  // Extract locale and path
  const pathParts = request.nextUrl.pathname.split('/').filter(Boolean);
  const locale = AllLocales.includes(pathParts[0] as any) ? pathParts[0] : AppConfig.defaultLocale;
  const pathWithoutLocale = '/' + pathParts.slice(AllLocales.includes(pathParts[0] as any) ? 1 : 0).join('/');

  const isAuthPage = pathWithoutLocale === '/login' || pathWithoutLocale === '/signup';
  const isProtectedRoute = pathWithoutLocale.startsWith('/dashboard');
  const isRootPath = pathWithoutLocale === '' || pathWithoutLocale === '/';

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect to dashboard if accessing auth pages with active session
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Redirect root path based on session
  if (isRootPath) {
    const destination = session ? `/${locale}/dashboard` : `/${locale}/login`;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Apply internationalization middleware for all other cases
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'],
};
