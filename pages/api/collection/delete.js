import { Types } from 'mongoose';

import UserModel from '../../../models/db/user-model';

async function deleteCollectionHandler(req, res) {
  if (req.method !== 'DELETE') {
    res.status(400).json({ message: 'Expected delete request method!' });
  }

  try {
    const collectionId = Types.ObjectId(req.body);

    await UserModel.updateOne({ 'collections._id': collectionId }, {
      $pull: {
        collections: { _id: collectionId } }
    });

    res.status(201).json({ message: 'The collection has been deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default deleteCollectionHandler;