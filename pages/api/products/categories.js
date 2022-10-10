import db from "../../../utils/db";
import Product from "../../../models/product";

const handler = async (req, res) => {
  try {
    await db.connect();
    const categories = await Product.find().distinct("category");
    const brands = await Product.find().distinct("brand");
    res.status(200).json({ categories, brands });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export default handler;
