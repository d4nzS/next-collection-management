import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare, hash } from 'bcrypt';

import connectMongo from '../../../utils/connectMongo';
import UserModel from '../../../models/db/user-model';
import ApiError from '../../../exceptions/api-error';
import { signOut } from 'next-auth/react';

connectMongo();

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
              throw ApiError.Unauthorized('This email is already in use!');
            }

            const hashPassword = await hash(password, 3);

            await UserModel.create({ email, password: hashPassword, isBlocked: false, isAdmin: false });

            break;

          case 'login':
            if (!user) {
              throw ApiError.Unauthorized("This email doesn't exist!");
            }

            const isPassEquals = await compare(password, user.password);

            if (!isPassEquals) {
              throw ApiError.Unauthorized('Incorrect password!');
            }

            if (user.isBlocked) {
              throw ApiError.Forbidden();
            }

            break;

          default:
            throw new Error('Unexpected error!');
        }
        return { email };
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      const user = await UserModel.findOne({ email: session.user.email });

      session.user.id = user._id;
      session.user.isAdmin = user.isAdmin;
      session.user.isBlocked = user.isBlocked;

      return session;
    }
  }
};

export default NextAuth(authOptions);