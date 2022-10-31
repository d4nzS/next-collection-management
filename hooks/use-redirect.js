import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useRedirect = hasNoRight => {
  const router = useRouter();

  useEffect(() => {
    if (hasNoRight)  {
      router.push('/');
    }
  } , [hasNoRight, router]);
};

export default useRedirect;