import User from "../../models/user";
import data from "../../utils/data";
import db from "../../utils/db";
import Product from "../../models/product";

const handler = async (req, res) => {
  await db.connect();

  await User.deleteMany();
  const users = JSON.parse(data).users;
  await User.insertMany(users);

  await Product.deleteMany();
  const products = JSON.parse(data).products;
  await Product.insertMany(products);

  res.send({ message: "seeded successfully!" });
};

export default handler;
