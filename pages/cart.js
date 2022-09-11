import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import CartSvg from "../components/svg/Cart";
import Cross from "../components/svg/Cross";
import { cartActions } from "../utils/store/reducers/cart";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const router = useRouter();
  const dispatch = useDispatch();

  const removeItemHandler = (item) => {
    dispatch(cartActions.removeItem(item));
    toast.success("Product removed from the cart");
  };

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);

    try {
      const { data } = await axios.get(`api/products/${item._id}`);

      if (data.countInStock < quantity) {
        toast.info("Sorry, Product is out of stock");
        toast.clearWaitingQueue();
        return;
      }

      dispatch(cartActions.addItem({ product: { ...item, quantity } }));

      toast.success("Product updated in the cart");
      toast.clearWaitingQueue();
    } catch (error) {
      toast.error("Cannot add product!");
    }
  };

  return (
    <>
      <Head>
        <title>Shopping Cart</title>
      </Head>

      <h1 className="mb-4 flex items-center text-xl md:text-2xl lg:text-3xl  xl:text-4xl font-semibold">
        Shopping Cart <CartSvg />
      </h1>
      {cartItems.length == 0 ? (
        <div className="h-max flex flex-col my-4 items-center text-2xl">
          Cart is empty!
          <div>
            <Link href="/">
              <button className="my-3 py-2 px-2 shadow-sm bg-lime-500 text-white rounded hover:bg-lime-600 text-sm">
                Go Shopping
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-6 xl:grid-cols-4 gap-4 xl:gap-10 ">
          <div className="overflow-x-auto md:col-span-4 xl:col-span-3 text-xs lg:text-sm scrollbar-thumb-gray-200 scrollbar-thin py-2 md:py-0">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-4 text-left">Item</th>
                  <th className="p-4 text-right">Quantity</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b overflow-auto">
                    <td className="max-w-fit">
                      <Link href={`/product/${item.slug}`}>
                        <a className="flex items-center gap-1 w-max p-1">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                          />
                          &nbsp;
                          <span className="break-words overflow-x-auto">
                            {item.name}
                          </span>
                        </a>
                      </Link>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                        className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-11 lg:w-14 p-1 lg:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right">₹{item.price}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <Cross className="w-3 h-3 lg:w-5 lg:h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-5 h-max md:col-span-2 xl:col-span-1">
            <ul className="flex flex-col h-full text-xs lg:text-sm">
              <li>
                <ul>
                  {cartItems.map((item, index) => (
                    <li key={index} className="grid grid-cols-2">
                      <div className="flex justify-between">
                        ₹{item.price} <span>x</span> {item.quantity}{" "}
                      </div>
                      <div className="ml-auto">
                        {item.price * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="my-2">
                <div className="pb-1 text-[0.8rem] xl:text-[1rem] font-semibold flex justify-between">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :{" "}
                  <div>
                    ₹{cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </div>
                </div>
              </li>
              <li>
                <button
                  className="primary-button w-full"
                  onClick={() => router.push("login?redirect=/shipping")}
                >
                  Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
