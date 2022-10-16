import { useSession } from 'next-auth/react';

function HomePage() {
  const { data: session } = useSession();

  if (session === undefined) {
    return;
  }

  if (session) {
    return (
      <>
        Signed in as {session.user.email}<br/>
      </>
    );
  }

  return <>Not signed in :(</>
}

export default HomePage;