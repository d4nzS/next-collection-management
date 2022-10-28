import { Types } from 'mongoose';

import ApiError from '../../../../exceptions/api-error';
import UserModel from '../../../../models/db/user-model';

async function getAllCollectionsHandler(req, res) {
  if (req.method !== 'GET') {
    throw ApiError.BadRequest('get');
  }

  try {
    const userId = req.query.userId;

    if (!Types.ObjectId.isValid(userId)) {
      throw ApiError.NotFound("This profile doesn't exist");
    }

    const user = await UserModel.findById({ _id: userId });

    if (!user) {
      throw ApiError.NotFound("This profile doesn't exist");
    }

    const collections = user.collections.map(collection => ({
      _id: collection._id,
      name: collection.name,
      topic: collection.topic,
      description: collection.description
    }));

    res.status(201).json(collections);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default getAllCollectionsHandler;