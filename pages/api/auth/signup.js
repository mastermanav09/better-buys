import db from "../../../utils/db";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation error",
    });

    return;
  }

  try {
    await db.connect();

    const existingUser = await User.findOne({ "credentials.email": email });
    if (existingUser) {
      const error = new Error();
      error.statusCode = 422;
      throw error;
    }

    const newUser = new User({
      credentials: {
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
        isAdmin: false,
      },

      shippingAddress: {
        fullName: null,
        address: null,
        city: null,
        state: null,
        postalCode: null,
      },

      paymentMethod: null,
    });

    const user = await newUser.save();
    res.status(201).json({
      message: "Created new user!",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    if (error?.statusCode === 422) {
      error.message = "User already exists!";
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
