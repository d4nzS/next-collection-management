import { Types } from 'mongoose';
import { useSession } from 'next-auth/react';

import connectMongo from '../../utils/connectMongo';
import UserModel from '../../models/db/user-model';
import InputModel from '../../models/client/input-model';
import Table from '../../components/UI/Table'
import fetchData from '../../utils/fetch-data';

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

function ProfilePage({ userId, collections }) {
  const { data: session } = useSession();

  if (session === undefined) {
    return;
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

export async function getServerSideProps(context) {
  await connectMongo();

  const profileId = context.params.profileId;
  const selectedProfile = await UserModel.findOne({ _id: Types.ObjectId(profileId) });
  const collections = selectedProfile.collections.map(collection => ({
    _id: collection._id,
    name: collection.name,
    topic: collection.topic,
    description: collection.description
  }));

  return {
    props: {
      userId: profileId,
      collections: JSON.parse(JSON.stringify(collections))
    }
  };
}

export default ProfilePage;