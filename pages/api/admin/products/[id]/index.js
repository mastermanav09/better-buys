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
    return await getHandler(req, res, user);
  } else if (req.method === "PUT") {
    return await putHandler(req, res, user);
  } else if (req.method === "DELETE") {
    return await deleteHandler(req, res, user);
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

    let category = req.body.category;
    let brand = req.body.brand;
    const name = req.body.name;
    const slug = req.body.slug;
    const price = +req.body.price;
    const image = req.body.image;
    const countInStock = req.body.countInStock;
    const description = req.body.description;

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

    category = category + (category[category.length - 1] !== "s" ? "s" : "");
    category = category.charAt(0).toUpperCase() + category.slice(1);
    brand = brand.charAt(0).toUpperCase() + brand.slice(1);

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

    res.status(204).json({ message: "Product updated successfully!" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong!" });
  }
};

const deleteHandler = async (req, res, user) => {
  try {
    await db.connect();
    await Product.findByIdAndDelete(req.query.id);

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export default handler;
