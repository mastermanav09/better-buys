import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import PageLoader from "../../components/svg/PageLoader";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { navLinks } from "../../utils/navlinks";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummary } from "../../utils/store/reducers/admin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, summary, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);

  const data = {
    labels: summary.salesData.map((val) => val._id),
    datasets: [
      {
        label: "Sales",
        backgroundColor: "skyblue",
        data: summary.salesData.map((val) => val.totalSales),
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      <div>
        <Sidebar navLinks={navLinks} pathname={router.pathname} />
        <div className={error ? `my-12` : null}>
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            error && <div className="alert-error text-center">{error}</div>
          ) : (
            <div className="my-16">
              <h1 className="mb-4 text-center text-xl md:text-left md:text-3xl lg:text-4xl">
                Admin Dashboard
              </h1>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="card m-5 p-5">
                    <p className="text-3xl">₹{summary.ordersPrice}</p>
                    <p>Sales</p>
                    <Link href="/admin/orders">View sales</Link>
                  </div>
                  <div className="card m-5 p-5">
                    <p className="text-3xl">{summary.ordersCount}</p>
                    <p>Orders</p>
                    <Link href="/admin/orders">View orders</Link>
                  </div>{" "}
                  <div className="card m-5 p-5">
                    <p className="text-3xl">{summary.productsCount}</p>
                    <p>Products</p>
                    <Link href="/admin/products">View products</Link>
                  </div>{" "}
                  <div className="card m-5 p-5">
                    <p className="text-3xl">{summary.usersCount}</p>
                    <p>Users</p>
                    <Link href="/admin/users">View users</Link>
                  </div>{" "}
                </div>
                <h2 className="text-xl">Sales Report</h2>
                <Bar
                  options={{
                    legend: {
                      display: true,
                      position: "right",
                    },
                  }}
                  data={data}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

AdminDashboard.auth = { adminOnly: true };
export default AdminDashboard;
