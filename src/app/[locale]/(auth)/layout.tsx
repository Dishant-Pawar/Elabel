// TEMPORARILY BYPASS CLERK AUTHENTICATION
// import { enUS, frFR } from '@clerk/localizations';
// import { ClerkProvider } from '@clerk/nextjs';
// import { AppConfig } from '@/utils/AppConfig';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // ClerkProvider removed - auth temporarily disabled
  return <>{props.children}</>;
}
