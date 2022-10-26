import { signIn } from 'next-auth/react';

async function authHandler({ email, password, isLogin }) {
  const response = await signIn('credentials', {
    email,
    password,
    mode: isLogin ? 'login' : 'registration',
    redirect: false
  });

  if (!response.ok) {
    throw new Error(response.error);
  }
}

export default authHandler;