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

      if (order.invoiceUrl) {
        res.setHeader("Content-Type", "application/pdf");
        const fileStream = fs.createReadStream(order.invoiceUrl);
        return fileStream.pipe(res);
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

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res); // res object is a writable stream

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });

      pdfDoc.text("\n");

      order.orderItems.forEach((item) => {
        pdfDoc
          .fontSize(12)
          .text(
            item.name +
              "                                                 " +
              item.quantity +
              "                                              " +
              "Rs. " +
              item.price +
              "\n"
          );
      });

      pdfDoc.text("\n");

      pdfDoc
        .fontSize(14)
        .text(
          "Items Price" +
            "                                                                                 " +
            "Rs. " +
            order.itemsPrice +
            "\n"
        );

      pdfDoc
        .fontSize(14)
        .text(
          "Shipping Price" +
            "                                                                            " +
            "Rs. " +
            order.shippingPrice +
            "\n"
        );

      pdfDoc
        .fontSize(14)
        .text(
          "Tax" +
            "                                                                                              " +
            "Rs. " +
            order.taxPrice +
            "\n"
        );

      pdfDoc.text(
        "----------------------------------------------------------------------------------------------------\n"
      );
      pdfDoc.text("\n");
      pdfDoc.fontSize(14).text(`Total Price : Rs ${order.totalPrice}`);
      pdfDoc.end();

      await Order.updateOne({ _id: orderId }, { invoiceUrl: invoicePath });

      res.setHeader("Content-Type", "application/pdf");
      const fileStream = fs.createReadStream(order.invoiceUrl);
      return fileStream.pipe(res);
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  }
};

export default handler;
