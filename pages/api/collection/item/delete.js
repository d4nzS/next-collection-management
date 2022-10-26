import { Types } from 'mongoose';

import UserModel from '../../../../models/db/user-model';

async function deleteItemHandler(req, res) {
  if (req.method !== 'DELETE') {
    res.status(400).json({ message: 'Expected delete request method!' });
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
    res.status(500).json({ message: err.message });
  }
}

export default deleteItemHandler;