import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import useRedirect from '../../hooks/use-redirect';
import fetchData from '../../utils/fetch-data';
import AdminTable from '../../components/Admin/AdminTable';

function AdminPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;

  const [users, setUsers] = useState([]);

  useRedirect(!isAdmin);

  useEffect(() => {
    const getUsers = async () => await fetchData({ url: 'api/users' });

    getUsers()
      .then(data => setUsers(data))
      .catch(console.log);
  }, []);

  if (session === undefined || !isAdmin) {
    return;
  }

  return <AdminTable users={users}/>
}

export default AdminPage;