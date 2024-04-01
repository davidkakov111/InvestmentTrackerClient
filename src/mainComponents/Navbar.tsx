import React, { ReactNode, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { SignOut } from "../Auth/SignOut";

interface NavbarComponentProps {
  children: ReactNode;
}

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {user, setUser} = useContext(UserContext);

  return (
    <>
      <nav className="border-y-2 border-green-600 bg-black mb-4">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to={"/"}
            className="flex items-center space-x-3 rtl:space-x-reverse text-green-300 text-lg font-bold md:hover:text-green-600"
          >
            Home
          </Link>
          <button
            title="navbarButton"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            data-collapse-toggle="navbar-solid-bg"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-green-300 rounded-lg md:hidden hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 dark:text-green-600 dark:focus:ring-green-600"
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
            <ul className="flex flex-col font-medium mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent md:dark:bg-transparent">
              {user.isAuthenticated ?  
                <>
                  <li>
                    <Link
                      to={"/statistics"}
                      className="flex items-center space-x-3 rtl:space-x-reverse text-green-300 md:hover:text-green-600"
                    >
                      Statistics
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/history"}
                      className="flex items-center space-x-3 rtl:space-x-reverse text-green-300 md:hover:text-green-600"
                    >
                      Transaction History
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/saveTransactionForms"}
                      className="flex items-center space-x-3 rtl:space-x-reverse text-green-300 md:hover:text-green-600"
                    >
                      Save Transaction
                    </Link>
                  </li>
                  <li>
                    <a
                      onClick={SignOut}
                      className="flex items-center space-x-3 rtl:space-x-reverse text-green-300 md:hover:text-green-600"
                    >
                      Sign Out
                    </a>
                  </li>
                </>
              :
                <>
                  <li>
                    <Link
                      to={"/signup"}
                      className="flex items-center space-x-3 rtl:space-x-reverse text-green-300 md:hover:text-green-600"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/signin"}
                      className="flex items-center space-x-3 rtl:space-x-reverse text-green-300 md:hover:text-green-600"
                    >
                      Sign In
                    </Link>
                  </li>
                </>
              }
            </ul>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};
