import { Types } from 'mongoose';

import UserModel from '../../../models/db/user-model';

async function createCollectionHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Expected post request method!' });
  }

  try {
    const { userId, collection } = req.body;
    const collectionId = Types.ObjectId();

    await UserModel.updateOne({ _id: Types.ObjectId(userId) }, {
      $push: {
        collections: { _id: collectionId, ...collection }
      }
    });

    res.status(201).json(collectionId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default createCollectionHandler;