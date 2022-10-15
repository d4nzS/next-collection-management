import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
})

const UserModel = models.users || model('users', userSchema);

export default UserModel;