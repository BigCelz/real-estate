import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);

    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);


  return (
    <header className="bg-slate-200 shadow-md overflow-x-hidden fixed top-0 left-0 w-full z-50">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto p-3 gap-2">
        {/* Brand */}
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl flex whitespace-nowrap">
            Kaida<span className="text-slate-500">Heavens</span>
          </h1>
        </Link>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center w-full sm:w-auto min-w-0"
        >
          <input
            className="bg-transparent focus:outline-none flex-1 min-w-0 px-2 py-1 sm:w-64"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="cursor-pointer px-2">
            <FaSearch className="text-slate-500" />
          </button>
        </form>

        {/* Links */}
        <ul className="flex  gap-4 items-center justify-center sm:justify-end w-full sm:w-auto flex-nowrap">
          <Link to="/">
            <li className="text-slate-700 hover:underline font-semibold">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hover:underline font-semibold">
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
              <li className="text-slate-700 hover:underline font-semibold">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
