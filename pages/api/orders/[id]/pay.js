import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Order from "../../../../models/order";
import PaytmChecksum from "paytmchecksum";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Sign in required!" });
  }

  try {
    await db.connect();
    const order = await Order.findById(req.body.ORDERID);
    if (order) {
      if (order.isPaid) {
        return res.status(400).json({ message: "Order is already paid." });
      }

      var paytmChecksum = "";
      var paytmParams = {};

      const received_data = req.body;
      for (var key in received_data) {
        if (key === "CHECKSUMHASH") {
          paytmChecksum = received_data[key];
        } else {
          paytmParams[key] = received_data[key];
        }
      }

      var isValidCheckSum = PaytmChecksum.verifySignature(
        paytmParams,
        process.env.PAYTM_MKEY,
        paytmChecksum
      );

      if (!isValidCheckSum) {
        console.log("Checksum Mismatched");
        res.status(500).send("Some Error Occurred.");
        return;
      }

      if (
        req.body.RESPCODE === "227" ||
        req.body.RESPCODE === "501" ||
        req.body.STATUS === "TXN_FAILURE"
      ) {
        const error = new Error();
        error.message = "Payment declined!";
        throw error;
      }

      if (req.body.STATUS === "TXN_SUCCESS") {
        await Order.findByIdAndUpdate(order._id, {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: JSON.stringify(req.body),
        });
      }

      await db.disconnect();
      res.redirect(`/orders/${req.body.ORDERID}`, 200);
    } else {
      await db.disconnect();
      const error = new Error();
      error.message = "Order not found!";
      throw error;
    }
  } catch (error) {
    res.redirect(`/orders/${req.body.ORDERID}`, 500);
  }
};

export default handler;
