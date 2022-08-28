import Head from "next/head";
import React, { useState, useEffect } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { savePaymentMethod } from "../utils/store/reducers/user";

const Payment = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { paymentMethod, shippingAddress } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const submitHandler = (event) => {
    event.preventDefault();

    if (!selectedPaymentMethod) {
      toast.error("Payment method is required!");
      toast.clearWaitingQueue();
      return;
    }

    // dispatch(savePaymentMethod(selectedPaymentMethod));
    router.push("/placeorder");
  };

  useEffect(() => {
    //   if (!shippingAddress.address) {
    //     return router.push("/shipping");
    //   }

    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <>
      <Head>
        <title>Payment Method</title>
      </Head>
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-lg" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["PayPal", "Stripe", "Cash On Delivery"].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0 cursor-pointer"
              id={payment}
              type="radio"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}

        <div className="my-10 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="default-button"
          >
            Back
          </button>

          <button className="primary-button" type="submit">
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default Payment;
