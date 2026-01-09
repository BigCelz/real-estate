import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl my-7 font-semibold text-center">
        Create Listing
      </h1>
      <CreateListingForm />
    </main>
  );
}

function CreateListingForm() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: "",
    discountPrice: "",
    bathrooms: "",
    bedrooms: "",
    furnished: false,
    parking: false,
    offer: false,
    type: "rent",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      // if offer is unchecked, clear discount price
      if (id === "offer" && checked === false) {
        setFormData((s) => ({ ...s, [id]: checked, discountPrice: "" }));
        return;
      }
      // make rent/sale mutually exclusive: checking one unchecks the other
      if (id === "sale" && checked === true) {
        setFormData((s) => ({ ...s, sale: true, rent: false, type: "sale" }));
        return;
      }
      if (id === "rent" && checked === true) {
        setFormData((s) => ({ ...s, rent: true, sale: false, type: "rent" }));
        return;
      }
      setFormData((s) => ({ ...s, [id]: checked }));
    } else if (type === "number") {
      const numeric = value === "" ? "" : Number(value);
      setFormData((s) => ({ ...s, [id]: numeric }));
    } else setFormData((s) => ({ ...s, [id]: value }));
  };

  const handleFiles = (e) => {
    if (!currentUser) {
      setToast({ message: "Please sign in to upload images.", type: "error" });
      return;
    }
    const files = Array.from(e.target.files || []);
    const combined = [...images, ...files].slice(0, 6);
    setImages(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
    if (files.length + images.length > 6)
      setToast({
        message: "Max 6 images allowed. Excess ignored.",
        type: "error",
      });
  };

  const removeImage = (i) => {
    const next = images.filter((_, idx) => idx !== i);
    setImages(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setToast({
        message: "Please sign in to create a listing.",
        type: "error",
      });
      return;
    }
    // validation: must have at least one image
    if (!images || images.length === 0) {
      setToast({ message: "Please upload at least one image.", type: "error" });
      return;
    }

    // validation: regularPrice must be numeric
    const regular = Number(formData.regularPrice);
    if (!Number.isFinite(regular) || regular <= 0) {
      setToast({
        message: "Regular price must be a positive number.",
        type: "error",
      });
      return;
    }

    // if offer is enabled, discountPrice must be numeric and lower than regular
    if (formData.offer) {
      const discount = Number(formData.discountPrice);
      if (!Number.isFinite(discount) || discount <= 0) {
        setToast({
          message: "Discounted price must be a positive number.",
          type: "error",
        });
        return;
      }
      if (!(discount < regular)) {
        setToast({
          message: "Discounted price must be lower than regular price.",
          type: "error",
        });
        return;
      }
    }
    setLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        const fd = new FormData();
        images.forEach((f) => fd.append("images", f));
        const res = await fetch(`/api/listing/upload-images`, {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        if (!res.ok) {
          const txt = await res.text();
          setToast({ message: txt || "Image upload failed", type: "error" });
          setLoading(false);
          return;
        }
        const d = await res.json();
        imageUrls = d.images || [];
      }

      const payload = {
        ...formData,
        regularPrice: Number(formData.regularPrice),
        discountPrice: formData.offer
          ? Number(formData.discountPrice)
          : undefined,
        images: imageUrls,
        type: formData.type, 
      };
      const res = await fetch(`/api/listing/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        setToast({ message: txt || "Create listing failed", type: "error" });
        setLoading(false);
        return;
      }
      const resJson = await res.json();
      if (!resJson.success) {
        setToast({
          message: resJson.message || "Create listing failed",
          type: "error",
        });
        setLoading(false);
        return;
      }

      setToast({ message: "Listing created", type: "success" });
      setTimeout(() => navigate(`/listing/${resJson.listing._id}`), 700);
    } catch (err) {
      console.error(err);
      setToast({ message: "Unexpected error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <input
          id="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          className="border p-3 rounded-lg w-full"
          placeholder="name"
          required
        />
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded-lg resize-none w-full"
          placeholder="description"
          rows="4"
          required
        />
        <input
          id="address"
          value={formData.address}
          onChange={handleChange}
          type="text"
          className="border p-3 rounded-lg w-full"
          placeholder="address"
          required
        />

        <div className="flex gap-6 flex-wrap">
          <label className="flex gap-2 items-center">
            <input
              id="sale"
              type="checkbox"
              className="w-5"
              checked={formData.sale || false}
              onChange={handleChange}
            />
            Sell
          </label>
          <label className="flex gap-2 items-center">
            <input
              id="rent"
              type="checkbox"
              className="w-5"
              checked={formData.rent || false}
              onChange={handleChange}
            />
            Rent
          </label>
          <label className="flex gap-2 items-center">
            <input
              id="parking"
              type="checkbox"
              className="w-5"
              checked={formData.parking}
              onChange={handleChange}
            />
            Parking
          </label>
          <label className="flex gap-2 items-center">
            <input
              id="furnished"
              type="checkbox"
              className="w-5"
              checked={formData.furnished}
              onChange={handleChange}
            />
            Furnished
          </label>
          <label className="flex gap-2 items-center">
            <input
              id="offer"
              type="checkbox"
              className="w-5"
              checked={formData.offer}
              onChange={handleChange}
            />
            Offer
          </label>
        </div>

        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <input
              id="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              type="number"
              min={1}
              max={10}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <span>Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              type="number"
              min={1}
              max={10}
              required
              className="p-3 border border-gray-300 rounded-lg"
            />
            <span>Baths</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="regularPrice"
              value={formData.regularPrice}
              onChange={handleChange}
              type="number"
              required
              min={0}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <div className="flex flex-col items-center">
              <p>Regular Price</p>
              {!formData.sale && <span className="text-sm">($/month)</span>}
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                id="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                type="number"
                required={formData.offer}
                min={0}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                {!formData.sale && <span className="text-sm">($/month)</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-4 min-w-0">
        <p className="font-semibold">
          Images:{" "}
          <span className="font-normal text-gray-600">
            The first image will be the cover (max 6).
          </span>
        </p>

        <div className="flex gap-4 flex-col">
          {/* Note: the first image in `images` (and `previews`) is treated as the cover image for the listing */}
          <label
            htmlFor="images"
            className="flex items-center justify-center gap-2 w-full p-3 border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition min-w-0"
          >
            <FiUpload className="text-xl text-gray-600" />
            <span className="text-gray-600 font-medium">Select images</span>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
          </label>

          <div className="flex gap-2 flex-wrap">
            {previews.map((p, i) => (
              <div key={i} className="relative">
                <img
                  src={p}
                  alt={`preview-${i}`}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 whitespace-nowrap w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
