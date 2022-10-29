import React, { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import db from "../utils/db";
import Product from "../models/product";
import ProductItem from "../components/ProductItem";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { cartActions } from "../utils/store/reducers/cart";
import {
  Box,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
  Pagination,
} from "@mui/material";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import PageLoader from "../components/svg/PageLoader";
import { useEffect } from "react";
import { getError } from "../utils/error";
import { getCategoriesAndBrands } from "../utils/store/reducers/product";
import FilterSidebar from "../components/FilterSidebar";

const PAGE_SIZE = 8;

const prices = [
  {
    name: "₹1 to ₹1000",
    value: "1-1000",
  },

  {
    name: "₹1001 to ₹2000",
    value: "1001-2000",
  },

  {
    name: "₹2001 to ₹3000",
    value: "2001-3000",
  },

  {
    name: "₹3001 to ₹5000",
    value: "3001-5000",
  },

  {
    name: "₹5001 to ₹10000",
    value: "5001-10000",
  },

  {
    name: "₹10001 to ₹50000",
    value: "10001-50000",
  },
];

const ratings = [1, 2, 3, 4, 5];

const Search = (props) => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { allCategories, allBrands } = useSelector((state) => state.product);
  const [toggleFilterSidebar, setToggleFilterSidebar] = useState(false);

  const closeSidebarHandler = (val) => {
    setToggleFilterSidebar(val);
  };

  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
    rating = "all",
    sort = "featured",
  } = router.query;

  const { products, countProducts, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (price) query.price = price;
    if (rating) query.rating = rating;

    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    if (
      query.hasOwnProperty("category") ||
      query.hasOwnProperty("price") ||
      query.hasOwnProperty("rating") ||
      query.hasOwnProperty("brand")
    ) {
      delete query.query;
    }

    router.push({
      pathname: query ? null : path,
      query: query,
    });
  };

  useEffect(() => {
    dispatch(getCategoriesAndBrands());
  }, [dispatch]);

  const categoryHandler = (event) => {
    filterSearch({ category: event.target.value });
  };

  const pageHandler = (event, page) => {
    filterSearch({ page });
  };

  const brandHandler = (event) => {
    filterSearch({ brand: event.target.value });
  };

  const sortHandler = (event) => {
    filterSearch({ sort: event.target.value });
  };

  const priceHandler = (event) => {
    filterSearch({ price: event.target.value });
  };

  const ratingHandler = (event) => {
    filterSearch({ rating: event.target.value });
  };

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
      toast.error(getError(error));
    }
  };

  const addToCartHandler = async (product) => {
    await checkAvailability(product);
  };

  if (!products || allCategories.length === 0 || allBrands.length === 0) {
    return <PageLoader />;
  }

  return (
    <>
      <Head>
        <title>Search products</title>
      </Head>

      {toggleFilterSidebar && (
        <FilterSidebar
          closeSidebarHandler={closeSidebarHandler}
          ratings={ratings}
          allCategories={allCategories}
          allBrands={allBrands}
          categoryHandler={categoryHandler}
          brandHandler={brandHandler}
          priceHandler={priceHandler}
          ratingHandler={ratingHandler}
          brand={brand}
          category={category}
          rating={rating}
          price={price}
          prices={prices}
        />
      )}

      <div className="w-full flex flex-col lg:flex-row mt-5">
        <div className="flex items-center gap-1 text-sm md:text-base xs-max:text-xs my-0.5 lg:my-0">
          {products.length === 0 ? "No" : countProducts}{" "}
          {countProducts === 1 ? <>Result</> : <>Results</>}
          {category !== "all" &&
            " : " + category.charAt(0).toUpperCase() + category.slice(1)}
          {brand !== "all" &&
            " : " + brand.charAt(0).toUpperCase() + brand.slice(1)}
          {price !== "all" &&
            " : " + price.charAt(0).toUpperCase() + price.slice(1)}
          {rating !== "all" && " : Rating " + rating + " & Up"}
          {category !== "all" ||
          brand !== "all" ||
          rating !== "all" ||
          price !== "all" ? (
            <button onClick={() => router.push("/search")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                style={{ strokeWidth: "1.7px" }}
                stroke="currentColor"
                className="w-4 h-4 md:w-5 md:h-5 bg-gray-700 text-white rounded-full mt-0.5"
              >
                <path
                  style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className="lg:ml-auto my-0.5 lg:my-0 inline-flex items-center text-sm md:text-base xs-max:text-xs">
          <span>Sort by</span>
          <div className="mx-1.5">
            <Select
              value={sort}
              onChange={sortHandler}
              variant="standard"
              className="text-sm lg:text-base"
            >
              <MenuItem value="featured" className="text-sm lg:text-base">
                Featured
              </MenuItem>
              <MenuItem value="lowest" className="text-sm lg:text-base">
                Price : Low to High
              </MenuItem>
              <MenuItem value="highest" className="text-sm lg:text-base">
                Price : High to Low
              </MenuItem>
              <MenuItem value="toprated" className="text-sm lg:text-base">
                Customer Reviews
              </MenuItem>
              <MenuItem value="newest" className="text-sm lg:text-base">
                Newest Arrivals
              </MenuItem>
            </Select>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ strokeWidth: "1.5px" }}
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 sm:hidden mx-1 cursor-pointer ml-auto"
            onClick={() => closeSidebarHandler(true)}
          >
            <path
              style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
        </div>
      </div>
      <div className="border border-gray-300" />
      <main className="flex">
        <section className="h-full w-72 py-3  flex-col gap-3 hidden sm:inline-flex">
          <List>
            <ListItem>
              <Box className="w-full">
                <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                  Categories
                </Typography>
                <Select
                  fullWidth
                  value={category}
                  onChange={categoryHandler}
                  variant="standard"
                  className="text-sm lg:text-base"
                >
                  <MenuItem value="all" className="text-sm lg:text-base">
                    All
                  </MenuItem>
                  {allCategories &&
                    allCategories.map((category) => (
                      <MenuItem
                        key={category}
                        value={
                          category.charAt(0).toLowerCase() + category.slice(1)
                        }
                        className="text-sm lg:text-base"
                      >
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className="w-full">
                <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                  Brands
                </Typography>
                <Select
                  fullWidth
                  value={brand}
                  onChange={brandHandler}
                  variant="standard"
                  className="text-sm lg:text-base"
                >
                  <MenuItem value="all" className="text-sm lg:text-base">
                    All
                  </MenuItem>
                  {allBrands &&
                    allBrands.map((brand) => (
                      <MenuItem
                        key={brand}
                        value={brand.charAt(0).toLowerCase() + brand.slice(1)}
                        className="text-sm lg:text-base"
                      >
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className="w-full">
                <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                  Prices
                </Typography>
                <Select
                  fullWidth
                  value={price}
                  onChange={priceHandler}
                  variant="standard"
                  className="text-sm lg:text-base"
                >
                  <MenuItem value="all" className="text-sm lg:text-base">
                    All
                  </MenuItem>
                  {prices.map((price) => (
                    <MenuItem
                      key={price.value}
                      value={price.value}
                      className="text-sm lg:text-base"
                    >
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className="w-full">
                <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                  Rating
                </Typography>
                <Select
                  fullWidth
                  value={rating}
                  onChange={ratingHandler}
                  variant="standard"
                  className="text-sm lg:text-base"
                >
                  <MenuItem value="all" className="text-sm lg:text-base">
                    All
                  </MenuItem>
                  {ratings.map((rating) => (
                    <MenuItem
                      key={rating}
                      value={rating}
                      className="text-sm lg:text-base"
                    >
                      <div className="pointer-events-none flex items-center gap-1">
                        <Rating value={rating} readOnly />
                        <Typography component="span">&amp; Up</Typography>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </section>
        <section className="w-full md:px-4 px-0 py-2 m-2">
          <div className="grid grid-cols-2 xs-max:grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-xs lg:text-sm md:gap-4">
            {products.map((product) => (
              <ProductItem
                key={product.slug}
                product={product}
                addToCartHandler={addToCartHandler}
              />
            ))}
          </div>
        </section>
      </main>

      <div className="flex justify-center mt-8">
        <Pagination
          defaultPage={parseInt(query.page || "1")}
          count={pages}
          onChange={pageHandler}
        ></Pagination>
      </div>
    </>
  );
};

export default Search;

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const brand = query.brand || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const searchQuery = query.query || "";
  const async = require("async");

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          $text: { $search: searchQuery },
        }
      : {};

  const categoryFilter =
    category && category !== "all"
      ? {
          category: category.charAt(0).toUpperCase() + category.slice(1),
        }
      : {};

  const brandFilter =
    brand && brand !== "all"
      ? {
          brand: brand.charAt(0).toUpperCase() + brand.slice(1),
        }
      : {};

  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const order =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const productsRetriveQuery = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    "-reviews"
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProductsQuery = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    "-reviews"
  ).countDocuments();

  const products = productsRetriveQuery.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts: countProductsQuery,
      page,
      pages: Math.ceil(countProductsQuery / pageSize),
    },
  };
}
