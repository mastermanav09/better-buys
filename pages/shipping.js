import React, { useEffect, useState } from "react";
import Head from "next/head";
import CheckoutWizard from "../components/CheckoutWizard";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../utils/store/reducers/user";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/svg/LoadingSpinner";
import { getSession } from "next-auth/react";
import { setUserDetails } from "../utils/store/reducers/user";
import Address from "../components/svg/Address";

const Shipping = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();
  const userShippingdata = useSelector((state) => state.user.shippingAddress);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (userShippingdata && Object.keys(userShippingdata).length !== 0) {
      const name = userShippingdata.fullName.split(" ");
      const firstName = name[0];
      const lastName = name[1];

      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("address", userShippingdata.address);
      setValue("city", userShippingdata.city);
      setValue("postalCode", userShippingdata.postalCode);
      setValue("state", userShippingdata.state);
    }
  }, [setValue, userShippingdata]);

  const submitHandler = ({
    firstName,
    lastName,
    address,
    city,
    postalCode,
    state,
  }) => {
    const fullName = firstName + " " + lastName;

    dispatch(
      saveShippingAddress({
        userShippingdata: {
          fullName,
          address,
          city,
          postalCode,
          state,
        },

        setIsLoading,
        router,
      })
    );
  };

  return (
    <>
      <Head>
        <title>Shipping Address</title>
      </Head>
      <CheckoutWizard activeStep={1} />

      <div className="">
        <div className="max-w-4xl mx-auto">
          <div className="flex mb-4 items-center">
            <h1 className="text-xl font-semibold">Add your address</h1>
            <Address />
          </div>
          <div>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="overflow-hidden rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        First name
                        {errors.firstName && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.firstName.message}
                          </div>
                        )}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        autoFocus
                        {...register("firstName", {
                          required: "Please enter your first name.",
                          minLength: {
                            value: 3,
                            message: "Name should be of at least 3 chars.",
                          },
                        })}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        Last name
                        {errors.lastName && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.lastName.message}
                          </div>
                        )}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        {...register("lastName", {
                          required: "Please enter your last name.",
                        })}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="street-address"
                        className=" text-sm font-medium text-gray-700 flex items-center"
                      >
                        Street address
                        {errors.address && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.address.message}
                          </div>
                        )}
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        {...register("address", {
                          required: "Please enter your address.",
                          minLength: {
                            value: 5,
                            message: "Address should be at of least 5 chars.",
                          },
                        })}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        City
                        {errors.city && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.city.message}
                          </div>
                        )}
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        {...register("city", {
                          required: "Please enter your city.",
                        })}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="state"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        State / Province
                        {errors.state && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.state.message}
                          </div>
                        )}
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        {...register("state", {
                          required: "Please enter your region.",
                        })}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        ZIP / Postal code
                        {errors.postalCode && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.postalCode.message}
                          </div>
                        )}
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        {...register("postalCode", {
                          required: "Please enter your Postal code.",
                        })}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
                      <LoadingSpinner className="mx-auto w-[1.9rem] h-5 text-slate-400 animate-spin dark:text-purple-600 fill-white" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;

Shipping.auth = true;
