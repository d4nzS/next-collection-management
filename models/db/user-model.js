import { Schema, models, model } from 'mongoose';

const ItemSchema = new Schema({
  name: { type: String, required: true },
  tags: [{ type: String, required: true }]
});

const CollectionSchema = new Schema({
  name: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  items: [{ type: ItemSchema, default: [] }]
});

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  collections: { type: [CollectionSchema], default: [] }
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;