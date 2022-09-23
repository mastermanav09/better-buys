import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import User from "../../../models/product";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      const { user } = session;
      const { name, email, password } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !email.includes("@") ||
        name.length < 3 ||
        password.trim().length < 6
      ) {
        res.status(422).json({ message: "Validation error" });
        return;
      }

      await db.connect();
      await User.findByIdAndUpdate(user._id, {
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
      });

      res.status(200).json({ message: "User updated." });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

export default handler;
