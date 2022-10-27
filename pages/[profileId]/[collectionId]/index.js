import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress } from '@mui/material';

import InputModel from '../../../models/client/input-model';
import fetchData from '../../../utils/fetch-data';
import Table from '../../../components/UI/Table';

const itemModalTemplate = [
  new InputModel({ name: 'name', label: 'Name' }),
  new InputModel({ name: 'tags', label: 'Tags' })
];

const itemTableTemplate = [
  new InputModel({ name: '_id', label: 'id', enableEditing: false }),
  ...itemModalTemplate
];

function CollectionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = router.query.profileId;
  const collectionId = router.query.collectionId;

  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    const getItems = async () => await fetchData({
      url: `/api/collection/item/getAll/${userId}/${collectionId}`
    });

    setError(null);

    if (userId && collectionId) {
      getItems()
        .then(data => setItems(data))
        .catch(err => setError(err));
    }
  }, [userId, collectionId]);

  if (error) {
    return <Error statusCode={error.status} title={error.message}/>;
  }

  if (session === undefined) {
    return;
  }

  if (!items) {
    return <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <CircularProgress/>
    </Box>;
  }

  const createItemHandler = async item => {
    try {
      return await fetchData({
        url: '/api/collection/item/create',
        method: 'POST',
        body: { collectionId, item }
      });
    } catch (err) {
      setError(err);
    }
  };

  const updateItemHandler = async item => {
    try {
      return await fetchData({
        url: '/api/collection/item/update',
        method: 'PUT',
        body: item
      });
    } catch (err) {
      setError(err);
    }
  };

  const deleteItemCollectionHandler = async itemId => {
    try {
      return await fetchData({
        url: '/api/collection/item/delete',
        method: 'DELETE',
        body: itemId
      });
    } catch (err) {
      setError(err);
    }
  };

  return <Table
    mode="item"
    url={userId + '/' + collectionId}
    features={itemTableTemplate}
    modalFields={itemModalTemplate}
    data={items}
    hasChangeRight={session?.user.id === userId}
    onCreateRow={createItemHandler}
    onEditRow={updateItemHandler}
    onDeleteRow={deleteItemCollectionHandler}
  />
}

export default CollectionPage;