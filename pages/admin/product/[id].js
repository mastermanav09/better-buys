import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminActions,
  editProduct,
  fetchProduct,
  uploadProductImage,
} from "../../../utils/store/reducers/admin";
import { useForm } from "react-hook-form";
import Head from "next/head";
import Sidebar from "../../../components/Sidebar";
import { navLinks } from "../../../utils/navlinks";
import PageLoader from "../../../components/svg/PageLoader";
import Link from "next/link";
import LoadingSpinner from "../../../components/svg/LoadingSpinner";
import { useState } from "react";
import Image from "next/image";

const AdminProductEdit = () => {
  const router = useRouter();
  const { query } = useRouter();
  const productId = query.id;
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    loadingProductUpdate,
    errorProductUpdate,
    loadingUpload,
  } = useSelector((state) => state.admin);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const uploadHandler = async () => {
    if (!selectedImage) {
      return;
    }

    dispatch(uploadProductImage({ selectedImage, setValue }));
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    dispatch(adminActions.nullifyErrors());

    dispatch(
      editProduct({
        productData: {
          name,
          slug,
          price,
          category,
          image,
          brand,
          countInStock,
          description,
        },

        setValue,
        productId,
        router,
      })
    );
  };

  useEffect(() => {
    dispatch(adminActions.nullifyErrors());
    dispatch(fetchProduct({ productId, setValue }));
  }, [dispatch, productId, setValue]);

  return (
    <>
      <Head>Admin Products</Head>
      <div>
        <Sidebar navLinks={navLinks} pathname={router.pathname} />
        <div className={error ? `my-12` : null}>
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            error && <div className="alert-error text-center ">{error}</div>
          ) : (
            <div className="my-16">
              <h1 className="mb-4 text-center text-xl md:text-left md:text-2xl">
                <span className="text-xl">Edit Product</span>{" "}
                <span className="text-green-600">{productId}</span>
              </h1>

              <form
                className="mx-auto max-w-screen-md my-8"
                onSubmit={handleSubmit(submitHandler)}
              >
                <div className="mb-5">
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

                <div className="mb-5">
                  <label htmlFor="slug">Slug</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    id="slug"
                    {...register("slug", {
                      required: "Please enter the slug.",
                    })}
                  />
                  {errors.slug && (
                    <div className="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.slug.message}
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="price">Price</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    id="price"
                    {...register("price", {
                      required: "Please enter the price.",
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        message: "Invalid price.",
                      },
                    })}
                  />
                  {errors.price && (
                    <div className="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.price.message}
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="image">Image</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    id="image"
                    {...register("image", {
                      required: "Please upload the image.",
                    })}
                  />
                  {errors.image && (
                    <div lassName="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.image.message}
                    </div>
                  )}
                </div>

                {selectedImage && (
                  <div className="h-[300px] w-[300px] mt-2">
                    <Image
                      src={URL.createObjectURL(selectedImage)}
                      alt="preview"
                      width={300}
                      height={300}
                    />
                  </div>
                )}

                <div className="my-4 flex flex-col">
                  <label
                    htmlFor="image"
                    className="text-xs font-semibold mb-1 md:text-sm"
                  >
                    Upload image
                  </label>

                  <div className="flex items-center w-full gap-10 my-1">
                    <label
                      className={[
                        `w-32 flex flex-col items-center bg-white rounded-md shadow-md tracking-wide border border-blue cursor-pointer pb-2 ease-linear transition-all duration-150`,
                        selectedImage
                          ? "text-white bg-purple-600"
                          : "bg-white text-purple-600",
                      ].join(" ")}
                    >
                      <i className="fas fa-cloud-upload-alt fa-3x"></i>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(event) =>
                          setSelectedImage(event.target.files[0])
                        }
                      />
                      <span className="mt-2 text-xs font-medium">
                        {selectedImage ? (
                          <span>Image Selected</span>
                        ) : (
                          <span>Select Image</span>
                        )}
                      </span>
                    </label>

                    <div>
                      <button
                        type="button"
                        className="inline-block px-3 py-2 bg-green-500 text-white font-medium text-xs rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={uploadHandler}
                        disabled={loadingUpload}
                      >
                        {loadingUpload ? (
                          <LoadingSpinner className="mx-auto w-[2.5rem] h-4 text-blue-100 animate-spin dark:text-purple-600 fill-white" />
                        ) : (
                          <>Upload</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    id="category"
                    {...register("category", {
                      required: "Please enter the category.",
                    })}
                  />
                  {errors.category && (
                    <div lassName="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.category.message}
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    id="brand"
                    {...register("brand", {
                      required: "Please enter the brand.",
                    })}
                  />
                  {errors.brand && (
                    <div lassName="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.brand.message}
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="countInStock">Count in stock</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    id="countInStock"
                    {...register("countInStock", {
                      required: "Please enter stock quantity.",
                      min: 0,
                    })}
                  />
                  {errors.countInStock && (
                    <div lassName="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.countInStock.message}
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    id="description"
                    {...register("description", {
                      required: "Please enter description.",
                      minLength: {
                        value: 3,
                        message: "Description should be of at least 10 chars.",
                      },
                    })}
                  />
                  {errors.description && (
                    <div lassName="text-red-500 text-xs md:text-[0.8rem] leading-none absolute my-[0.25rem]">
                      {errors.description.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button className="default-button">
                    <Link href={`/admin/products`}>Back</Link>
                  </button>
                  <div>
                    <button
                      disabled={loadingProductUpdate}
                      className="primary-button"
                    >
                      {loadingProductUpdate ? (
                        <LoadingSpinner className="mx-auto w-[50px] h-4 text-slate-400 animate-spin dark:text-purple-600 fill-white" />
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>

                {errorProductUpdate && (
                  <div className="text-red-500 text-xs md:text-[0.85rem] leading-none my-3 absolute">
                    Couldn&apos;t update product, Please try again.
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

AdminProductEdit.auth = { adminOnly: true };
export default AdminProductEdit;
