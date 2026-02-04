import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

// TEMPORARILY BYPASS - SignInForm requires Clerk
// import SignInForm from './SignInForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignInPage = (props: { params: { locale: string } }) => {
  // Authentication bypassed - redirect to dashboard
  redirect('/dashboard');
};

export default SignInPage;
