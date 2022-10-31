import UserModel from '../../../models/db/user-model';

export default async (req, res) => {
  const users = [...await UserModel.find()].map(({ _id, email, isBlocked, isAdmin, collections }) => ({
    _id,
    email,
    isBlocked,
    isAdmin,
    collections: collections.map(collection => ({
      _id: collection._id,
      name: collection.name,
      itemsAmount: collection.items.length
    }))
  }));

  res.status(201).json(users);
}