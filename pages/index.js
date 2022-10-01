import { useEffect } from "react";
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

const Home = (props) => {
  const { products } = props;
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
    } catch (error) {
      toast.error("Cannot add product!");
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
      <div className="grid grid-cols-2 xs-max:grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 text-xs lg:text-sm md:gap-4">
        {products.map((product) => (
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

  const products = await Product.find()
    .select("-reviews -numReviews -numRatings")
    .lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },

    revalidate: 3600,
  };
}
