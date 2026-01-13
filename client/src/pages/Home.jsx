import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import hero1 from "../assets/hero1.png";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchListings = async () => {
      try {
        setLoading(true);

        const requests = [
          fetch(`${API_URL}/api/listing/get?offer=true`),
          fetch(`${API_URL}/api/listing/get?type=rent`),
          fetch(`${API_URL}/api/listing/get?type=sale`),
        ];

        const [offerRes, rentRes, saleRes] = await Promise.all(requests);

        if (!offerRes.ok || !rentRes.ok || !saleRes.ok) {
          throw new Error("One or more listing requests failed");
        }

        const offerData = await offerRes.json();
        const rentData = await rentRes.json();
        const saleData = await saleRes.json();

        setOfferListings(offerData?.listings || offerData || []);
        setRentListings(rentData?.listings || rentData || []);
        setSaleListings(saleData?.listings || saleData || []);
      } catch (err) {
        console.error("Fetch listings error:", err);
        setOfferListings([]);
        setRentListings([]);
        setSaleListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="px-4 max-w-6xl mx-auto py-20 sm:py-10">
      {/* hero*/}
      <div className="flex flex-col md:flex-row items-center gap-10 py-28">
        <div className="w-full md:w-1/2">
          <h1 className="text-slate-700 font-bold text-2xl lg:text-4xl leading-tight">
            Find your next <span className="text-slate-500">perfect</span>{" "}
            <br />
            place with ease.
          </h1>

          <p className="text-gray-500 text-base mt-4 mb-6 max-w-xl">
            Discover homes, apartments, and properties that fit your lifestyle
            and budget. Whether you’re buying or renting, we make it easy to
            find verified listings in the right locations — no stress, no wasted
            time.
          </p>

          <Link
            to="/search"
            className="inline-block text-blue-800 font-bold hover:underline"
          >
            Let’s get started →
          </Link>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={hero1}
            alt="Modern home in Lekki"
            className="w-full h-[420px] object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      </div>

      {/* Listings Sections */}
      <div className="py-16 flex flex-col gap-12">
        {/* Offer Section */}
        {offerListings?.length > 0 && (
          <div>
            <div className="flex flex-col mb-4 gap-1">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                to="/search?offer=true"
                className="text-sm text-blue-800 hover:underline cursor-pointer"
              >
                Show me offers →
              </Link>
            </div>

            <div className="flex gap-4 flex-wrap">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Rent Section */}
        {rentListings?.length > 0 && (
          <div>
            <div className="flex flex-col mb-4 gap-1">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places for Rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-sm text-blue-800 hover:underline cursor-pointer"
              >
                Show me places for rent →
              </Link>
            </div>

            <div className="flex gap-4 flex-wrap">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Sale Section */}
        {saleListings?.length > 0 && (
          <div>
            <div className="flex flex-col mb-4 gap-1">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Properties for Sale
              </h2>
              <Link
                to="/search?type=sale"
                className="text-sm text-blue-800 hover:underline cursor-pointer"
              >
                Show me properties for sale →
              </Link>
            </div>

            <div className="flex gap-4 flex-wrap">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
