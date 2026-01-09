import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <header className="bg-slate-200 shadow-md overflow-x-hidden fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold sm:text-xl flex flex-wrap">
            Kaida<span className="text-slate-500">Heavens</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center min-w-0">
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64 min-w-0"
            type="text"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-500 cursor-pointer" />
        </form>

        <ul className="flex flex-wrap gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline font-semibold">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline font-semibold">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar ?? currentUser.user?.avatar}
                alt="profile image"
              />
            ) : (
              <li className="hidden sm:inline text-slate-700 hover:underline font-semibold">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
