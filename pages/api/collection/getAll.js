import { Types } from 'mongoose';

import UserModel from '../../../models/db/user-model';

async function getAllCollectionsHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Expected post request method!' });
  }

  try {
    const userId = req.body;

    const user = await UserModel.findOne({ _id: Types.ObjectId(userId) });

    res.status(201).json(user.collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default getAllCollectionsHandler;