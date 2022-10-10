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

      if (
        req.body.paymentMethod !== "Paytm" &&
        req.body.paymentMethod !== "Cash On Delivery"
      ) {
        const error = new Error("Invalid payment method!");
        error.statusCode = 400;
        throw error;
      }

      const { user } = session;
      await db.connect();

      const newOrder = new Order({
        ...req.body,
        user: user._id,
        isPaid: req.body.paymentMethod === "Cash On Delivery" ? true : false,
        paidAt:
          req.body.paymentMethod === "Cash On Delivery"
            ? Date.now()
            : undefined,
      });

      const order = await newOrder.save();

      res.status(201).json(order);
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Something went wrong!" });
    }
  }
};

export default handler;
