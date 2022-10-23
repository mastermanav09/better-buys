import { getSession } from "next-auth/react";
import Order from "../../../../models/order";
import db from "../../../../utils/db";

const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");

const handler = async (req, res) => {
  if (req.method === "GET") {
    const orderId = req.query.id;

    try {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      const { user } = session;
      await db.connect();
      const order = await Order.findById(orderId);

      if (!order) {
        const error = new Error("No Order Found");
        error.statusCode = 404;
        throw error;
      }

      if (!order.isPaid) {
        const error = new Error("Invalid request");
        error.statusCode = 400;
        throw error;
      }

      if (order.user.toString() !== user._id.toString()) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
      }

      let dir = `./data/invoices/${user._id}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join(
        "data",
        "invoices",
        `${user._id}`,
        invoiceName
      );
      const pdfDoc = new pdfDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${invoiceName}"`
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res); // res object is a writable stream

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });

      let totalPrice = 0;

      order.orderItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
        pdfDoc
          .fontSize(12)
          .text(
            item.name +
              "                                        " +
              item.quantity +
              "                                        " +
              "Rs. " +
              item.price +
              "\n"
          );
      });

      pdfDoc.text(
        "---------------------------------------------------------------------------------------------------------------------\n"
      );
      pdfDoc.fontSize(13).text("Total Price : Rs " + totalPrice);
      pdfDoc.end();
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  }
};

export default handler;
