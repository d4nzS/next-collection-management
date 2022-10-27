import { Types } from 'mongoose';

import ApiError from '../../../exceptions/api-error';
import UserModel from '../../../models/db/user-model';

async function createCollectionHandler(req, res) {
  if (req.method !== 'POST') {
    throw ApiError.BadRequest('post');
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
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default createCollectionHandler;