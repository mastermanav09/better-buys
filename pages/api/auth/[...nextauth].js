import NextAuth from "next-auth/next";
import User from "../../../models/user";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) {
        token._id = user._id;
      }

      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?._id) {
        session.user._id = token._id;
      }

      if (token?.isAdmin) {
        session.user.isAdmin = token.isAdmin;
      }

      return session;
    },
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();

        try {
          const user = await User.findOne({
            "credentials.email": credentials.email,
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          if (
            user &&
            bcrypt.compareSync(credentials.password, user.credentials.password)
          ) {
            return {
              _id: user._id,
              name: user.credentials.name,
              email: user.credentials.email,
              image: "null",
              isAdmin: user.credentials.isAdmin,
            };
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (error) {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
});
