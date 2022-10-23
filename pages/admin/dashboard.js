import Head from "next/head";
import React, { useEffect, useRef } from "react";
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
import AdminSidebar from "../../components/AdminSidebar";
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
  const ref = useRef(null);

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

  const scrollToSalesReport = (elementRef) => {
    window.scrollTo({
      top: elementRef.current?.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      <div>
        <AdminSidebar navLinks={navLinks} pathname={router.pathname} />
        <div className={error ? `my-12` : null}>
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            error && <div className="alert-error text-center">{error}</div>
          ) : (
            <div className="my-16">
              <h1 className="sm:mb-4 text-center text-2xl md:text-left md:text-3xl lg:text-4xl">
                Admin Dashboard
              </h1>
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2">
                  <div className="card m-5 p-5">
                    <p className="text-xl lg:text-2xl xl:text-3xl">
                      ₹{summary.ordersPrice}
                    </p>
                    <p className="font-bold text-indigo-800">Sales</p>
                    <Link href="/admin/dashboard/#sales-report">
                      <a>
                        <button
                          className="text-[0.8rem] bg-purple-600 px-3 py-1 mt-2 rounded text-white hover:bg-purple-500"
                          onClick={() => scrollToSalesReport(ref)}
                        >
                          View sales
                        </button>
                      </a>
                    </Link>
                  </div>
                  <div className="card m-5 p-5">
                    <p className="text-xl lg:text-2xl xl:text-3xl">
                      {summary.ordersCount}
                    </p>
                    <p className="font-bold text-indigo-800">Orders</p>
                    <Link href="/admin/orders">
                      <a>
                        <button className="text-[0.8rem] bg-purple-600 px-3 py-1 mt-2 rounded text-white hover:bg-purple-500">
                          View orders
                        </button>
                      </a>
                    </Link>
                  </div>{" "}
                  <div className="card m-5 p-5">
                    <p className="text-xl lg:text-2xl xl:text-3xl">
                      {summary.productsCount}
                    </p>
                    <p className="font-bold text-indigo-800"> Products</p>
                    <Link href="/admin/products">
                      <a>
                        <button className="text-[0.8rem] bg-purple-600 px-3 py-1 mt-2 rounded text-white hover:bg-purple-500">
                          View products
                        </button>
                      </a>
                    </Link>
                  </div>{" "}
                  <div className="card m-5 p-5">
                    <p className="text-xl lg:text-2xl xl:text-3xl">
                      {summary.usersCount}
                    </p>
                    <p className="font-bold text-indigo-800">Users</p>
                    <Link href="/admin/users">
                      <a>
                        <button className="text-[0.8rem] bg-purple-600 px-3 py-1 mt-2 rounded text-white hover:bg-purple-500">
                          View Users
                        </button>
                      </a>
                    </Link>
                  </div>{" "}
                </div>
                <div ref={ref}></div>
                <div className="my-4">
                  <h2 className="mb-4 text-center text-lg md:text-left">
                    Sales Report
                  </h2>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

AdminDashboard.auth = { adminOnly: true };
export default AdminDashboard;
