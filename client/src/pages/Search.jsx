import React from "react";

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 py-4">
      {/* left div*/}
      <div className="md:w-80 w-full bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Filter Listings
        </h2>

        <form className="flex flex-col gap-6">
          {/* Search term */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Search</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Location, name, keyword..."
              className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700">Type</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="all" className="w-4 h-4" />
                Rent & Sale
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="rent" className="w-4 h-4" />
                Rent
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="sale" className="w-4 h-4" />
                Sale
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="offer" className="w-4 h-4" />
                Offer
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700">Amenities</p>
            <div className="flex gap-4 text-sm text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="parking" className="w-4 h-4" />
                Parking
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="furnished" className="w-4 h-4" />
                Furnished
              </label>
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">
              Sort by
            </label>
            <select
              className="border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
              id="sort_order"
            >
              <option>Latest</option>
              <option>Oldest</option>
              <option>Price low to high</option>
              <option>Price high to low</option>
            </select>
          </div>

          {/* Button */}
          <button className="bg-slate-800 text-white p-3 rounded-lg uppercase font-semibold tracking-wide hover:bg-slate-900 transition">
            Apply Filters
          </button>
        </form>
      </div>

      {/* right div*/}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold border-b border-slate-200 p-6 text-slate-800 bg-white">
          Listing Results
        </h1>

        {/* results grid goes here */}
        <div className="p-6">{/* cards */}</div>
      </div>
    </div>
  );
}

// gpt version
// import { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { IoLocationOutline } from "react-icons/io5";

// export default function Search() {
//   const location = useLocation();
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchListings = async () => {
//       setLoading(true);

//       const urlParams = new URLSearchParams(location.search);
//       const searchTerm = urlParams.get("searchTerm") || "";

//       const res = await fetch(`/api/listing/get?searchTerm=${searchTerm}`);
//       const data = await res.json();

//       setListings(data.listings || []);
//       setLoading(false);
//     };

//     fetchListings();
//   }, [location.search]);

//   return (
//     <div className="max-w-6xl mx-auto p-4 py-10">
//       {/* Page title */}
//       <h1 className="text-2xl font-semibold mb-4">Search Results</h1>
//       {loading && (
//         <p className="text-center text-gray-500">Loading listings...</p>
//       )}

//       {!loading && listings.length === 0 && (
//         <p className="text-center text-gray-500">No listings found</p>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {listings.map((listing) => (
//           <Link
//             to={`/listing/${listing._id}`}
//             key={listing._id}
//             className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
//           >
//             {/* Image */}
//             <img
//               src={listing.images[0]}
//               alt={listing.name}
//               className="h-48 w-full object-cover"
//             />

//             {/* Content */}
//             <div className="p-4 flex flex-col gap-2">
//               <p className="text-lg font-semibold text-slate-800">
//                 {listing.name}
//               </p>

//               <p className="text-sm text-gray-600 flex items-center gap-1">
//                 <IoLocationOutline className="text-green-700" />
//                 {listing.address}
//               </p>

//               <p className="text-green-700 font-bold text-lg">
//                 ₦
//                 {(listing.offer
//                   ? listing.discountPrice
//                   : listing.regularPrice
//                 ).toLocaleString()}
//                 {listing.type === "rent" && " / Year"}
//               </p>

//               <span
//                 className={`w-fit text-xs px-3 py-1 rounded-full text-white ${
//                   listing.type === "rent" ? "bg-blue-700" : "bg-red-800"
//                 }`}
//               >
//                 {listing.type === "rent" ? "For Rent" : "For Sale"}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
