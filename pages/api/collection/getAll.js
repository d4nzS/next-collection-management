import { Types } from 'mongoose';

import UserModel from '../../../models/db/user-model';

async function updateCollectionHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Expected get request method!' });
  }

  try {
    const userId = req.body;

    const user = await UserModel.findOne({ _id: Types.ObjectId(userId) });

    res.status(201).json(user.collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default updateCollectionHandler;

// import UserModel from '../../../models/db/user-model';
// import { Types } from 'mongoose';
//
// const profileId = context.params.profileId;
// const selectedProfile = await UserModel.findOne({ _id: Types.ObjectId(profileId) });
// const collections = selectedProfile.collections.map(collection => ({
//   _id: collection._id,
//   name: collection.name,
//   topic: collection.topic,
//   description: collection.description
// }));
//
// return {
//   props: {
//     userId: profileId,
//     collections: JSON.parse(JSON.stringify(collections))
//   }
// };