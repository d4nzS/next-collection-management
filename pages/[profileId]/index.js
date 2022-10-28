import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress } from '@mui/material';

import InputModel from '../../models/client/input-model';
import fetchData from '../../utils/fetch-data';
import Table from '../../components/UI/Table'

const collectionTableTemplate = [
  new InputModel({ name: 'name', label: 'Name' }),
  new InputModel(
    { name: 'topic', label: 'Topic', type: 'select', options: ['Books', 'Signs', 'Silverware'] }
  ),
  new InputModel({ name: 'description', label: 'Description (markdown)', type: 'textarea', isMarkdown: true })
];

const collectionModalTemplate = [
  ...collectionTableTemplate,
  new InputModel({ name: 'number', label: 'Type number fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'string', label: 'Type string fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'textarea', label: 'Type text fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'radio', label: 'Type yes/no fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'date', label: 'Type text fields and press enter...', type: 'tags', required: false })

];

function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = router.query.profileId;

  const [error, setError] = useState(null);
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    const getCollections = async () => await fetchData({ url: `/api/collection/getAll/${userId}` });

    setError(null);
    setCollections(null);

    if (userId) {
      getCollections()
        .then(data => setCollections(data))
        .catch(err => setError(err));
    }
  }, [userId]);

  if (session === undefined) {
    return;
  }

  if (error) {
    return <Error statusCode={error.status} title={error.message}/>;
  }

  if (!collections) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <CircularProgress/>
      </Box>
    );
  }

  const createCollectionHandler = async collection => {
    try {
      return await fetchData({
        url: '/api/collection/create',
        method: 'POST',
        body: { userId, collection }
      });
    } catch (err) {
      setError(err);
    }
  };

  const updateCollectionHandler = async collection => {
    try {
      return await fetchData({
        url: '/api/collection/update',
        method: 'PUT',
        body: collection
      });
    } catch (err) {
      setError(err);
    }
  };

  const deleteCollectionHandler = async collectionId => {
    try {
      return await fetchData({
        url: '/api/collection/delete',
        method: 'DELETE',
        body: collectionId
      });
    } catch (err) {
      setError(err);
    }
  };

  return <Table
    mode="collection"
    url={userId}
    features={collectionTableTemplate}
    modalFields={collectionModalTemplate}
    data={collections}
    hasChangeRight={session?.user.id === userId}
    onCreateRow={createCollectionHandler}
    onEditRow={updateCollectionHandler}
    onDeleteRow={deleteCollectionHandler}
  />;
}

export default ProfilePage;