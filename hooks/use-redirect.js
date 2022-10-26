import { useEffect } from 'react';

const useRedirect = (isAuthed, router) => {
  useEffect(() => {
    if (isAuthed)  {
      router.push('/');
    }
  } , [isAuthed, router]);
};

export default useRedirect;