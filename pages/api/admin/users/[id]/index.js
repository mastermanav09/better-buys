import { getSession } from "next-auth/react";
import db from "../../../../../utils/db";
import User from "../../../../../models/user";

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
  const user = await User.findById(req.query.id).select(
    "-credentials.password -shippingAddress -paymentMethod"
  );
  res.status(200).json(user);
};

const putHandler = async (req, res) => {
  try {
    await db.connect();

    const name = req.body.name;
    const isAdmin = req.body.isAdmin;

    if (name.length < 3) {
      const error = new Error("Invalid Details!");
      error.statusCode = 400;
      throw error;
    }

    await User.findByIdAndUpdate(req.query.id, {
      "credentials.name": name,
      "credentials.isAdmin": isAdmin,
    });

    res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong!" });
  }
};

const deleteHandler = async (req, res, user) => {
  try {
    await db.connect();
    await User.findByIdAndDelete(req.query.id);

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export default handler;
