import db from "../../../../../utils/db";
import Order from "../../../../../models/order";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const session = await getSession({ req });
      if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      await db.connect();
      const order = await Order.findById(req.query.id);
      if (!order) {
        const error = new Error("Order not found!");
        error.statusCode = 404;
        throw error;
      }

      await Order.findByIdAndUpdate(req.query.id, {
        isDelivered: true,
        deliveredAt: Date.now(),
      });

      res.status(200).json({ message: "Order delivered successfully!" });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Something went wrong!" });
    }
  }
};

export default handler;
