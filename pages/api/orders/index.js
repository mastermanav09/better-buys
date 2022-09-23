import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/order";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      const { user } = session;
      await db.connect();

      const newOrder = new Order({
        ...req.body,
        user: user._id,
      });

      const order = await newOrder.save();

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

export default handler;
