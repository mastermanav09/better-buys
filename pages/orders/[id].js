import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import PageLoader from "../../components/svg/PageLoader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadInvoice,
  fetchOrder,
  orderActions,
} from "../../utils/store/reducers/order";
import Link from "next/link";
import Image from "next/image";
import PaytmButton from "../../components/PaytmButton";
import { initiatePayment } from "../../utils/store/reducers/order";
import Script from "next/script";
import { getSession, useSession } from "next-auth/react";
import { setUserDetails } from "../../utils/store/reducers/user";
import { deliverOrder } from "../../utils/store/reducers/admin";
import LoadingSpinner from "../../components/svg/LoadingSpinner";

const Order = () => {
  const { query } = useRouter();
  const orderId = query.id;
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    loading,
    order,
    error,
    successPay,
    loadingPay,
    loadingDeliver,
    successDeliver,
  } = useSelector((state) => state.order);
  const paymentMethod = useSelector((state) => state.user.paymentMethod);

  useEffect(() => {
    let session;
    const authenticateUser = async () => {
      session = await getSession();
      if (session) {
        dispatch(setUserDetails());
      }
    };

    authenticateUser();
  }, [dispatch]);

  useEffect(() => {
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      dispatch(fetchOrder({ orderId }));

      if (successPay) {
        dispatch(orderActions.payReset());
      }

      if (successDeliver) {
        dispatch(orderActions.deliverReset());
      }
    }
  }, [dispatch, order._id, orderId, successPay, successDeliver]);

  const initiatePaymentHandler = async () => {
    dispatch(
      initiatePayment({
        orderData: {
          orderItems: order.orderItems,
          orderId: order._id.toString(),
          totalPrice: order.totalPrice,
          userId: order.user.toString(),
          paymentMethod: paymentMethod,
        },

        router,
      })
    );
  };

  const deliverOrderHandler = async () => {
    dispatch(deliverOrder({ orderId: order._id }));
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Head>
        <title>{`Order ${orderId}`}</title>
      </Head>
      <Script
        type="application/javascript"
        src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
        crossorigin="anonymous"
      />

      <div className="flex mb-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">
          My Orders
        </h1>
      </div>
      <div>
        <h2 className="mb-4 md:text-lg text-sm">{`Order ${orderId}`}</h2>
        {error && <div className="xs-max:text-sm alert-error">{error}</div>}
      </div>
      {!error && (
        <div className="grid md:grid-cols-4 md:gap-3 lg-max:gap-0 lg-max:grid-cols-1">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5 text-sm">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {order.shippingAddress.fullName},{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.state}
              </div>
              {order.isDelivered ? (
                <div className="alert-success">
                  Delivered at{" "}
                  {new Date(order.deliveredAt).toLocaleTimeString()}
                  {", "}
                  {new Date(order.deliveredAt)
                    .toLocaleString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })
                    .toString()}{" "}
                </div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>

            <div className="card p-5 text-sm ">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{order.paymentMethod}</div>
              {order.isPaid ? (
                <div className="alert-success">
                  Paid at {new Date(order.paidAt).toLocaleTimeString()}
                  {", "}
                  {new Date(order.paidAt)
                    .toLocaleString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })
                    .toString()}{" "}
                </div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5 md:col-span-4 xl:col-span-3">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <div className="overflow-x-auto text-sm lg:text-sm scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-300 p-0">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-4 text-left">Item</th>
                      <th className="p-4 text-right">Quantity</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item) => (
                      <tr key={item._id} className="border-b overflow-auto">
                        <td>
                          <Link href={`/product/${item.slug}`}>
                            <a className="flex items-center gap-1 w-max p-1">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              ></Image>
                              &nbsp;
                              <span className="break-words overflow-x-auto">
                                {item.name}
                              </span>
                            </a>
                          </Link>
                        </td>
                        <td className="p-5 text-right">{item.quantity}</td>
                        <td className="p-5 text-right">₹{item.price}</td>
                        <td className="p-5 text-right">
                          ₹{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul className="text-sm">
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>₹{order.itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>₹{order.taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>₹{order.shippingPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>₹{order.totalPrice}</div>
                  </div>
                </li>

                {order.isPaid && (
                  <li className="mt-3">
                    <Link href={`/api/orders/${orderId}/getInvoice`}>
                      <a className="w-full block">
                        <button className="w-full primary-button">
                          Download Invoice
                        </button>
                      </a>
                    </Link>
                  </li>
                )}

                {!order.isPaid && (
                  <li>
                    <div className="w-full">
                      <PaytmButton
                        onClick={initiatePaymentHandler}
                        ispending={loadingPay}
                      />
                    </div>
                  </li>
                )}
                {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                  <li>
                    <button
                      className="primary-button w-full"
                      onClick={deliverOrderHandler}
                    >
                      {loadingDeliver ? (
                        <LoadingSpinner className="mx-auto w-[1.9rem] h-4 text-slate-400 animate-spin dark:text-purple-600 fill-white" />
                      ) : (
                        <>Deliver Order</>
                      )}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Order.auth = true;
export default Order;
