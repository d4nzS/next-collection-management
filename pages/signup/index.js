import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import AuthForm from '../../components/Auth/AuthForm';
import authHandler from '../../utils/auth-handler';

function SignUpPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session === undefined) {
    return;
  }

  if (session) {
    router.push('/');

    return;
  }

  const isLogin = false;

  const signUpHandler = async credentials => {
    await authHandler({ ...credentials, isLogin });

    router.push('/');
  };

  return <AuthForm isLoginMode={isLogin} onAuth={signUpHandler}/>;
}

export default SignUpPage;