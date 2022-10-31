import { useEffect, useState } from 'react';
import fetchData from '../utils/fetch-data';
import Home from '../components/Home/Home';
import LoadingSpinner from '../components/UI/LoadingSpinner';

function HomePage() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getUsers = async () => await fetchData({ url: 'api/users' });

    getUsers()
      .then(data => setUsers(data))
      .catch(console.log);
  }, []);

  if (!users) {
    return <LoadingSpinner/>
  }

  return <Home users={users}/>;
}

export default HomePage;