import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import User from "../../../models/user";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await getSession({ req });

      if (!session) {
        const error = new Error();
        error.statusCode = 401;
        throw error;
      }

      const userPaymentMethod = req.body.method;

      if (!userPaymentMethod) {
        const error = new Error();
        error.statusCode = 400;
        error.message = "Payment details needed!";
        throw error;
      }

      const { user } = session;
      await db.connect();

      await User.findByIdAndUpdate(user._id, {
        $set: {
          paymentMethod: userPaymentMethod,
        },
      });

      res.status(200).json({ paymentMethod: userPaymentMethod });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      res.status(error.statusCode).json({ message: error.message });
    }
  }
}
