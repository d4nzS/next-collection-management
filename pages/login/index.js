import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import useRedirect from '../../hooks/use-redirect';
import AuthForm from '../../components/Auth/AuthForm';
import authHandler from '../../utils/auth-handler';

const isLogin = true;

function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const isAuthed = !!session;

  useRedirect(isAuthed, router);

  if (session === undefined || isAuthed) {
    return;
  }

  const loginHandler = async credentials => {
    await authHandler({ ...credentials, isLogin });

    router.push('/');
  };

  return <AuthForm isLoginMode={isLogin} onAuth={loginHandler}/>;
}

export default LoginPage;