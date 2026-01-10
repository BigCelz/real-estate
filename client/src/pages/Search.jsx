import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";

export default function Search() {
  const [sidebar, setSidebar] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    discounted: false,
    sort: "created_at",
    order: "desc",
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Build query params like Postman
  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("searchTerm", sidebar.searchTerm || "");
    params.set("type", sidebar.type);
    params.set("parking", sidebar.parking ? "true" : "false");
    params.set("furnished", sidebar.furnished ? "true" : "false");
    params.set("discounted", sidebar.discounted ? "true" : "false");
    params.set("sort", sidebar.sort);
    params.set("order", sidebar.order);
    return params.toString();
  };

  // Fetch listings
  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = buildQuery();
      const res = await fetch(`/api/listing/get?${query}`);
      const data = await res.json();
      setListings(data.listings || data || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sort") {
      const parts = value.split("_");
      const order = parts.pop();
      const sort = parts.join("_");
      setSidebar((prev) => ({ ...prev, sort, order }));
      return;
    }

    setSidebar((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = buildQuery();
    navigate(`/search?${query}`);
    fetchListings();
  };

  // On mount, read URL params if any
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      setSidebar({
        searchTerm: params.get("searchTerm") || "",
        type: params.get("type") || "all",
        parking: params.get("parking") === "true",
        furnished: params.get("furnished") === "true",
        discounted: params.get("discounted") === "true",
        sort: params.get("sort") || "created_at",
        order: params.get("order") || "desc",
      });
      fetchListings();
    }
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 py-4">
      {/* Left filters */}
      <div className="md:w-80 w-full bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Filter Listings
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Search */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Search</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={sidebar.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700">Type</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {["all", "rent", "sale"].map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="type"
                    id="type"
                    value={t}
                    checked={sidebar.type === t}
                    onChange={handleChange}
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700">Amenities</p>
            <div className="flex gap-4 text-sm text-slate-600">
              {["parking", "furnished"].map((a) => (
                <label
                  key={a}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={a}
                    className="w-4 h-4"
                    checked={sidebar[a]}
                    onChange={handleChange}
                  />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Discounted */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700">Pricing</p>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                id="discounted"
                checked={sidebar.discounted}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Discounted offers only
            </label>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">
              Sort by
            </label>
            <select
              id="sort"
              value={`${sidebar.sort}_${sidebar.order}`}
              onChange={handleChange}
              className="border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="created_at_desc">Latest</option>
              <option value="created_at_asc">Oldest</option>
              <option value="price_asc">Price low to high</option>
              <option value="price_desc">Price high to low</option>
            </select>
          </div>

          <button className="bg-slate-800 text-white p-3 rounded-lg uppercase font-semibold tracking-wide hover:bg-slate-900 transition">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Right listings */}
      <div className="flex-1 max-w-6xl mx-auto p-4 py-12">
        <h1 className="text-2xl font-semibold border-b border-slate-200 p-6 text-slate-800 bg-white mb-6">
          Listing Results
        </h1>

        {loading && (
          <p className="text-center text-gray-500">Loading listings...</p>
        )}
        {!loading && listings.length === 0 && (
          <p className="text-center text-gray-500">No listings found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              to={`/listing/${listing._id}`}
              key={listing._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={listing.images?.[0] || "/placeholder.png"}
                alt={listing.name || listing.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-lg font-semibold text-slate-800">
                  {listing.name || listing.title}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <IoLocationOutline className="text-green-700" />
                  {listing.address || listing.location}
                </p>
                <p className="text-green-700 font-bold text-lg flex items-center gap-2">
                  {listing.offer ? (
                    <>
                      <span>₦{listing.discountPrice?.toLocaleString()}</span>
                      <span className="line-through text-gray-400 text-sm">
                        ₦
                        {(
                          listing.regularPrice || listing.price
                        )?.toLocaleString()}
                      </span>
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                        {listing.regularPrice
                          ? `${Math.round(
                              ((listing.regularPrice - listing.discountPrice) /
                                listing.regularPrice) *
                                100
                            )}% Off`
                          : "Off"}
                      </span>
                    </>
                  ) : (
                    <>
                      ₦
                      {(
                        listing.regularPrice || listing.price
                      )?.toLocaleString()}
                    </>
                  )}
                  {listing.type === "rent" && " / Year"}
                </p>

                <span
                  className={`w-fit text-xs px-3 py-2 rounded-lg text-white ${
                    listing.type === "rent" ? "bg-blue-700" : "bg-red-800"
                  }`}
                >
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
