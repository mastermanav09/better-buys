import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../utils/store/reducers/cart";
import Rating from "@mui/material/Rating";

const ProductItem = ({ product, addToCartHandler }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            alt={product.name}
            height={400}
            width={400}
            className="rounded shadow object-cover"
            layout="responsive"
          />
        </a>
      </Link>

      <div className="flex flex-col items-center justify-center pt-2 p-3">
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className="text-sm mb-1 font-semibold">{product.name}</h2>
          </a>
        </Link>
        <div>
          <Rating value={product.rating} readOnly />
        </div>
        <p className="my-[0.4rem]">{product.brand}</p>
        <p>₹{product.price}</p>
        <button
          className="primary-button mt-2 disabled:cursor-default disabled:bg-gray-300"
          type="button"
          onClick={() => addToCartHandler(product)}
          // disabled={product.countInStock === 0}
        >
          {product.countInStock === 0 ? "Out of Stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
