import React, { useState } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { cartActions } from "../../utils/store/reducers/cart";
import { useRouter } from "next/router";
import db from "../../utils/db";
import Product from "../../models/product";
import axios from "axios";
import { toast } from "react-toastify";

const ProductItem = (props) => {
  const { product } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const checkAvailability = async () => {
    if (!Array.isArray(cartItems)) {
      toast.error("Cart items do not match!");
      return;
    }

    const existItem = cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    try {
      const { data } = await axios.get(`/api/products/${product._id}`);

      if (data.countInStock < quantity) {
        toast.info("Sorry, Product is out of stock");
        toast.clearWaitingQueue();
        return;
      }

      dispatch(
        cartActions.addItem({
          product: { ...product, quantity },
        })
      );

      toast.success("Added to cart");
      toast.clearWaitingQueue();
      return true;
    } catch (error) {
      toast.error("Cannot add product!");
    }
  };

  const addToCartHandler = async () => {
    await checkAvailability();
  };

  const buyNowHandler = async () => {
    const res = await checkAvailability();
    if (res) {
      router.push("/cart");
    }
  };

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`${product.description}`} />
      </Head>
      <div className="mx-auto max-w-5xl grid md:grid-cols-2 md:gap-6">
        <div className="max-w-max mx-auto">
          <Image
            src={product.image}
            alt={product.name}
            height={500}
            width={500}
          />

          <div className="card my-2 p-5 xs-max:text-[0.75rem] text-sm lg:text-base">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>₹{product.price}</div>
            </div>
            <div className="mt-2 flex justify-between">
              <div>Status</div>
              <div>
                {product.countInStock > 0 ? (
                  <span className="text-green-500">In Stock</span>
                ) : (
                  <span className="text-gray-400">Unavailable</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 h-10 md:h-12 cursor-pointer ">
            <button
              className="primary-button disabled:cursor-default disabled:bg-gray-300 xl:text-base"
              onClick={addToCartHandler}
              // disabled={product.countInStock === 0}
            >
              {product.countInStock === 0 ? "Out of Stock" : "Add to cart"}
            </button>
            <button
              className="rounded shadow outline-none bg-blue-700 hover:bg-blue-600 active:bg-blue-500 text-[0.65rem] sm:text-xs  text-white cursor-pointer disabled:cursor-default disabled:bg-gray-300 xl:text-base"
              onClick={buyNowHandler}
              // disabled={product.countInStock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="max-h-[45rem] overflow-auto scrollbar-none xs-max:text-[0.7rem] text-sm lg:text-base">
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>

            <li>
              <span className="font-semibold"> Category : </span>
              {product.category}
            </li>
            <li>
              <span className="font-semibold"> Brand : </span> {product.brand}
            </li>
            <li>
              {product.rating} of {product.numReviews}
              <span> </span> reviews
            </li>

            <li className="mb-20">
              <span className="font-semibold">Description : </span>
              {product.description}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProductItem;

export async function getServerSideProps(context) {
  const query = context.query;
  const { slug } = query;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();

  if (!product) {
    return {
      redirect: {
        permanent: false,
        destination: "/error",
      },
    };
  }

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}