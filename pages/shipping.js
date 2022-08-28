import React from "react";
import Head from "next/head";
import CheckoutWizard from "../components/CheckoutWizard";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const Shipping = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch();
  };

  return (
    <>
      <Head>
        <title>Shipping Address</title>
      </Head>
      <CheckoutWizard activeStep={1} />
      <div className="mt-10 sm:mt-0">
        <div className="max-w-4xl mx-auto">
          <div className="mt-5">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="overflow-hidden rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlForFor="first-name"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        First name
                        {errors.fullName && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.fullName.message}
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
                        {errors.fullName && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.fullName.message}
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
                        htmlFor="region"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        State / Province
                        {errors.region && (
                          <div className="text-red-500 text-xs mx-2">
                            {errors.region.message}
                          </div>
                        )}
                      </label>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        {...register("region", {
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
                    Save
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
