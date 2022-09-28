import React from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../utils/store/reducers/user";

const HamburgerButton = (props) => {
  const { showSidebar } = props;
  const dispatch = useDispatch();

  return (
    <div className="flex items-center">
      <button
        className="relative group"
        onClick={(event) => {
          event.stopPropagation();

          dispatch(userActions.toggleSidebar(!showSidebar));
        }}
      >
        <div
          className={`relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px]  bg-slate-700 shadow-md hover:bg-slate-600 ${
            showSidebar && "bg-slate-600"
          }`}
        >
          <div
            className={`flex flex-col justify-between w-[20px] h-[20px] origin-center overflow-hidden`}
          >
            <div className={`bg-white h-[2px] w-7 origin-left`}></div>
            <div className={`bg-white h-[2px] w-7 rounded `}></div>
            <div className={`bg-white h-[2px] w-7 `}></div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default HamburgerButton;
