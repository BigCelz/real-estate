import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";

export default function ListingItem({ listing }) {
  //   return (
  //     <Link
  //       to={`/listing/${listing._id}`}
  //       className="group bg-white w-[300px] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
  //     >
  //       {/* Image */}
  //       <div className="relative">
  //         <img
  //           src={listing.images?.[0] || "/placeholder.png"}
  //           alt={listing.name || listing.title}
  //           className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
  //         />

  //         {listing.offer && (
  //           <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
  //             Offer
  //           </span>
  //         )}
  //       </div>

  //       {/* Content */}
  //       <div className="p-4 flex flex-col gap-2">
  //         <h3 className="text-base font-semibold text-slate-800 truncate">
  //           {listing.name || listing.title}
  //         </h3>

  //         <p className="text-sm text-gray-600 flex items-center gap-1">
  //           <IoLocationOutline className="text-green-700" />
  //           {listing.address || listing.location}
  //         </p>

  //         {/* Price */}
  //         <div className="flex items-center gap-2 mt-1">
  //           {listing.offer ? (
  //             <>
  //               <span className="text-green-700 font-bold text-base">
  //                 ₦{listing.discountPrice?.toLocaleString()}
  //               </span>
  //               <span className="text-sm text-gray-400 line-through">
  //                 ₦{listing.regularPrice?.toLocaleString()}
  //               </span>
  //               <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded whitespace-nowrap">
  //                 {Math.round(
  //                   ((listing.regularPrice - listing.discountPrice) /
  //                     listing.regularPrice) *
  //                     100
  //                 )}
  //                 % off
  //               </span>
  //             </>
  //           ) : (
  //             <span className="text-green-700 font-bold text-base">
  //               ₦{(listing.regularPrice || listing.price)?.toLocaleString()}
  //             </span>
  //           )}

  //           {listing.type === "rent" && (
  //             <span className="text-sm text-gray-500 whitespace-nowrap">/ year</span>
  //           )}
  //         </div>

  //         {/* Tag */}
  //         <span
  //           className={`w-fit mt-2 text-xs px-3 py-1 rounded-full text-white whitespace-nowrap ${
  //             listing.type === "rent" ? "bg-blue-700" : "bg-red-800"
  //           }`}
  //         >
  //           {listing.type === "rent" ? "For Rent" : "For Sale"}
  //         </span>
  //       </div>
  //     </Link>
  //   );

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="group bg-white w-full sm:w-[260px] md:w-[280px] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={listing.images?.[0] || "/placeholder.png"}
          alt={listing.name || listing.title}
          className="h-44 sm:h-48 md:h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {listing.offer && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Offer
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">
          {listing.name || listing.title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
          <IoLocationOutline className="text-green-700" />
          {listing.address || listing.location}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          {listing.offer ? (
            <>
              <span className="text-green-700 font-bold text-sm sm:text-base">
                ₦{listing.discountPrice?.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₦{listing.regularPrice?.toLocaleString()}
              </span>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded whitespace-nowrap">
                {Math.round(
                  ((listing.regularPrice - listing.discountPrice) /
                    listing.regularPrice) *
                    100
                )}
                % off
              </span>
            </>
          ) : (
            <span className="text-green-700 font-bold text-sm sm:text-base">
              ₦{(listing.regularPrice || listing.price)?.toLocaleString()}
            </span>
          )}

          {listing.type === "rent" && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              / year
            </span>
          )}
        </div>

        {/* Tag */}
        <span
          className={`w-fit mt-2 text-[11px] sm:text-xs px-3 py-1 rounded-full text-white whitespace-nowrap ${
            listing.type === "rent" ? "bg-blue-700" : "bg-red-800"
          }`}
        >
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>
    </Link>
  );
}
