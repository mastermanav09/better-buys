import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";
import { cartActions } from "../utils/store/reducers/cart";
import { userActions } from "../utils/store/reducers/user";
import Sidebar from "./Sidebar";
import { adminActions } from "../utils/store/reducers/admin";
import HamburgerButton from "./svg/HamburgerButton";
import { fetchCategories } from "../utils/store/reducers/product";
import { useRouter } from "next/router";
import { useRef } from "react";

const Layout = ({ children }) => {
  const { status, data: session } = useSession();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const showSidebar = useSelector((state) => state.user.ui.showSidebar);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchQueryInputRef = useRef();

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      setCartItemsCount(cartItems.reduce((a, c) => a + c.quantity, 0));
    }
  }, [cartItems]);

  const logoutHandler = () => {
    signOut({ callbackUrl: "/login" });
    Cookies.remove("cart");
    dispatch(cartActions.resetCart());
    dispatch(cartActions.resetUserOrderDetails());
  };

  const queryChangeHandler = (event) => {
    setQuery(event.target.value);
  };

  const submitQueryHandler = async (event) => {
    event.preventDefault();
    const searchText = searchQueryInputRef.current.value;
    router.push(
      `/search?query=${
        searchText.charAt(0).toLowerCase() + searchText.slice(1)
      }`
    );

    searchQueryInputRef.current.value = "";
  };

  const fetchCategoriesHandler = async () => {
    dispatch(fetchCategories({ setCategories }));
  };

  useEffect(() => {
    fetchCategoriesHandler();
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        limit={2}
        autoClose={2000}
        hideProgressBar={false}
        className="text-xs md:text-sm"
      />

      {showSidebar && <Sidebar categories={categories} />}

      <div
        className="flex min-h-screen flex-col"
        onClick={() => {
          dispatch(adminActions.toggleSidebar(false));

          dispatch(userActions.toggleSidebar(false));
          dispatch(userActions.toggleFilterSidebar(false));
        }}
      >
        <header>
          <nav
            className="flex h-12 justify-between items-center shadow-md px-2 text-white"
            style={{ backgroundColor: "#2b3a51" }}
          >
            <div className="flex items-center gap-2">
              <HamburgerButton showSidebar={showSidebar} />
              <Link href="/">
                <a className="text-base md:text-lg font-extrabold text-white">
                  Better Buys
                </a>
              </Link>
            </div>
            <form
              className="items-center w-2/6 hidden md:flex min-w-fit"
              onSubmit={submitQueryHandler}
            >
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 px-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                  onChange={queryChangeHandler}
                  ref={searchQueryInputRef}
                />
              </div>
              <button
                type="submit"
                className="px-2.5 py-2 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    style={{
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                    }}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </form>{" "}
            <div className="text-sm md:text-base">
              <Link href="/cart">
                <a className="p-2 inline-flex items-center">
                  <span> Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-blue-600 md:px-2 md:py-1 md:text-xs font-bold text-white px-[0.45rem] text-[0.6rem]">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {session?.user ? (
                <Menu
                  as="div"
                  className="relative inline-block z-10 text-black"
                >
                  <Menu.Button className="text-white">
                    {status == "loading" ? "loading..." : session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white rounded-md text-sm">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        My Orders
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a className="dropdown-link" onClick={logoutHandler}>
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container mx-auto mt-4 mb-20 px-3 h-full">
          {children}
        </main>
        <footer
          className="flex justify-center items-center h-10 shadow-inner mt-auto text-white"
          style={{ backgroundColor: "#2b3a51" }}
        >
          Copyright &copy; 2022 Better Buys
        </footer>
      </div>
    </>
  );
};

export default Layout;
