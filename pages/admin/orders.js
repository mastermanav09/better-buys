import React from "react";
import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import PageLoader from "../../components/svg/PageLoader";
import AdminSidebar from "../../components/AdminSidebar";
import { useRouter } from "next/router";
import { navLinks } from "../../utils/navlinks";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../utils/store/reducers/admin";

const AdminOrders = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, orders, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Admin Orders</title>
      </Head>
      <div>
        <AdminSidebar navLinks={navLinks} pathname={router.pathname} />
        <div className={error ? `my-12` : null}>
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            error && <div className="alert-error text-center ">{error}</div>
          ) : (
            <div className="my-16">
              <div className="mb-8">
                <h1 className="text-center text-2xl md:text-left md:text-3xl lg:text-4xl align-middle">
                  Orders
                </h1>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">ID</th>
                      <th className="px-5 text-left">USER</th>
                      <th className="px-5 text-left">DATE</th>
                      <th className="px-5 text-left">TOTAL</th>
                      <th className="px-5 text-left">PAID</th>
                      <th className="px-5 text-left">DELIVERED</th>
                      <th className="px-5 text-left">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b text-sm">
                        <td className="p-5">{order._id.substr(20, 24)}</td>
                        <td className="p-5">
                          {order.user
                            ? order.shippingAddress.fullName
                            : "DELETED USER"}
                        </td>
                        <td className="p-5">{order.createdAt.substr(0, 10)}</td>

                        <td className="p-5">₹{order.totalPrice}</td>
                        <td className="p-5">
                          {order.isPaid
                            ? `${order.paidAt.substr(0, 10)}`
                            : "Not Paid"}
                        </td>

                        <td className="p-5">
                          {order.isDelivered
                            ? `${order.deliveredAt.substr(0, 10)}`
                            : "Not Delivered"}
                        </td>

                        <td className="p-5">
                          <Link href={`/orders/${order._id}`} passHref>
                            <a className="text-yellow-500">
                              <button className="inline-block p-2 bg-blue-400 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out">
                                Details
                              </button>
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

AdminOrders.auth = { adminOnly: true };
export default AdminOrders;
