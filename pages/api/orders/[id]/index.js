import { getSession } from "next-auth/react";
import Order from "../../../../models/order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      const error = new Error();
      error.statusCode = 401;
      throw error;
    }

    await db.connect();
    const order = await Order.findById(req.query.id);

    res.json(order);
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
};

export default handler;
