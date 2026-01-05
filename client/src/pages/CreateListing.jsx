import React from "react";
import { FiUpload } from "react-icons/fi";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl my-7 font-semibold text-center">
        Create Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-4">
        {/* first div */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <input
            type="text"
            className="border p-3 rounded-lg w-full"
            placeholder="name"
            id="name"
            required
          />
          <textarea
            className="border p-3 rounded-lg resize-none w-full"
            placeholder="description"
            id="description"
            rows="4"
            required
          />

          <input
            type="text"
            className="border p-3 rounded-lg w-full"
            placeholder="address"
            id="address"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={"1"}
                max={"10"}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={"1"}
                max={"10"}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Baths</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-sm">($/month)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-sm">($/month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* second div */}
        <div className="flex flex-col flex-1 gap-4 min-w-0">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6).
            </span>
          </p>

          <div className="flex gap-4">
            <label
              htmlFor="images"
              className="flex items-center justify-center gap-2 w-full p-3 border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition min-w-0"
            >
              <FiUpload className="text-xl text-gray-600" />
              <span className="text-gray-600 font-medium">Upload images</span>

              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="hidden"
              />
            </label>

            <button className="p-3 cursor-pointer bg-green-700 text-white rounded-lg uppercase hover:opacity-95 whitespace-nowrap w-full sm:w-auto">
              Upload Images
            </button>
          </div>
          <button className="p-3 cursor-pointer bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 whitespace-nowrap w-full sm:w-auto">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
