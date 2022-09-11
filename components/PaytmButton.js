import React from "react";
import LoadingSpinner from "./svg/LoadingSpinner";

const PaytmButton = (props) => {
  const { isPending, ...args } = props;
  return (
    <button
      disabled={isPending}
      {...args}
      className="text-center w-full px-3 py-1 bg-blue-100 rounded-md cursor-pointer enabled:hover:bg-blue-200 disabled:cursor-default disabled:bg-gray-200 relative"
    >
      {isPending && (
        <LoadingSpinner className="mx-auto w-6 h-6 text-white animate-spin dark:text-purple-600 fill-blue-600 float-left z-30 left-20 center-loader" />
      )}
      <span
        className={`text-gray-700 text-sm mx-1 ${isPending && "opacity-40 "}`}
        style={{ fontStyle: "italic" }}
      >
        Pay with
      </span>
      <span
        className={`font-extrabold text-center ${isPending && "opacity-40 "}`}
        style={{
          fontFamily: "Roboto",
          letterSpacing: "1px",
          fontWeight: "bolder",
        }}
      >
        <span className="text-blue-900">Pay</span>
        <span className="text-blue-400">tm</span>
      </span>
    </button>
  );
};

export default PaytmButton;
