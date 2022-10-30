import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersHistory } from "../utils/store/reducers/order";
import Head from "next/head";
import PageLoader from "../components/progress/PageLoader";
import Link from "next/link";
import { useState } from "react";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { allOrders, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrdersHistory({ data: {}, setIsLoading }));
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Order History</title>
      </Head>
      <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">
        Order History
      </h1>
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <>
          {allOrders.length === 0 ? (
            <h2 className="text-center text-base md:text-lg lg:text-xl xl:text-2xl my-4">
              No orders found
            </h2>
          ) : (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">DATE</th>
                    <th className="p-5 text-left">TOTAL</th>
                    <th className="p-5 text-left">PAID</th>
                    <th className="p-5 text-left">DELIVERED</th>
                    <th className="p-5 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order._id.substr(20, 24)}</td>
                      <td className="p-5">{order.createdAt.substr(0, 10)}</td>
                      <td className="p-5">${order.totalPrice}</td>
                      <td className="p-5">
                        {order.isPaid
                          ? `${order.paidAt.substr(0, 10)}`
                          : "Not paid"}
                      </td>

                      <td className="p-5">
                        {order.isDelivered
                          ? `${order.deliveredAt.substr(0, 10)}`
                          : "Not delivered"}
                      </td>

                      <td className="p-5">
                        <Link href={`/orders/${order._id}`} passHref>
                          <a className="text-yellow-500">Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
};

OrderHistory.auth = true;
export default OrderHistory;
