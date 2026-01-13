import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { IoLocationOutline, IoLocationSharp } from "react-icons/io5";
import {
  FaBath,
  FaBed,
  FaCar,
  FaChair,
  FaHome,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import { apiFetch } from "../utils/api";

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState();
  const [contact, setContact] = useState(false);
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);

  // useEffect(() => {
  //   const fetchListing = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch(`/api/listing/get/${listingId}`);
  //       const data = await res.json();
  //       if (!res.ok || data.success === false) {
  //         setError(true);
  //         return;
  //       }
  //       setListing(data.listing);
  //     } catch (error) {
  //       setError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchListing();
  // }, [listingId]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(true);
          return;
        }
        setListing(data.listing);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) fetchListing();
  }, [listingId]);

  return (
    <main className="py-10 sm:py-30">
      {loading && <p className="text-center my-7 text-xl">Loading...</p>}

      {error && (
        <p className="text-center my-7 text-red-700 text-xl">
          Something went wrong
        </p>
      )}

      {listing?.images?.length > 0 && (
        <>
          <Swiper navigation>
            {listing.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className="w-full md:h-[550px] h-[400px] "
                  style={{
                    background: `url(${img}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="fixed top-[13%] right-[3%] z-10 flex flex-col items-end gap-2">
            <button
              className="border border-slate-300 rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer hover:bg-slate-200 transition"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <FaShare className="text-slate-600" />
            </button>

            {/* Copied link notification */}
            <div
              className={`transform transition-all duration-300 ${
                copied
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              } bg-slate-100 text-slate-800 rounded-md p-2 shadow-md`}
            >
              Link Copied!
            </div>
          </div>
        </>
      )}

      {listing ? (
        <div className="max-w-6xl mx-auto p-4 mt-6">
          <p className="text-xl font-semibold">
            {listing.name} -{" "}
            {listing.offer ? (
              <>
                <span className="text-red-500 line-through mr-2">
                  ₦{listing.regularPrice.toLocaleString()}
                </span>
                <span className="text-green-700 text-2xl">
                  ₦{listing.discountPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-green-700 text-2xl">
                ₦{listing.regularPrice.toLocaleString()}
              </span>
            )}{" "}
            {listing.type === "rent" && "/Year"}
          </p>

          <p className="text-sm text-gray-700 flex items-center gap-2 mt-2">
            <IoLocationOutline className="text-green-700" />
            <span className="text-slate-700">{listing.address}</span>
          </p>

          <div className="mt-2 mb-3">
            <p
              className={`w-full max-w-[200px] text-white text-center p-2 rounded-md ${
                listing.type === "rent" ? "bg-blue-700" : "bg-red-900"
              }`}
            >
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
          </div>

          <p className="text-slate-800 mt-2">
            <span className="text-black font-semibold ">Description:</span>{" "}
            {listing.description}
          </p>

          <ul className="text-green-900 font-semibold text-sm items-center flex gap-4 md:gap-6 mt-2 flex-wrap">
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaBed className="text-lg" />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaBath className="text-lg" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaCar className="text-lg" />
              {listing.parking ? "Parking Spot" : "No Parking Spot"}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaChair className="text-lg" />
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </li>
          </ul>

          {currentUser &&
            !contact &&
            String(listing.userRef) !== String(currentUser._id) && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-800 mt-4 text-white rounded-lg uppercase hover:bg-slate-900 transition p-4 w-full font-semibold"
              >
                Contact Landlord
              </button>
            )}

          {contact && <Contact listing={listing} />}

          {!currentUser && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Sign in to contact the landlord
            </p>
          )}
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-500">Loading listing...</p>
      )}
    </main>
  );
}
