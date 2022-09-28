import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Product from "../../../../models/product";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).json({ message: "Sign in required!" });
  }

  const { user } = session;

  if (req.method === "GET") {
    return await getHandler(req, res);
  } else if (req.method === "POST") {
    return await postHandler(req, res, user);
  } else {
    return res.status(400).json({ message: "Method not allowed." });
  }
};

const getHandler = async (req, res) => {
  try {
    await db.connect();
    const products = await Product.find({});

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Couldn't fetch products!" });
  }
};

const postHandler = async (req, res, user) => {
  try {
    await db.connect();
    const newProduct = new Product({
      name: "sample name",
      slug: "sample-name-" + Math.floor(Math.random() * 1e11),
      image: "/",
      price: 0,
      brand: "sample-brand",
      category: "sample category",
      countInStock: 0,
      description: "sample description",
      numReviews: 0,
      reviews: [],
      rating: 0,
      numRatings: {
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      },
    });

    const product = await newProduct.save();
    res.status(201).json({ product, message: "Product created successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't create product!" });
  }
};

export default handler;
