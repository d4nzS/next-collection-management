import { Types } from 'mongoose';

import ApiError from '../../../../exceptions/api-error';
import UserModel from '../../../../models/db/user-model';

async function deleteItemHandler(req, res) {
  if (req.method !== 'DELETE') {
    throw ApiError.BadRequest('delete');
  }

  try {
    const itemId = Types.ObjectId(req.body);

    await UserModel.updateOne({
      'collections.items._id': itemId
    }, {
      $pull: {
        'collections.$.items': { _id: itemId }
      }
    });

    res.status(201).json({ message: 'The item has been deleted!' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default deleteItemHandler;