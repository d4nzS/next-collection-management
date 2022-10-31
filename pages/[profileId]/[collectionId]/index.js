import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useSession } from 'next-auth/react';

import InputModel from '../../../models/client/input-model';
import fetchData from '../../../utils/fetch-data';
import CollectionImage from '../../../components/Collection/CollectionImage';
import Table from '../../../components/UI/Table';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';

const initialItemModalTemplate = [
  new InputModel({ name: 'name', label: 'Name' }),
  new InputModel({ name: 'tags', label: 'Tags' })
];

function CollectionPage() {
  const router = useRouter();
  const userId = router.query.profileId;
  const collectionId = router.query.collectionId;

  const { data: session } = useSession();
  const hasChangeRight = session?.user.id === userId || session?.user.isAdmin;

  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);
  const [collectionImageSrc, setCollectionImageSrc] = useState(null);
  const [itemModalTemplate, setItemTableTemplate] = useState(null);

  useEffect(() => {
    const getItems = async () => await fetchData({
      url: `/api/collection/item/getAll/${userId}/${collectionId}`
    });

    setError(null);
    setItems(null);
    setCollectionImageSrc(null);
    setItemTableTemplate(null);

    if (userId && collectionId) {
      getItems()
        .then(data => {
            const customFields = Object.entries(data.customFields).reduce((fields, [type, fieldNames]) =>
              fields.concat(fieldNames.map(fieldName => new InputModel({
                name: `${fieldName}(${type})`,
                label: `${fieldName} (${type})`,
                type
              }))), []);

            setItems(data.items);
            setCollectionImageSrc(data.image);
            setItemTableTemplate(initialItemModalTemplate.concat(customFields));
          }
        )
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
    return <LoadingSpinner/>;
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

  return (
    <>
      {collectionImageSrc && <CollectionImage src={collectionImageSrc}/>}
      <Table
        mode="item"
        url={`${userId}/${collectionId}`}
        features={[new InputModel({ name: '_id', label: 'id', enableEditing: false }), ...itemModalTemplate]}
        modalFields={itemModalTemplate}
        data={items}
        hasChangeRight={hasChangeRight}
        onCreateRow={createItemHandler}
        onEditRow={updateItemHandler}
        onDeleteRow={deleteItemCollectionHandler}
      />
    </>
  );
}

export default CollectionPage;