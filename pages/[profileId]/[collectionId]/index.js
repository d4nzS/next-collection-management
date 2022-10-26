import { Types } from 'mongoose';
import { useSession } from 'next-auth/react';

import connectMongo from '../../../utils/connectMongo';
import UserModel from '../../../models/db/user-model';
import InputModel from '../../../models/client/input-model';
import Table from '../../../components/UI/Table';
import fetchData from '../../../utils/fetch-data';

const itemModalTemplate = [
  new InputModel({ name: 'name', label: 'Name' }),
  new InputModel({ name: 'tags', label: 'Tags' })
];

const itemTableTemplate = [
  new InputModel({ name: '_id', label: 'id', enableEditing: false }),
  ...itemModalTemplate
];

function CollectionPage({ userId, collectionId, items }) {
  const { data: session } = useSession();

  if (session === undefined) {
    return;
  }

  const createItemHandler = async item => {
    return await fetchData({
      url: '/api/collection/item/create',
      method: 'POST',
      body: { collectionId, item }
    });
  };

  const updateItemHandler = async item => {
    return await fetchData({
      url: '/api/collection/item/update',
      method: 'PUT',
      body: item
    });
  };

  const deleteItemCollectionHandler = async itemId => {
    return await fetchData({
      url: '/api/collection/item/delete',
      method: 'DELETE',
      body: itemId
    });
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

export async function getServerSideProps(context) {
  await connectMongo();

  const userId = context.params.profileId;
  const collectionId = context.params.collectionId;

  const selectedProfile = await UserModel.findOne({ _id: Types.ObjectId(userId) });
  const selectedCollection = selectedProfile.collections.find(collection => collection._id.toString() === collectionId);

  return {
    props: {
      userId,
      collectionId,
      items: JSON.parse(JSON.stringify(selectedCollection.items))
    }
  };
}

export default CollectionPage;