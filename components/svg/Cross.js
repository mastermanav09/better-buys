import React from "react";

const Cross = (props) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      style={{ strokeWidth: "2" }}
      stroke="currentColor"
      className={props.className}
    >
      <path
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M4.5 19.5l15-15m-15 0l15 15"
      />
    </svg>
  );
};

export default Cross;
