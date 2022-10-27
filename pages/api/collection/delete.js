import { Types } from 'mongoose';

import ApiError from '../../../exceptions/api-error';
import UserModel from '../../../models/db/user-model';

async function deleteCollectionHandler(req, res) {
  if (req.method !== 'DELETE') {
    throw ApiError.BadRequest('delete');
  }

  try {
    const collectionId = Types.ObjectId(req.body);

    await UserModel.updateOne({ 'collections._id': collectionId }, {
      $pull: {
        collections: { _id: collectionId } }
    });

    res.status(201).json({ message: 'The collection has been deleted!' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default deleteCollectionHandler;