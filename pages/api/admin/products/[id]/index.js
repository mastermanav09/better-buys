import { getSession } from "next-auth/react";
import db from "../../../../../utils/db";
import Product from "../../../../../models/product";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).json({ message: "Sign in required!" });
  }

  const { user } = session;

  if (req.method === "GET") {
    return getHandler(req, res, user);
  } else if (req.method === "PUT") {
    return putHandler(req, res, user);
  } else {
    return res.status(401).json({ message: "Method not allowed!" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  res.status(200).json(product);
};

const putHandler = async (req, res) => {
  try {
    await db.connect();

    const name = req.body.name;
    const slug = req.body.slug;
    const price = +req.body.price;
    const category = req.body.category;
    const image = req.body.image;
    const brand = req.body.brand;
    const countInStock = req.body.countInStock;
    const description = req.body.description;

    console.log(price, typeof price);
    if (
      isNaN(price) ||
      countInStock < 0 ||
      name.length < 3 ||
      description.length < 10
    ) {
      const error = new Error("Invalid Details!");
      error.statusCode = 400;
      throw error;
    }

    await Product.findByIdAndUpdate(req.query.id, {
      name: name,
      slug: slug,
      price: price,
      category: category,
      image: image,
      brand: brand,
      countInStock: countInStock,
      description: description,
    });

    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong!" });
  }
};

export default handler;
