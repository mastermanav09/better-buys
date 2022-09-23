import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { getSession, useSession } from "next-auth/react";
import { signup } from "../utils/store/reducers/user";
import { useDispatch } from "react-redux";
import LoadingSpinner from "../components/svg/LoadingSpinner";
import { useRouter } from "next/router";

const Register = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const submitHandler = ({ username, email, password }) => {
    dispatch(signup({ username, email, password, setIsLoading, router }));
  };

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10 mx-auto my-[4rem] relative">
        <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
          Create Account
        </div>
        <div className="max-h-4 my-1 absolute top-[4.5rem]">
          {errors.email ? (
            <div className="text-red-500 text-xs md:text-[0.85rem] leading-none">
              {errors.email.message}
            </div>
          ) : errors.username ? (
            <div className="text-red-500 text-xs md:text-[0.85rem] leading-none">
              {errors.username.message}
            </div>
          ) : errors.password ? (
            <div className="text-red-500 text-xs md:text-[0.85rem] leading-none">
              {errors.password.message}
            </div>
          ) : errors.confirmPassword ? (
            errors.confirmPassword &&
            errors.confirmPassword.type === "validate" ? (
              <div className="text-red-500 text-xs md:text-[0.85rem] leading-none">
                Password do not match.
              </div>
            ) : (
              <div className="text-red-500 text-xs md:text-[0.85rem] leading-none">
                {errors.confirmPassword.message}
              </div>
            )
          ) : (
            <></>
          )}
        </div>

        <div className="mt-2">
          <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    style={{ strokeWidth: "2" }}
                    stroke="currentColor"
                    className="w-3 h-4"
                  >
                    <path
                      style={{
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }}
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </span>

                <input
                  type="text"
                  id="username"
                  autoFocus
                  {...register("username", {
                    required: "Please enter your username.",
                    minLength: {
                      value: 3,
                      message: "Username should be of at least 3 chars.",
                    },
                  })}
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your username"
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Please enter your email.",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                      message: "Please enter valid email.",
                    },
                  })}
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Please enter password",
                    minLength: {
                      value: 6,
                      message: "Password should be of at least 6 chars.",
                    },
                  })}
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your password"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    validate: (value) => value === getValues("password"),
                    minLength: {
                      value: 6,
                      message: "Confirm password is more than 6 chars.",
                    },
                  })}
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-sm md:text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg disabled:opacity-30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="mx-auto w-6 h-6 text-white animate-spin dark:text-purple-600 fill-purple-600" />
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center mt-6 text-xs font-thin text-center text-gray-500  dark:text-gray-100  gap-1">
          <span className="ml-2">Already have an account ? </span>
          <Link href={`/login?redirect=${redirect || "/"}`}>
            <a className="inline-flex items-center hover:text-gray-700 dark:hover:text-white">
              Login here
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { redirect } = context.query;

  if (session) {
    return {
      redirect: {
        destination: redirect || "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
