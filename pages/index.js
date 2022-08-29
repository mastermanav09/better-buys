import Head from "next/head";
import ProductItem from "../components/ProductItem";
import db from "../utils/db";
import Product from "../models/product";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cartActions } from "../utils/store/reducers/cart";

const Home = (props) => {
  const { products } = props;
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const checkAvailability = async (product) => {
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
      <div className="grid grid-cols-2 xs-max:grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 text-xs lg:text-sm md:gap-4">
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

  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
