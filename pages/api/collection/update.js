import { Types } from 'mongoose';

import UserModel from '../../../models/db/user-model';

async function updateCollectionHandler(req, res) {
  if (req.method !== 'PUT') {
    res.status(400).json({ message: 'Expected put request method!' });
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
    res.status(500).json({ message: err.message });
  }
}

export default updateCollectionHandler;