import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { userActions } from "../utils/store/reducers/user";
import Cross from "./svg/Cross";

const Sidebar = (props) => {
  const dispatch = useDispatch();

  const closeSidebarHandler = (val) => {
    dispatch(userActions.toggleSidebar(val));
  };

  return (
    <div className="w-60 h-full shadow-md bg-gray-50 fixed z-40 animate-slideRight">
      <Cross
        className="w-5 h-5 text-black ml-auto mt-4 mx-4 cursor-pointer"
        onClick={() => closeSidebarHandler(false)}
      />
      <div className="py-2 px-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <Image
              src="/images/better_buys.png"
              className="rounded-full"
              alt="logo"
              width={55}
              height={55}
            ></Image>
          </div>
          <div className="grow ml-3">
            <Link href="/">
              <a
                className="text-base font-semibold text-blue-600"
                onClick={() => dispatch(userActions.toggleSidebar(false))}
              >
                Better Buys
              </a>
            </Link>
          </div>
        </div>
      </div>
      <hr />

      <div>
        <h2 className="text-gray-800 py-2 px-7 mb-2 bg-gray-200">Categories</h2>

        <ul className="relative px-1">
          <li
            className="relative"
            onClick={() => dispatch(userActions.toggleSidebar(false))}
          >
            <Link href="/search">
              <a className="flex items-center text-sm py-4 pl-12 pr-6 h-6 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-blue-600 hover:bg-blue-100 ">
                All
              </a>
            </Link>
          </li>
          {props.categories.map((category, index) => (
            <li
              key={index}
              className="relative"
              onClick={() => dispatch(userActions.toggleSidebar(false))}
            >
              <Link
                href={`/search?category=${
                  category.charAt(0).toLowerCase() + category.slice(1)
                }`}
              >
                <a className="flex items-center text-sm py-4 pl-12 pr-6 h-6 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-blue-600 hover:bg-blue-100 ">
                  {category}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
