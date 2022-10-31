import ApiError from '../../../exceptions/api-error';
import UserModel from '../../../models/db/user-model';
import { Types } from 'mongoose';

const handlePut = async (req, res) => {
  const updatedUser = req.body;
  console.log(updatedUser);

  const user = await UserModel.findOneAndUpdate({ _id: Types.ObjectId(req.query.userId) }, updatedUser, { new: true });
  //
  console.log(user);

  res.status(201).json({ message: 'The user has been changed!' });
}

const handleDelete = async (req, res) => {

  await UserModel.deleteOne({ _id: Types.ObjectId(req.query.userId) });

  res.status(201).json({ message: 'The user has been deleted!' });

  // console.log(user);
}

const mapMethodToHandler = {
  'PUT': handlePut,
  'DELETE': handleDelete,
}

export default async (req, res) => {
  const requestHandler = mapMethodToHandler[req.method];
  await requestHandler(req, res);
}