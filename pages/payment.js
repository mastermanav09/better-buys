import Head from "next/head";
import React, { useState, useEffect } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { savePaymentMethod } from "../utils/store/reducers/user";
import LoadingSpinner from "../components/svg/LoadingSpinner";
import { getSession } from "next-auth/react";
import { setUserDetails } from "../utils/store/reducers/user";
import Wallet from "../components/svg/Wallet";

const Payment = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { paymentMethod, shippingAddress } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!selectedPaymentMethod) {
      toast.error("Payment method is required!");
      toast.clearWaitingQueue();
      return;
    }

    dispatch(
      savePaymentMethod({
        paymentMethod: selectedPaymentMethod,
        setIsLoading,
        router,
      })
    );
  };

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

  useEffect(() => {
    if (!shippingAddress) {
      return router.push("/shipping");
    }

    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress]);

  return (
    <>
      <Head>
        <title>Payment Method</title>
      </Head>
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-lg" onSubmit={submitHandler}>
        <div className="flex items-center mb-4">
          <h1 className="text-xl font-semibold">Payment Method</h1>
          <Wallet />
        </div>
        {["Paytm", "Stripe", "Cash On Delivery"].map((payment) => (
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
            {isLoading ? (
              <LoadingSpinner className="mx-auto w-[1.65rem] h-4 text-slate-400 animate-spin dark:text-purple-600 fill-white" />
            ) : (
              "Next"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

Payment.auth = true;
export default Payment;
