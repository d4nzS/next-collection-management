import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import { compare, hash } from 'bcrypt';

import UserModel from '../../../models/user-model';

mongoose
  .connect('mongodb+srv://root:root@cluster0.otui3ia.mongodb.net/?retryWrites=true&w=majority')
  .catch(err => console.log(err));

export const authOptions = {
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      async authorize(credentials, req) {
        const { email, password, mode } = credentials;

        const user = await UserModel.findOne({ email });

        switch (mode) {
          case 'registration':
            if (user) {
              throw new Error('This email is already in use!');
            }

            const hashPassword = await hash(password, 3);

            await UserModel.create({ email, password: hashPassword });

            break;

          case 'login':
            if (!user) {
              throw new Error("This email doesn't exist!");
            }

            const isPassEquals = await compare(password, user.password);

            if (!isPassEquals) {
              throw new Error('Incorrect password!');
            }

            break;

          default:
            throw new Error('Unexpected error!');
        }
        return { email };
      }
    })
  ],
};

export default NextAuth(authOptions);