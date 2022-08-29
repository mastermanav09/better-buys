import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import { getSession } from "next-auth/react";
import Cookies from "js-cookie";
import { cartActions } from "../utils/store/reducers/cart";

const Layout = ({ children }) => {
  const { status, data: session } = useSession();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cartItems]);

  const logoutHandler = () => {
    signOut({ callbackUrl: "/login" });
    Cookies.remove("cart");
    dispatch(cartActions.resetCart());
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        limit={2}
        autoClose={2000}
        hideProgressBar={false}
        className="text-xs md:text-sm"
      />

      <div className="flex min-h-screen flex-col">
        <header>
          <nav className="flex h-12 justify-between items-center shadow-md px-4 bg-slate-100">
            <Link href="/">
              <a className="text-lg font-extrabold">Better Buys</a>
            </Link>
            <div>
              <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-blue-600 md:px-2 md:py-1 md:text-xs font-bold text-white px-[0.4rem] py-[0.2rem] text-[0.55rem]">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {session?.user ? (
                <Menu as="div" className="relative inline-block z-10">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white rounded-md text-sm">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/my-orders">
                        My Orders
                      </DropdownLink>
                    </Menu.Item>
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
        <main className="container mx-auto mt-4 mb-20 px-4 h-full">
          {children}
        </main>
        <footer className="flex justify-center items-center h-10 shadow-inner bg-slate-100 mt-auto">
          Copyright &copy; 2022 Better Buys
        </footer>
      </div>
    </>
  );
};

export default Layout;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
