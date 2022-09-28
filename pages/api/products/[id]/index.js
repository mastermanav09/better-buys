import db from "../../../../utils/db";
import Product from "../../../../models/product";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Sign in required!" });
    }

    try {
      await db.connect();
      const product = await Product.findById(req.query.id).select(
        "countInStock"
      );

      if (!product) {
        const error = new Error("Product not found!");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json(product);
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ message: "Something went wrong!" });
    }
  }
};

export default handler;
