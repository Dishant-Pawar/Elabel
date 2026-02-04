import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

// TEMPORARILY BYPASS - SignUpForm requires Clerk
// import SignUpForm from './SignUpForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignUpPage = (props: { params: { locale: string } }) => {
  // Authentication bypassed - redirect to dashboard
  redirect('/dashboard');
};

export default SignUpPage;