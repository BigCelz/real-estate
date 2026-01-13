import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Toast from "../components/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiFetch } from "../utils/api";

export default function CreateListing() {
  return (
    <main className="p-3 py-20 max-w-4xl mx-auto py-20 sm:py-10">
      <h1 className="text-3xl my-7 font-semibold text-center">
        Update a Listing
      </h1>
      <UpdateListingForm />
    </main>
  );
}

function UpdateListingForm() {
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
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await apiFetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          console.log(data.message);
          return;
        }

        setFormData({
          name: data.listing.name || "",
          description: data.listing.description || "",
          address: data.listing.address || "",
          regularPrice: data.listing.regularPrice || "",
          discountPrice: data.listing.discountPrice || "",
          bathrooms: data.listing.bathrooms || "",
          bedrooms: data.listing.bedrooms || "",
          furnished: data.listing.furnished || false,
          parking: data.listing.parking || false,
          offer: data.listing.offer || false,
          sale: data.listing.sale || false,
          rent: data.listing.rent || false,
        });

        setExistingImages(data.listing.images || []);
        setPreviews(data.listing.images || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (listingId) fetchListing();
  }, [listingId]);

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
    const combined = [...images, ...files].slice(0, 6 - existingImages.length);
    setImages(combined);

    // combine existing images URLs + new file previews
    setPreviews([
      ...existingImages,
      ...combined.map((f) => URL.createObjectURL(f)),
    ]);

    if (files.length + images.length + existingImages.length > 6)
      setToast({
        message: "Max 6 images allowed. Excess ignored.",
        type: "error",
      });
  };

  const removeImage = (i) => {
    if (i < existingImages.length) {
      // removing an existing image
      const nextExisting = existingImages.filter((_, idx) => idx !== i);
      setExistingImages(nextExisting);
      setPreviews([
        ...nextExisting,
        ...images.map((f) => URL.createObjectURL(f)),
      ]);
    } else {
      // removing a new file
      const fileIndex = i - existingImages.length;
      const nextFiles = images.filter((_, idx) => idx !== fileIndex);
      setImages(nextFiles);
      setPreviews([
        ...existingImages,
        ...nextFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setToast({
        message: "Please sign in to update a listing.",
        type: "error",
      });
      return;
    }

    if (
      (!existingImages || existingImages.length === 0) &&
      (!images || images.length === 0)
    ) {
      setToast({ message: "Please upload at least one image.", type: "error" });
      return;
    }

    // price validation...
    const regular = Number(formData.regularPrice);
    if (!Number.isFinite(regular) || regular <= 0) {
      setToast({
        message: "Regular price must be a positive number.",
        type: "error",
      });
      return;
    }
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
      // Upload new images if any
      let imageUrls = [];
      if (images.length > 0) {
        const fd = new FormData();
        images.forEach((f) => fd.append("images", f));
        const res = await apiFetch(`/api/listing/upload-images`, {
          method: "POST",
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
        images: [...existingImages, ...imageUrls],
        type: formData.type,
      };

      const res = await apiFetch(`/api/listing/update/${listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        setToast({ message: txt || "Update listing failed", type: "error" });
        setLoading(false);
        return;
      }

      const resJson = await res.json();
      if (!resJson.success) {
        setToast({
          message: resJson.message || "Update listing failed",
          type: "error",
        });
        setLoading(false);
        return;
      }

      setToast({ message: "Listing updated successfully", type: "success" });
      setTimeout(() => navigate(`/listing/${resJson.listing._id}`), 700);
    } catch (err) {
      console.error(err);
      setToast({ message: "Unexpected error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-4"> 
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
              {!formData.sale && <span className="text-sm">₦/month</span>}
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
                {!formData.sale && <span className="text-sm">₦/month</span>}
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
              {loading ? "Updating..." : "Update Listing"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
