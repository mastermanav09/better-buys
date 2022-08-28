import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Warning from "../components/svg/Warning";

const Unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;

  return (
    <>
      <Head>
        <title>Unauthorized!</title>
      </Head>
      <div className="text-center">
        <h1 className="text-xl lg:text-4xl flex items-center justify-center font-semibold">
          <Warning className="text-red-500 w-7 lg:w-10 mx-1 lg:mx-2" />
          Access Denied
        </h1>
        {message && (
          <div className="text-base lg:text-xl my-2 text-red-500">
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default Unauthorized;
