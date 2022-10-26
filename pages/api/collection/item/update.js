import { Types } from 'mongoose';

import UserModel from '../../../../models/db/user-model';

async function updateItemHandler(req, res) {
  if (req.method !== 'PUT') {
    res.status(400).json({ message: 'Expected put request method!' });
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
    res.status(500).json({ message: err.message });
  }
}

export default updateItemHandler;