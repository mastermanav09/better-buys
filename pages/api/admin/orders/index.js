import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Order from "../../../../models/order";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const session = await getSession({ req });
      if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      await db.connect();
      const orders = await Order.find().populate("user", "name");

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Couldn't fetch orders!" });
    }
  }
};

export default handler;
