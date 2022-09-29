import React from "react";
import Image from "next/image";
import Cross from "./svg/Cross";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "./NavLink";
import { adminActions } from "../utils/store/reducers/admin";

const AdminSidebar = (props) => {
  const dispatch = useDispatch();
  const showAdminSidebar = useSelector(
    (state) => state.admin.ui.showAdminSidebar
  );
  const { pathname, navLinks } = props;
  const closeSidebarHandler = (val) => {
    dispatch(adminActions.toggleSidebar(val));
  };

  return (
    <>
      {showAdminSidebar && (
        <div
          className="fixed top-0 bottom-0 left-0 px-4 overflow-y-auto text-center bg-gray-700 z-50  animate-slideRight"
          onClick={(event) => event.stopPropagation()}
        >
          <Cross
            className="w-4 h-4 text-white ml-auto mt-4 cursor-pointer"
            onClick={() => closeSidebarHandler(false)}
          />
          <div className="text-gray-100 text-xl">
            <div className="p-2.5 my-1 flex items-center ">
              <div className="font-bold text-gray-200 text-[15px] flex items-center gap-4">
                <div className="flex items-center">
                  <Image
                    src="/images/better_buys.png"
                    className="rounded-full"
                    alt="logo"
                    width={53}
                    height={50}
                  ></Image>
                </div>{" "}
                <h1 className="text-base md:text-[0.94rem]">Better Buys</h1>
              </div>
            </div>
            <div className="my-2 bg-gray-600 h-[1px]"></div>
          </div>

          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              className={[
                `p-2.5 my-2 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-500 text-white`,
                link.path === pathname ? "bg-blue-600" : "",
              ].join(" ")}
              href={link.path}
            >
              <span className="text-[15px] ml-4 text-gray-200">
                {link.title}
              </span>
            </NavLink>
          ))}
        </div>
      )}

      <div
        onClick={(event) => {
          event.stopPropagation();
          closeSidebarHandler(true);
        }}
        className="absolute top-16 left-2"
      >
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-[0.65rem] px-2 py-2 md:text-xs md:px-3 md:py-2 text-center flex items-center gap-2 focus:bg-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ strokeWidth: "1.5" }}
            stroke="currentColor"
            className="w-5 h-[1.1rem]"
          >
            <path
              style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
          Open Sidebar
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;
