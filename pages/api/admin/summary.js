import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/order";
import User from "../../../models/user";
import Product from "../../../models/product";

const handler = async (req, res) => {
  try {
    const session = await getSession({ req });

    if (!session || (session && !session.user.isAdmin)) {
      return res.status(401).json({ message: "Sign in required!" });
    }

    await db.connect();
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const ordersPriceGroup = await Order.aggregate([
      {
        $group: {
          _id: null,
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res
      .status(200)
      .json({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
  } catch (error) {
    res.status(500).json({ message: "Some error occurred." });
  }
};

export default handler;
