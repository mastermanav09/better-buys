import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import User from "../../../models/user";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await getSession({ req });

      if (!session) {
        const error = new Error();
        error.statusCode = 401;
        throw error;
      }

      const fullName = req.body.fullName;
      const address = req.body.address;
      const city = req.body.city;
      const state = req.body.state;
      const postalCode = req.body.postalCode;

      if (!fullName || !address || !city || !state || !postalCode) {
        const error = new Error();
        error.statusCode = 400;
        error.message = "Please fill all details!";
        throw error;
      }

      if (
        isNaN(postalCode) ||
        postalCode.toString().length <= 4 ||
        fullName.length < 3 ||
        address.length < 5
      ) {
        const error = new Error();
        error.statusCode = 400;
        error.message = "Invalid details!";
        throw error;
      }

      const { user } = session;
      await db.connect();

      await User.findByIdAndUpdate(user._id, {
        $set: {
          shippingAddress: {
            fullName,
            address,
            city,
            state,
            postalCode,
          },
        },
      });

      res.status(200).json({ fullName, address, city, state, postalCode });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      res.status(error.statusCode).json({ message: error.message });
    }
  }
}
