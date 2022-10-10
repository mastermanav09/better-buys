import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useEffect } from "react";
import Head from "next/head";
import ProductItem from "../components/ProductItem";
import db from "../utils/db";
import Product from "../models/product";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cartActions } from "../utils/store/reducers/cart";
import { getSession } from "next-auth/react";
import { setUserDetails } from "../utils/store/reducers/user";

import { Carousel } from "react-responsive-carousel";
import { NavLink } from "../components/NavLink";
import Image from "next/image";
import { getError } from "../utils/error";

const Home = (props) => {
  const { topRatedProducts, featuredProducts } = props;
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

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

  const checkAvailability = async (product) => {
    if (!Array.isArray(cartItems)) {
      toast.error("Cart items do not match!");
      return;
    }

    const existItem = cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    try {
      toast.clearWaitingQueue();
      const { data } = await axios.get(`/api/products/${product._id}`);

      if (data.countInStock < quantity) {
        toast.info("Sorry, Product is out of stock");

        return;
      }

      dispatch(
        cartActions.addItem({
          product: { ...product, quantity },
        })
      );

      toast.success("Added to cart");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const addToCartHandler = async (product) => {
    await checkAvailability(product);
  };

  return (
    <>
      <Head>
        <title>Better Buys</title>
        <meta name="description" content="Ecommerce website" />
      </Head>
      <div className="mt-2 mb-7 w-full">
        <Carousel infiniteLoop={true} autoPlay={true} showThumbs={false}>
          {featuredProducts.map((product) => (
            <div key={product._id} className="w-full">
              <NavLink href={`/product/${product.slug}`}>
                <Image
                  src={product.featuredImage}
                  alt={product.name}
                  width={1200}
                  height={500}
                  layout="responsive"
                />
              </NavLink>
            </div>
          ))}
        </Carousel>
      </div>
      <h2 className="my-2 font-semibold text-lg md:text-xl ">
        Popular Products
      </h2>
      <div className="grid grid-cols-2 xs-max:grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 text-xs lg:text-sm md:gap-4">
        {topRatedProducts.map((product) => (
          <ProductItem
            key={product.slug}
            product={product}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  await db.connect();

  const featuredProducts = await Product.find({ isFeatured: true })
    .select("-reviews -numReviews -numRatings")
    .lean()
    .limit(3);

  const topRatedProducts = await Product.find()
    .select("-reviews -numReviews -numRatings")
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      topRatedProducts: topRatedProducts.map(db.convertDocToObj),
    },

    revalidate: 3600,
  };
}
