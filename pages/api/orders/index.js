import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/order";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const session = await getSession({ req });

      if (!session) {
        const error = new Error();
        error.statusCode = 401;
        throw error;
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
      if (error?.statusCode === 401) {
        error.message = "Sign in required";
      } else {
        error.message = "Something went wrong.";
      }

      if (!error.statusCode) {
        error.statusCode = 500;
      }

      res.status(error.statusCode).json(error);
    }
  }
};

export default handler;
