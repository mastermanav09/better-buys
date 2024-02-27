import { getSession } from "next-auth/react";
import Order from "../../../../models/order";
import db from "../../../../utils/db";
import FormData from "form-data";
import axios from "axios";

const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");

const cloudinary = require("cloudinary").v2;

export const config = {
  api: {
    bodyParser: false,
  },
};

const cloudinaryConfig = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
};

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
        return res.status(200).json({ invoiceUrl: order.invoiceUrl });
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
      const uploadPath = `/invoices/${user._id}`;

      const invoicePath = path.join(
        "data",
        "invoices",
        `${user._id}`,
        invoiceName
      );

      const pdfDoc = new pdfDocument();

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // pdfDoc.pipe(res); // res object is a writable stream

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

      cloudinary.config(cloudinaryConfig);
      let uploadedFileUrl = null;

      try {
        await cloudinary.api.create_folder(uploadPath);
        const formData = new FormData();
        formData.append("file", fs.createReadStream(invoicePath));
        formData.append(
          "public_id",
          invoiceName
            .trim()
            .replaceAll(" ", "_")
            .replace(/\.[^.\/]+$/, "")
        );
        formData.append("resource_type", "raw");
        formData.append("folder", uploadPath);
        formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
        const { data } = await axios.post(
          process.env.UPLOAD_CLOUDINARY_URL,
          formData
        );

        if (!data || !data.secure_url) {
          const error = new Error("Cannot get Invoice!");
          error.statusCode = 500;
          throw error;
        }

        uploadedFileUrl = data.secure_url;
      } catch (error) {
        error = JSON.parse(JSON.stringify(error));
        return res.status(error.status).json({
          message:
            "Something went wrong while uploading the file. Please try again",
        });
      }

      fs.unlinkSync(invoicePath);
      await Order.updateOne({ _id: orderId }, { invoiceUrl: uploadedFileUrl });
      return res.status(200).json({ invoiceUrl: uploadedFileUrl });
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  }
};

export default handler;
