import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!listing?.userRef) return;

    const fetchLandlord = async () => {
      try {
        const res = await apiFetch(`/api/user/${listing.userRef}/public`, {
          method: "GET",
        });
        const data = await res.json();
        setLandlord(data.user);
        console.log(data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing?.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="mt-4 p-4 border border-slate-300 rounded-lg bg-slate-50 max-w-6xl mx-auto flex flex-col gap-4 py-30 sm:py-10">
          <p className="text-lg text-slate-800">
            Contact{" "}
            <span className="font-semibold text-slate-900">
              {landlord.username}
            </span>{" "}
            for{" "}
            <span className="font-semibold text-slate-900">{listing.name}</span>
          </p>

          <textarea
            name="message"
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <Link
            to={`mailto:${landlord.username}?subject=Regarding${listing.name}&body=${message}`}
            className="bg-slate-800 text-white text-center uppercase font-semibold rounded-lg py-3 w-full hover:bg-slate-900 transition"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
