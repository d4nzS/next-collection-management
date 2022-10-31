import { useRouter } from 'next/router';
import { SessionProvider, signOut, useSession } from 'next-auth/react';

import '../styles/globals.css';
import Navbar from '../components/Navbar/Navbar';
import ColorModeProvider from '../store/ColorModeProvider';


const MainWrapper = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session === undefined) {
    return;
  }

  if (session?.user.isBlocked) {
    signOut().then(() => router.reload());
  }

  return (
    <ColorModeProvider>
      {children}
    </ColorModeProvider>
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <MainWrapper>
        <Navbar/>
        <Component {...pageProps}/>
      </MainWrapper>
    </SessionProvider>
  );
}

export default MyApp;