import Head from "next/head";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminActions,
  createProduct,
  deleteProduct,
  fetchProducts,
} from "../../utils/store/reducers/admin";
import { navLinks } from "../../utils/navlinks";
import { useRouter } from "next/router";
import AdminSidebar from "../../components/AdminSidebar";
import PageLoader from "../../components/svg/PageLoader";
import Link from "next/link";
import LoadingSpinner from "../../components/svg/LoadingSpinner";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isLoading,
    error,
    products,
    loadingCreate,
    loadingDelete,
    successDelete,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (successDelete) {
      dispatch(adminActions.deleteReset());
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, successDelete]);

  const createProductHandler = () => {
    if (!window.confirm("Do you want to add a product ?")) {
      return;
    }

    dispatch(createProduct({ router }));
  };

  const deleteHandler = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product ?")) {
      return;
    }

    dispatch(deleteProduct(productId));
  };

  return (
    <>
      <Head>
        <title>Admin Products</title>
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
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-center text-2xl md:text-left md:text-3xl lg:text-4xl align-middle">
                  Products
                </h1>

                <button
                  disabled={loadingCreate}
                  onClick={createProductHandler}
                  className="primary-button"
                >
                  {loadingCreate ? (
                    <LoadingSpinner className="mx-auto w-[2.4rem] h-4 text-blue-100 animate-spin dark:text-purple-600 fill-white" />
                  ) : (
                    <>Create</>
                  )}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">ID</th>
                      <th className="p-5 text-left">NAME</th>
                      <th className="p-5 text-left">PRICE</th>
                      <th className="p-5 text-left">CATEGORY</th>
                      <th className="p-5 text-left">COUNT</th>
                      <th className="p-5 text-left">RATING</th>
                      <th className="p-5 text-left">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b text-sm">
                        <td className="p-5">{product._id.substr(20, 24)}</td>
                        <td className="p-5">{product.name}</td>
                        <td className="p-5">₹{product.price}</td>
                        <td className="p-5">{product.category}</td>
                        <td className="p-5">{product.countInStock}</td>
                        <td className="p-5">{product.rating}</td>
                        <td className="p-5 flex items-center">
                          <Link href={`/admin/product/${product._id}`} passHref>
                            <a className="mx-1 text-blue-400">
                              <button className="inline-block p-2 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                                Edit
                              </button>
                            </a>
                          </Link>
                          &nbsp;
                          <button
                            className="inline-block p-2 bg-red-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                            onClick={() => deleteHandler(product._id)}
                            disabled={loadingDelete}
                          >
                            {loadingDelete === product._id ? (
                              <LoadingSpinner className="mx-auto w-[2.5rem] h-4 text-red-200 animate-spin fill-white" />
                            ) : (
                              <> Delete</>
                            )}
                          </button>
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

AdminProducts.auth = { adminOnly: true };
export default AdminProducts;
