import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/order";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Sign in required!" });
    }

    try {
      const { user } = session;
      await db.connect();

      const orders = await Order.find({ user: user._id });

      res.status(200).json({ orders: orders });
    } catch (error) {
      res.status(500).json({ message: "Couldn't get the orders." });
    }
  }
};

export default handler;
