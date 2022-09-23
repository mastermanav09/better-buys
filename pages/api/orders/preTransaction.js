const PaytmChecksum = require("paytmchecksum");
const https = require("https");
import { getSession } from "next-auth/react";
import Order from "../../../models/order";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: "Sign in required!" });
      }

      const { orderId, orderItems, userId, totalPrice, paymentMethod } =
        req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({ message: "Order not found!" });
      }

      if (
        !userId ||
        !orderId ||
        !orderItems ||
        !totalPrice ||
        isNaN(totalPrice) ||
        totalPrice !== order.totalPrice ||
        userId !== order.user.toString()
      ) {
        return res.status(400).json({
          message: "Cannot process payment! Invalid/Insufficient Details ",
        });
      }

      if (order.paymentMethod !== paymentMethod) {
        return res.status(400).json({
          message: "Invalid payment method!",
        });
      }

      var paytmParams = {};

      paytmParams.body = {
        requestType: "Payment",
        mid: process.env.NEXT_PUBLIC_PAYTM_MID,
        orderId: orderId,
        callbackUrl: `/api/orders/${orderId}/pay`,
        txnAmount: {
          value: `${totalPrice}`,
          currency: "INR",
        },
        userInfo: {
          custId: `${userId}`,
          orderItems: orderItems,
        },
      };

      const checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        process.env.PAYTM_MKEY
      );

      paytmParams.head = {
        signature: checksum,
      };

      var post_data = JSON.stringify(paytmParams);

      const requestAsync = async () => {
        return new Promise((resolve, reject) => {
          var options = {
            hostname: "securegw-stage.paytm.in",

            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${orderId}`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };

          var response = "";
          var post_req = https.request(options, function (post_res) {
            post_res.on("data", function (chunk) {
              response += chunk;
            });

            post_res.on("end", function () {
              let ress = JSON.parse(response).body;
              ress.success = true;
              resolve(ress);
            });
          });

          post_req.write(post_data);
          post_req.end();
        });
      };

      const data = await requestAsync();
      res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Couldn't process payment. Please try again!" });
    }
  }
};

export default handler;
