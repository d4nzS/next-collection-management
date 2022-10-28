import { Schema, models, model } from 'mongoose';

const CollectionSchema = new Schema({
  name: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  number: [{ type: String, default: [] }],
  string: [{ type: String, default: [] }],
  textarea: [{ type: String, default: [] }],
  radio: [{ type: String, default: [] }],
  date: [{ type: String, default: [] }],
  items: { type: Array, default: [] }
});

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  collections: { type: [CollectionSchema], default: [] }
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;