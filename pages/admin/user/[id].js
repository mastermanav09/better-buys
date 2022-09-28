import React from "react";
import PageLoader from "../../../components/svg/PageLoader";
import Head from "next/head";
import AdminSidebar from "../../../components/AdminSidebar";
import { useRouter } from "next/router";
import { navLinks } from "../../../utils/navlinks";
import Link from "next/link";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../../../components/svg/LoadingSpinner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../../utils/store/reducers/admin";
import { adminActions } from "../../../utils/store/reducers/admin";
import { editUser } from "../../../utils/store/reducers/admin";

const UserEdit = () => {
  const router = useRouter();
  const { query } = useRouter();
  const userId = query.id;
  const dispatch = useDispatch();
  const { isLoading, error, loadingUpdate, errorUpdate } = useSelector(
    (state) => state.admin
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    dispatch(adminActions.nullifyErrors());
    dispatch(fetchUser({ userId, setValue }));
  }, [dispatch, userId, setValue]);

  const submitHandler = async ({ name, isAdmin }) => {
    dispatch(adminActions.nullifyErrors());

    dispatch(
      editUser({
        userData: {
          name,
          isAdmin,
        },

        setValue,
        userId,
        router,
      })
    );
  };

  return (
    <>
      <Head>
        <title>User {userId}</title>
      </Head>
      <div>
        <AdminSidebar navLinks={navLinks} pathname={router.pathname} />
        <div className={error ? `my-12` : null}>
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            error && <div className="alert-error text-center ">{error}</div>
          ) : (
            <div className="my-16">
              <h1 className="mb-4 text-center text-xl md:text-left md:text-2xl">
                <span className="text-xl">Edit Product</span>{" "}
                <span className="text-green-600">{userId}</span>
              </h1>

              <form
                className="mx-auto max-w-screen-md my-8"
                onSubmit={handleSubmit(submitHandler)}
              >
                <div className="mb-4">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    autoFocus
                    id="name"
                    {...register("name", {
                      required: "Please enter the name.",
                      minLength: {
                        value: 3,
                        message: "Name should be of at least 3 chars.",
                      },
                    })}
                  />
                  {errors.name && (
                    <div className="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    {...register("isAdmin", {})}
                    id="isAdmin"
                  />
                  <label
                    className="form-check-label inline-block text-gray-800"
                    htmlFor="isAdmin"
                  >
                    Is Admin
                  </label>
                  {errors.isAdmin && (
                    <div className="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.isAdmin.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Link href={`/admin/users`}>
                    <button className="default-button">Back</button>
                  </Link>

                  <div>
                    <button disabled={loadingUpdate} className="primary-button">
                      {loadingUpdate ? (
                        <LoadingSpinner className="mx-auto w-[50px] h-4 text-slate-400 animate-spin dark:text-purple-600 fill-white" />
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>

                {errorUpdate && (
                  <div className="text-red-500 text-xs md:text-[0.85rem] leading-none my-3 absolute">
                    Couldn&apos;t update user, Please try again.
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

UserEdit.auth = { adminOnly: true };
export default UserEdit;
