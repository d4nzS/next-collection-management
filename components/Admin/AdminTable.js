import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@mui/material';

import fetchData from '../../utils/fetch-data';

const DeleteUserButton = params => {
  const { data: session } = useSession();
  const router = useRouter();

  const deleteUserHandler = async () => {
    const { _id: id } = params.data;

    try {
      await fetchData({
        url: `/api/users/${id}`,
        method: 'DELETE',
      });
      params.api.applyTransaction({ remove: [params.data] });

      if (session?.user.id === id) {
        router.reload('/');
      }
    } catch {
      console.log('something went wrong');
    }
  }

  return <Button onClick={deleteUserHandler}>Delete</Button>;
}

const SaveUserButton = params => {
  const { data: session } = useSession();
  const router = useRouter();

  const saveUserHandler = async () => {
    const { _id: id, ...updatedUser } = params.data;

    try {
      await fetchData({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: updatedUser,
      })

      if (session?.user.id === id && updatedUser.isBlocked === true) {
        router.reload('/');
      }

      if (session?.user.id === id && updatedUser.Admin === true) {
        router.reload('/');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Button onClick={saveUserHandler}>
      Save
    </Button>
  );
}

const ProfileLink = params => {
  const url = `${params.data._id}`;

  return <Link href={url}>Profile</Link>
};

const columns = [
  {
    headerName: 'Profile',
    cellRenderer: ProfileLink,
  },
  {
    headerName: 'Email',
    field: 'email',
  },
  {
    headerName: 'Is Admin',
    field: 'isAdmin',
    cellEditor: 'agSelectCellEditor',
    editable: true,
    cellEditorPopup: true,
    cellEditorParams: {
      values: [true, false],
    }
  },
  {
    headerName: 'Is Blocked',
    field: 'isBlocked',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorPopup: true,
    cellEditorParams: {
      values: [true, false],
    }
  },
  {
    headerName: 'Save',
    cellRenderer: SaveUserButton,
  },
  {
    headerName: 'Delete',
    cellRenderer: DeleteUserButton,
  }
];

const AdminTable = ({ users }) => {
  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: '85vh',
        width: '80%',
        margin: '20px auto',
        maxWidth: '1202px'
      }}
    >
      <AgGridReact
        getRowId={({ data }) => data._id}
        columnDefs={columns}
        rowData={users}>
      </AgGridReact>
    </div>
  );
};

export default AdminTable