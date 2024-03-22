import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface NavbarComponentProps {
  children: ReactNode;
}

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 mb-4">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to={"/"}
            className="flex items-center space-x-3 rtl:space-x-reverse text-white text-lg font-bold md:hover:text-green-700"
          >
            Home
          </Link>
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            data-collapse-toggle="navbar-solid-bg"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-solid-bg"
            aria-expanded={isOpen}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } w-full md:block md:w-auto`}
            id="navbar-solid-bg"
          >
            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
              <li>
                <Link
                  to={"/history"}
                  className="flex items-center space-x-3 rtl:space-x-reverse text-white md:hover:text-green-700"
                >
                  Transaction History
                </Link>
              </li>
              <li>
                <Link
                  to={"/saveTransactionForms"}
                  className="flex items-center space-x-3 rtl:space-x-reverse text-white md:hover:text-green-700"
                >
                  Save Transaction
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};
