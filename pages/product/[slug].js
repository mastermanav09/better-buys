import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { cartActions } from "../../utils/store/reducers/cart";
import { useRouter } from "next/router";
import db from "../../utils/db";
import Product from "../../models/product";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import PageLoader from "../../components/svg/PageLoader";
import { fetchReviews } from "../../utils/store/reducers/product";
import LoadingSpinner from "../../components/svg/LoadingSpinner";
import { useEffect } from "react";
import ReviewItem from "../../components/ReviewItem";
import ReviewSubmitModal from "../../components/ReviewSubmitModal";

const ProductItem = (props) => {
  const { product } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [reviews, setReviews] = useState([]);
  const { isLoading } = useSelector((state) => state.product);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchReviews({ productId: product._id, setReviews }));
  }, [dispatch, product._id]);

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

  const addReviewModalHandler = (value) => {
    setShowModal(value);
  };

  const buyNowHandler = async () => {
    const res = await checkAvailability();
    if (res) {
      router.push("/cart");
    }
  };

  console.log(product.numRatings);
  let totalRatings = 0;
  let fiveStarRatingPct = 0;
  let fourStarRatingPct = 0;
  let threeStarRatingPct = 0;
  let twoStarRatingPct = 0;
  let oneStarRatingPct = 0;

  if (product) {
    const values = Object.values(product.numRatings);
    totalRatings = values.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    if (totalRatings != 0) {
      fiveStarRatingPct = Math.round(
        (product.numRatings.fiveStar / totalRatings) * 100
      );

      fourStarRatingPct = Math.round(
        (product.numRatings.fourStar / totalRatings) * 100
      );

      threeStarRatingPct = Math.round(
        (product.numRatings.threeStar / totalRatings) * 100
      );

      twoStarRatingPct = Math.round(
        (product.numRatings.twoStar / totalRatings) * 100
      );

      oneStarRatingPct = Math.round(
        (product.numRatings.oneStar / totalRatings) * 100
      );
    }
  }

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`${product.description}`} />
      </Head>
      {showModal && (
        <ReviewSubmitModal
          addReviewModalHandler={addReviewModalHandler}
          productId={product._id}
          setShowModal={setShowModal}
          setReviews={setReviews}
        />
      )}
      {!product ? (
        <PageLoader />
      ) : (
        <div className="mx-auto max-w-5xl md-max:max-w-max flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="w-full md:w-max">
            <Image
              src={product.image}
              alt={product.name}
              height={400}
              width={400}
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
                className="primary-button disabled:cursor-default disabled:bg-gray-300 "
                onClick={addToCartHandler}
                // disabled={product.countInStock === 0}
              >
                {product.countInStock === 0 ? "Out of Stock" : "Add to cart"}
              </button>
              <button
                className="rounded shadow outline-none bg-blue-700 hover:bg-blue-600 active:bg-blue-500 text-[0.7rem] sm:text-xs  text-white cursor-pointer disabled:cursor-default disabled:bg-gray-300 xl:text-[0.8rem]"
                onClick={buyNowHandler}
                // disabled={product.countInStock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>

          <div className="w-full md:w-3/5 ml-auto bg-gray-50 p-5 sm-max:p-1 rounded-md">
            <div className="max-h-max overflow-auto scrollbar-none xs-max:text-[0.7rem] text-base my-0 w-full">
              <ul className="flex flex-col">
                <li className="mb-3">
                  <h1 className="text-xl md:text-3xl font-semibold">
                    {product.name}
                  </h1>
                </li>
                <li>
                  <span className="text-gray-500 text-sm font-semibold">
                    Category :{" "}
                  </span>
                  {product.category}
                </li>
                <li>
                  <span className="text-gray-500 text-sm font-semibold">
                    Brand :{" "}
                  </span>
                  {product.brand}
                </li>
                <li>
                  <span className="text-gray-500 text-sm font-semibold">
                    Description :{" "}
                  </span>
                  {product.description}
                </li>
              </ul>
            </div>

            <div className="flex flex-col my-4">
              <h2 className="font-semibold">
                <Link href="#reviews">
                  <a
                    className="hover:underline hover:cursor-pointer"
                    style={{
                      textDecorationColor: "lightblue",
                    }}
                  >
                    <span className="text-blue-500">{totalRatings}</span>{" "}
                    Ratings
                  </a>
                </Link>{" "}
                and{" "}
                <Link
                  href="#reviews"
                  style={{
                    textDecorationColor: "lightblue",
                  }}
                >
                  <a
                    className="hover:underline hover:cursor-pointer"
                    style={{
                      textDecorationColor: "lightblue",
                    }}
                  >
                    <span className="text-blue-500">{product.numReviews}</span>{" "}
                    Reviews
                  </a>
                </Link>
              </h2>
              <div className="flex items-center gap-2">
                <div className="pointer-events-none text-xl">
                  <ReactStars
                    count={5}
                    value={product.rating}
                    isHalf={true}
                    size={42}
                    activeColor="#ffd700"
                  />
                </div>

                <div className="mt-[0.25rem]">{product.rating} out of 5</div>
              </div>

              {/* <Link href={`#reviews`}>
                  <a className="text-yellow-500 hover:underline">
                    {product.numReviews} reviews
                  </a>
                </Link> */}
            </div>

            <div className="flex flex-col gap-2 my-4">
              <div className=" text-black w-full my-3">
                <h2 className="text-base font-medium mb-3">
                  <span className="text-blue-600">{totalRatings}</span> Ratings
                </h2>

                <div className="flex items-center mb-2 md:mb-4">
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    5 star
                  </span>
                  <div className="mx-2 md:mx-4 md-max:w-[70%] w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700">
                    <div
                      className="h-5 bg-yellow-400 rounded"
                      style={{ width: fiveStarRatingPct + "%" }}
                    ></div>
                  </div>
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    {fiveStarRatingPct}%
                  </span>
                </div>

                <div className="flex items-center mb-2 md:mb-4">
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    4 star
                  </span>
                  <div className="mx-2 md:mx-4 md-max:w-[70%] w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700">
                    <div
                      className="h-5 bg-yellow-400 rounded"
                      style={{ width: fourStarRatingPct + "%" }}
                    ></div>
                  </div>
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    {fourStarRatingPct}%
                  </span>
                </div>

                <div className="flex items-center mb-2 md:mb-4">
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    3 star
                  </span>
                  <div className="mx-2 md:mx-4 md-max:w-[70%] w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700">
                    <div
                      className="h-5 bg-yellow-400 rounded"
                      style={{ width: threeStarRatingPct + "%" }}
                    ></div>
                  </div>
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    {threeStarRatingPct}%
                  </span>
                </div>

                <div className="flex items-center mb-2 md:mb-4">
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    2 star
                  </span>
                  <div className="mx-2 md:mx-4 md-max:w-[70%] w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700">
                    <div
                      className="h-5 bg-yellow-400 rounded"
                      style={{ width: twoStarRatingPct + "%" }}
                    ></div>
                  </div>
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    {twoStarRatingPct}%
                  </span>
                </div>

                <div className="flex items-center mb-2 md:mb-4">
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    1 star
                  </span>
                  <div className="mx-2 md:mx-4 md-max:w-[70%] w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700">
                    <div
                      className="h-5 bg-yellow-400 rounded"
                      style={{ width: oneStarRatingPct + "%" }}
                    ></div>
                  </div>
                  <span className="text-sm md-max:text-xs font-medium text-blue-600 dark:text-blue-500">
                    {oneStarRatingPct}%
                  </span>
                </div>
              </div>

              <div className="w-full my-3">
                <h2 className="mb-3 flex justify-between">
                  <span>
                    <span className="text-blue-600">{reviews.length}</span>{" "}
                    Reviews
                  </span>
                  <span className="text-xs lg:text-sm">
                    <button
                      className="bg-blue-500 px-2 py-1.5 rounded-sm text-white hover:bg-blue-400"
                      onClick={() => addReviewModalHandler(true)}
                    >
                      Rate our product
                    </button>
                  </span>
                </h2>

                <div className="w-full relative">
                  {isLoading ? (
                    <LoadingSpinner className="mx-auto w-6 h-6 text-gray-300 animate-spin dark:text-purple-600 fill-blue-600 my-5" />
                  ) : (
                    <>
                      {reviews.length === 0 ? (
                        <div className="text-center font-medium text-sm">
                          No reviews
                        </div>
                      ) : (
                        <ul>
                          {reviews.map((review) => (
                            <ReviewItem key={review._id} review={review} />
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ProductItem);

export async function getServerSideProps(context) {
  const query = context.query;
  const { slug } = query;

  await db.connect();
  const product = await Product.findOne({ slug })
    .select("-numRatings._id -reviews")
    .lean();

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
