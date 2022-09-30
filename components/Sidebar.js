import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { userActions } from "../utils/store/reducers/user";
import Cross from "./svg/Cross";

const Sidebar = (props) => {
  const dispatch = useDispatch();
  //   const [currentSelection, setCurrentSelection] = useState(null);

  const closeSidebarHandler = (val) => {
    dispatch(userActions.toggleSidebar(val));
  };

  return (
    <div className="w-60 h-full shadow-md bg-gray-50 fixed z-50 animate-slideRight">
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
          {props.categories.map((category, index) => (
            <li key={index} className="relative">
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
          {/* {sidebarLinkData.map((mainLink, index1) => (
            <li className="relative" id="sidenavSecEx2" key={index1 + 1}>
              <div
                className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-blue-600 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  if (currentSelection === index1 + 1) {
                    setCurrentSelection(null);
                  } else {
                    setCurrentSelection(index1 + 1);
                  }
                }}
              >
                <span>{mainLink.title}</span>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  className="w-3 h-3 ml-auto"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                  ></path>
                </svg>
              </div>
              <ul className="relative">
                {mainLink.subCategories.map((link, index2) => {
                  if (currentSelection === index1 + 1) {
                    return (
                      <li
                        key={index2 + 1}
                        className="relative animate-slideRight"
                      >
                        <Link
                          href={`/search?category=${link.category}&subcategory=${link.subCategory}`}
                        >
                          <a className="flex items-center text-xs py-4 pl-12 pr-6 h-6 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-blue-600 hover:bg-blue-100 ">
                            {link.title}
                          </a>
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            </li>
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
