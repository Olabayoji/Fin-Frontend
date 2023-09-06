import { MdAnalytics } from "react-icons/md";
import SearchBar from "./SearchBar";
import { Link, NavLink } from "react-router-dom";

type Props = {};

const Navbar = (props: Props) => {
  const linkStyle =
    "block  w-fit    text-white   text-sm pb-2  border-b-2 border-b-transparent    hover:text-[rgba(255,255,255,0.5)] duration-1000";
  const activeLinkStyle =
    "block  w-fit  text-white pb-2 border-b-2 border-b-white text-sm";
  return (
    <>
      <nav className="bg-slate-800  border-gray-200 dark:bg-gray-900 fixed w-full z-50">
        <div className="max-w-[1720px] flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to={"/"} className="flex items-center text-white">
            <MdAnalytics className="w-5 h-5 md:w-8 md:h-8 dark:text-white mr-1" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              FinAnalysis
            </span>
          </Link>
          <SearchBar />
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
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
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium grid grid-cols-2 gap-x-4 items-center">
              <li className="w-fit p-2">
                <NavLink
                  className={(navData) =>
                    navData.isActive ? activeLinkStyle : linkStyle
                  }
                  to={"/"}
                >
                  Stock Analysis
                </NavLink>
              </li>
              <li className="w-fit p-2">
                <NavLink
                  className={(navData) =>
                    navData.isActive ? activeLinkStyle : linkStyle
                  }
                  to={"/rule-builder"}
                >
                  Rule Builder
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
