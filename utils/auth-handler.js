import { signIn } from 'next-auth/react';

async function authHandler({ email, password, isLogin }) {
  const res = await signIn('credentials', {
    email,
    password,
    mode: isLogin ? 'login' : 'registration',
    redirect: false
  });

  if (!res.ok) {
    throw new Error(res.error);
  }
}

export default authHandler;