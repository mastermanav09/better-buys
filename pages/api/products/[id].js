import db from "../../../utils/db";
import Product from "../../../models/product";

const handler = async (req, res) => {
  if (req.method === "GET") {
    await db.connect();
    const product = await Product.findById(req.query.id);

    res.json(product);
  }
};

export default handler;
