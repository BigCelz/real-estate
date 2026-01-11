import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);

        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch("/api/listing/get?offer=true"),
          fetch("/api/listing/get?type=rent"),
          fetch("/api/listing/get?type=sale"),
        ]);

        const offerData = await offerRes.json();
        const rentData = await rentRes.json();
        const saleData = await saleRes.json();

        setOfferListings(offerData.listings || offerData);
        setRentListings(rentData.listings || rentData);
        setSaleListings(saleData.listings || saleData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);


  return (
    <div className="px-4 max-w-6xl mx-auto">
      {/* hero*/}
      <div className="flex flex-col md:flex-row items-center gap-10 py-28">
        <div className="w-full md:w-1/2">
          <h1 className="text-slate-700 font-bold text-2xl lg:text-5xl leading-tight">
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

        <div className="w-full md:w-1/2">
          <Swiper navigation className="rounded-lg overflow-hidden">
            {loading && (
              <SwiperSlide>
                <div className="h-[420px] flex items-center justify-center bg-slate-200">
                  Loading offers...
                </div>
              </SwiperSlide>
            )}

            {!loading &&
              offerListings?.length > 0 &&
              offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div
                    className="h-[420px]"
                    style={{
                      backgroundImage: `url(${listing.images?.[0]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>

      {/* MORE SECTIONS BELOW */}
      <div className="py-16">
        {/* rent / sale / featured sections go here */}
      </div>
    </div>
  );
}
