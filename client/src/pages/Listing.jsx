import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
          setError(true);
          return;
        }
        setListing(data.listing);
        console.log(data.listing);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-xl">Loading...</p>}

      {error && (
        <p className="text-center my-7 text-red-700 text-xl">
          Something went wrong
        </p>
      )}

      {listing?.images?.length > 0 && (
        <Swiper navigation>
          {listing.images.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </main>
  );
}
