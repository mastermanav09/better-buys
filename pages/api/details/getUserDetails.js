import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import User from "../../../models/user";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      const { user } = session;
      await db.connect();

      const user_fetched = await User.findById(user._id).select(
        "-credentials.password -credentials.isAdmin -createdAt -updatedAt"
      );

      if (!user_fetched) {
        const error = new Error();
        error.statusCode = 404;
        error.message = "User not found!";
        throw error;
      }

      res.status(200).json(user_fetched);
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      res.status(error.statusCode).json({ message: error.message });
    }
  }
}
