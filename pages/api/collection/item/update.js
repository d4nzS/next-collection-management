import { Types } from 'mongoose';

import ApiError from '../../../../exceptions/api-error';
import UserModel from '../../../../models/db/user-model';

async function updateItemHandler(req, res) {
  if (req.method !== 'PUT') {
    throw ApiError.BadRequest('put');
  }

  try {
    const item = req.body;

    await UserModel.updateOne({
      'collections.items._id': Types.ObjectId(item._id)
    }, {
      $set: {
        'collections.$.items': item
      }
    });

    res.status(201).json({ message: 'The item has been changed!' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default updateItemHandler;