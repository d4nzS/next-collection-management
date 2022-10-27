import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  new InputModel({ name: 'customTextFields', label: 'Custom text fields', type: 'tags', required: false })
];

function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = router.query.profileId;

  const [collections, setCollections] = useState(null);

  useEffect(() => {
    const getCollections = async () => await fetchData({
      url: '/api/collection/getAll',
      method: 'POST',
      body: userId
    });

    if (userId) {
      getCollections().then(data => setCollections(data));
    }
  }, [userId])

  if (session === undefined) {
    return;
  }

  if (!collections) {
    return <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <CircularProgress/>
    </Box>;
  }

  const createCollectionHandler = async collection => {
    return await fetchData({
      url: '/api/collection/create',
      method: 'POST',
      body: { userId, collection }
    });
  };

  const updateCollectionHandler = async collection => {
    return await fetchData({
      url: '/api/collection/update',
      method: 'PUT',
      body: collection
    });
  };

  const deleteCollectionHandler = async collectionId => {
    return await fetchData({
      url: '/api/collection/delete',
      method: 'DELETE',
      body: collectionId
    });
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