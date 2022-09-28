import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import User from "../../../../models/user";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const session = await getSession({ req });
      if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      await db.connect();
      const users = await User.find().select(
        "-credentials.password -shippingAddress -paymentMethod"
      );
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

export default handler;
