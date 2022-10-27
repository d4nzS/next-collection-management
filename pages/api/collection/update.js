import { Types } from 'mongoose';

import ApiError from '../../../exceptions/api-error';
import UserModel from '../../../models/db/user-model';

async function updateCollectionHandler(req, res) {
  if (req.method !== 'PUT') {
    throw ApiError.BadRequest('put');
  }

  try {
    const collection = req.body;

    await UserModel.updateOne({
      'collections._id': Types.ObjectId(collection._id)
    }, {
      $set: {
        'collections.$.name': collection.name,
        'collections.$.topic': collection.topic,
        'collections.$.description': collection.description
      }
    });

    res.status(201).json({ message: 'The collection has been changed!' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default updateCollectionHandler;