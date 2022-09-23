import React, { useEffect } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../utils/store/reducers/user";
import { useState } from "react";
import LoadingSpinner from "../components/svg/LoadingSpinner";

const Profile = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    setValue("name", session?.user.name);
    setValue("email", session?.user.email);
  }, [setValue, session?.user]);

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    dispatch(
      updateProfile({
        userData: {
          name,
          email,
          password,
          confirmPassword,
        },

        setIsLoading,
      })
    );
  };

  return (
    <>
      <Head>
        <title>My Profile</title>
      </Head>
      <form
        className="mx-auto max-w-screen-md my-10 h-full"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>

        <div className="my-6">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full rounded-md"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter your username.",
              minLength: {
                value: 3,
                message: "Username should be of at least 3 chars.",
              },
            })}
          />
          {errors.name && (
            <div className="text-red-500 text-xs md:text-[0.85rem] leading-none absolute my-1">
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="my-6">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full rounded-md"
            id="email"
            {...register("email", {
              required: "Please enter email.",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email.",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500 text-xs md:text-[0.85rem] leading-none absolute my-1">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="my-6">
          <label htmlFor="password">Password</label>
          <input
            className="w-full rounded-md"
            type="password"
            id="password"
            {...register("password", {
              required: "Please enter password.",
              minLength: {
                value: 6,
                message: "Password should be of at least 6 chars.",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500 text-xs md:text-[0.85rem] leading-none absolute my-1">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="my-6">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full rounded-md"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Confirm password is more than 6 chars.",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 text-xs md:text-[0.85rem] leading-none absolute my-1">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 text-xs md:text-[0.85rem] leading-none absolute my-1">
                Password do not match.
              </div>
            )}
        </div>
        <div className="my-8">
          <button
            className="primary-button disabled:cursor-default md:w-32 w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner className="mx-auto w-5 h-4 text-white animate-spin dark:text-purple-600 fill-gray-500" />
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Profile;
