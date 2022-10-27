import { Types } from 'mongoose';

import ApiError from '../../../../exceptions/api-error';
import UserModel from '../../../../models/db/user-model';

async function createItemHandler(req, res) {
  if (req.method !== 'POST') {
    throw ApiError.BadRequest('post');
  }

  try {
    const { collectionId, item } = req.body;
    const itemId = Types.ObjectId();

    await UserModel.updateOne({
      'collections._id': Types.ObjectId(collectionId)
    }, {
      $push: {
        'collections.$.items': { _id: itemId, ...item }
      }
    });

    res.status(201).json(itemId);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default createItemHandler;