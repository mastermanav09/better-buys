import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Product from "../../../../models/product";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const session = await getSession({ req });
      if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      await db.connect();
      const products = await Product.find({});

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Couldn't fetch products!" });
    }
  }
};

export default handler;
