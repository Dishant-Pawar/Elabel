import { redirect } from 'next/navigation';

export default function Page() {
  // TEMPORARILY BYPASS AUTH - Redirect directly to dashboard
  redirect('/dashboard');
}