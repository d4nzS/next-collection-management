import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import AuthForm from '../../components/Auth/AuthForm';
import authHandler from '../../utils/auth-handler';

function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session === undefined) {
    return;
  }

  if (session) {
    router.push('/');

    return;
  }

  const isLogin = true;

  const loginHandler = async credentials => {
    await authHandler({ ...credentials, isLogin });

    router.push('/');
  };

  return <AuthForm isLoginMode={isLogin} onAuth={loginHandler}/>;
}

export default LoginPage;