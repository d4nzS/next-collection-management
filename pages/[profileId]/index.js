import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useSession } from 'next-auth/react';

import InputModel from '../../models/client/input-model';
import fetchData from '../../utils/fetch-data';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Table from '../../components/UI/Table'

const collectionTableTemplate = [
  new InputModel({ name: 'name', label: 'Name' }),
  new InputModel(
    { name: 'topic', label: 'Topic', type: 'select', options: ['Books', 'Signs', 'Silverware'] }
  ),
  new InputModel({ name: 'description', label: 'Description (markdown)', type: 'textarea', isMarkdown: true }),
];

const collectionModalTemplate = [
  ...collectionTableTemplate,
  new InputModel({ name: 'image', label: 'Image', type: 'file', required: false }),
  new InputModel({ name: 'number', label: 'Type number fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'string', label: 'Type string fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'textarea', label: 'Type text fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'radio', label: 'Type yes/no fields and press enter...', type: 'tags', required: false }),
  new InputModel({ name: 'date', label: 'Type text fields and press enter...', type: 'tags', required: false })
];

function ProfilePage() {
  const router = useRouter();
  const userId = router.query.profileId;

  const { data: session } = useSession();
  const hasChangeRight = session?.user.id === userId || session?.user.isAdmin;

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
    return <LoadingSpinner/>;
  }

  const createCollectionHandler = async collection => {
    const formData = new FormData();

    Object.entries(collection).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        formData.append(key, JSON.stringify(val));

        return;
      }

      formData.append(key, val);
    });
    formData.append('userId', userId);

    try {
      return await fetchData({
        url: '/api/collection/create',
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }, true);
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
    hasChangeRight={hasChangeRight}
    onCreateRow={createCollectionHandler}
    onEditRow={updateCollectionHandler}
    onDeleteRow={deleteCollectionHandler}
  />;
}

export default ProfilePage;