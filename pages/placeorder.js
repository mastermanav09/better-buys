import React, { useEffect, useState } from "react";
import Head from "next/head";
import CheckoutWizard from "../components/CheckoutWizard";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/router";
import { placeOrder } from "../utils/store/reducers/user";
import PageLoader from "../components/svg/PageLoader";
import PlaceOrderIcon from "../components/svg/PlaceOrderIcon";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const userShippingdata = useSelector((state) => state.user.shippingAddress);
  const paymentMethod = useSelector((state) => state.user.paymentMethod);
  const router = useRouter();
  const dispatch = useDispatch();

  let itemsPrice;
  if (Array.isArray(cartItems)) {
    itemsPrice = round2(
      cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
  }
  const shippingPrice = itemsPrice > 999 ? 0 : 40;
  const taxPrice = round2(itemsPrice * 0.18);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const placeOrderHandler = async () => {
    if (!Array.isArray(cartItems)) {
      toast.error("Cart items do not match!");
      return;
    }

    dispatch(
      placeOrder({
        shippingData: {
          orderItems: cartItems,
          userShippingdata,
          itemsPrice,
          paymentMethod,
          shippingPrice,
          taxPrice,
          totalPrice,
        },

        router,
        setIsLoading,
      })
    );

    setIsLoading(false);
  };

  if (Object.keys(userShippingdata).length === 0 || isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Head>
        <title>Place Order</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>

      <div>
        <CheckoutWizard activeStep={3} />
        <div className="flex mb-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">
            Place Order
          </h1>
          <PlaceOrderIcon />
        </div>
        {Array.isArray(cartItems) && cartItems.length === 0 ? (
          <div>
            Cart is empty. <Link href="/">Go Shopping</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card p-5">
                <h2 className="mb-2 text-lg">Shipping Address</h2>
                <div>
                  {userShippingdata.fullName}, {userShippingdata.address},{" "}
                  {userShippingdata.city}, {userShippingdata.postalCode},{" "}
                  {userShippingdata.state}
                </div>
                <div>
                  <Link href="/shipping">Edit</Link>
                </div>
              </div>

              <div className="card p-5">
                <h2 className="mb-2 text-lg">Payment Method</h2>
                <div>{paymentMethod}</div>
                <div>
                  <Link href="/payment">Edit</Link>
                </div>
              </div>

              <div className="card overflow-x-auto p-5">
                <h2 className="mb-2 text-lg">Order Items</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-4 text-left">Item</th>
                      <th className="p-4 text-right">Quantity</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(cartItems) &&
                      cartItems.map((item) => (
                        <tr key={item._id} className="border-b">
                          <td>
                            <Link href={`/product/${item.slug}`}>
                              <a className="flex items-center">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                ></Image>
                                &nbsp;
                                {item.name}
                              </a>
                            </Link>
                          </td>
                          <td className="p-5 text-right">{item.quantity}</td>
                          <td className="p-5 text-right">₹{item.price}</td>
                          <td className="p-5 text-right">
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="mt-3">
                  <Link href="/cart">Edit</Link>
                </div>
              </div>
            </div>

            <div className="card p-5 h-max">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>₹{itemsPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>₹{taxPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>₹{shippingPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total Price</div>
                    <div>₹{totalPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={placeOrderHandler}
                      className="primary-button w-full"
                    >
                      Place Order
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

PlaceOrder.auth = true;
export default PlaceOrder;
