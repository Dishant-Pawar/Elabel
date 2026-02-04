# Supabase Authentication Setup

This project now includes a complete Supabase authentication system with email/password login and signup.

## Features

✅ **Email & Password Authentication**
- Secure login with email and password
- User registration with email verification
- Password strength validation (min 8 chars, uppercase, lowercase, number)
- Automatic session management with cookies

✅ **Modern UI**
- Clean, responsive design using Tailwind CSS
- Loading states on form submission
- Clear error and success messages
- Mobile-friendly interface

✅ **Route Protection**
- Middleware-based authentication checks
- Automatic redirects for protected routes
- Session persistence across page refreshes

✅ **User Management**
- Logout functionality in dashboard header
- Email verification flow
- Secure cookie-based sessions

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and API keys

## How to Use

### 1. Sign Up (Create Account)

Navigate to `/signup` or click "Create an account" on the login page:

- Enter a valid email address
- Choose a strong password (min 8 chars with uppercase, lowercase, number)
- Confirm your password
- Click "Create Account"
- Check your email for verification link

### 2. Login

Navigate to `/login`:

- Enter your email and password
- Click "Sign In"
- You'll be redirected to `/dashboard` on success

### 3. Logout

Click the "Account" button in the dashboard header and select "Logout"

## File Structure

```
src/
├── libs/supabase/
│   ├── client.ts          # Client-side Supabase client
│   ├── server.ts          # Server-side Supabase client
│   └── middleware.ts      # Middleware Supabase client
├── app/
│   ├── [locale]/(unauth)/
│   │   ├── login/page.tsx    # Login page
│   │   └── signup/page.tsx   # Signup page
│   └── auth/callback/route.ts # Email verification callback
├── middleware.ts          # Auth protection middleware
└── features/dashboard/
    └── DashboardHeader.tsx # Header with logout button
```

## How It Works

### Authentication Flow

1. **Sign Up:**
   - User submits email/password
   - Supabase creates account and sends verification email
   - User clicks link in email
   - Callback route exchanges code for session
   - User is redirected to dashboard

2. **Login:**
   - User submits credentials
   - Supabase validates and creates session
   - Session stored in secure HTTP-only cookies
   - User redirected to dashboard

3. **Session Management:**
   - Middleware checks for valid session on each request
   - Protected routes (e.g., `/dashboard`) require authentication
   - Auth pages (e.g., `/login`) redirect if already authenticated

### Security Features

- **Password Requirements:** Enforced strong password policy
- **Email Verification:** Optional but recommended email confirmation
- **Secure Cookies:** HTTP-only cookies for session management
- **CSRF Protection:** Built-in with Supabase SSR
- **Route Protection:** Middleware-level authentication checks

## Customization

### Modify Password Requirements

Edit the `validatePassword` function in `src/app/[locale]/(unauth)/signup/page.tsx`:

```typescript
const validatePassword = (pwd: string): string | null => {
  // Add your custom validation logic here
  if (pwd.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  // ... more rules
};
```

### Change Redirect URLs

Update the redirect paths in:
- `src/middleware.ts` - Auth protection redirects
- `src/app/[locale]/(unauth)/login/page.tsx` - Post-login redirect
- `src/app/[locale]/(unauth)/signup/page.tsx` - Post-signup redirect

### Customize UI Styling

The authentication pages use your existing UI components:
- `@/components/ui/button`
- `@/components/ui/input`
- `@/components/ui/card`
- Tailwind CSS classes

## Troubleshooting

### "Invalid login credentials" error
- Check that the email and password are correct
- Ensure the user has verified their email address
- Check Supabase Auth settings allow email/password login

### Middleware errors
- Verify all environment variables are set correctly
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is present
- Check Supabase project is active and not paused

### Email verification not working
- Check Supabase email templates are configured
- Verify email delivery settings in Supabase dashboard
- Check spam folder for verification emails

### Session not persisting
- Ensure cookies are enabled in browser
- Check browser doesn't block third-party cookies
- Verify middleware is properly configured

## Next Steps

Consider adding:
- [ ] Password reset functionality
- [ ] Social auth providers (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Role-based access control
- [ ] Session timeout handling

## Support

For issues specific to Supabase Auth, check:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
