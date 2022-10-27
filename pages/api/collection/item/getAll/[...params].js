import { Types } from 'mongoose';

import ApiError from '../../../../../exceptions/api-error';
import UserModel from '../../../../../models/db/user-model';

async function getAllItemsHandler(req, res) {
  if (req.method !== 'GET') {
    throw ApiError.BadRequest('get');
  }

  try {
    const { params } = req.query;
    const userId = params[0];
    const collectionId = params[1];

    console.log(userId, collectionId)

    if (!Types.ObjectId.isValid(userId)) {
      throw ApiError.NotFound("This profile doesn't exist");
    }

    const user = await UserModel.findById({ _id: userId });
    const collection = user.collections.find(collection => collection._id.toString() === collectionId);

    if (!collection) {
      throw ApiError.NotFound("This collection doesn't exist");
    }

    res.status(201).json(collection.items);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default getAllItemsHandler;