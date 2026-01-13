import React, { useRef, useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  userListingDeleteFailure,
  userListingDeleteStart,
  userListingDeleteSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const userId = currentUser?._id ?? currentUser?.user?._id ?? currentUser?.id;
  const initialAvatar =
    currentUser?.avatar ?? currentUser?.user?.avatar ?? null;
  const [preview, setPreview] = useState(initialAvatar);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  // console.log(currentUser);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // populate form inputs and preview when currentUser becomes available
  useEffect(() => {
    setFormData({
      username: currentUser?.username ?? currentUser?.user?.username ?? "",
      email: currentUser?.email ?? currentUser?.user?.email ?? "",
    });
    setPreview(
      currentUser?.avatar ?? currentUser?.user?.avatar ?? initialAvatar
    );
  }, [currentUser]);

  // handle profile info update (username, email)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setToast({
        message: "User ID unavailable. Please sign in again.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${API_BASE}/api/user/update/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        dispatch(updateUserFailure(text || "Update failed"));
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (err) {
        dispatch(updateUserFailure("Invalid JSON response from server"));
        return;
      }

      if (!data?.success) {
        dispatch(updateUserFailure(data?.message || "Update failed"));
        return;
      }

      dispatch(updateUserSuccess(data.user));
      setToast({ message: "User updated successfully!", type: "success" });
    } catch (err) {
      console.error("handleSubmit error:", err);
      setToast({ message: "Update failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // handle profile pic upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (!userId) {
        setToast({
          message: "User ID unavailable. Please sign in again.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/profile-pic/${userId}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        setToast({ message: text || "Upload failed", type: "error" });
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (err) {
        setToast({
          message: "Invalid JSON response from server",
          type: "error",
        });
        return;
      }

      if (!data?.success) {
        setToast({
          message: "Upload failed: " + (data?.message || ""),
          type: "error",
        });
        return;
      }

      // update Redux store with new avatar
      const newAvatar = data.user?.avatar ?? data.avatar ?? null;
      if (newAvatar) dispatch(updateUser({ avatar: newAvatar }));
      setFile(null);
      setToast({ message: "Profile picture updated!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Upload failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${API_BASE}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message || "Delete failed"));
        return;
      }

      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure("Something went wrong. Please try again."));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart());

      const res = await fetch(`${API_BASE}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(signoutUserFailure(data.message || "Sign out failed"));
        return;
      }
      dispatch(signoutUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(signoutUserFailure("Something went wrong. Please try again."));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(
        `${API_BASE}/api/user/listings/${currentUser._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data.listings || []);
    } catch (error) {
      console.error(error);
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (!listingId) {
      setToast({ message: "Listing ID unavailable.", type: "error" });
      return;
    }

    try {
      dispatch(userListingDeleteStart());
      const res = await fetch(`${API_BASE}/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        dispatch(userListingDeleteFailure("Invalid server response"));
        setToast({ message: "Failed to delete listing", type: "error" });
        return;
      }

      if (!res.ok || !data.success) {
        dispatch(userListingDeleteFailure(data?.message || "Delete failed"));
        setToast({ message: data?.message || "Delete failed", type: "error" });
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      dispatch(userListingDeleteSuccess());
      setToast({ message: "Listing deleted successfully!", type: "success" });
    } catch (error) {
      console.error("handleListingDelete error:", error);
      dispatch(userListingDeleteFailure("Something went wrong"));
      setToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto py-35 sm:py-30">
      {/* Toast */}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex items-center gap-2 p-3 border border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition">
          <FiUpload className="text-xl text-slate-600" />
          <span className="text-slate-600">Upload Profile Picture</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        <img
          src={preview}
          alt="profile picture"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleUpload}
            className="mt-2 bg-slate-700 text-white text-sm rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg "
          id="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg "
          id="email"
          value={formData.email}
          onChange={handleChange}
        />

        <button
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>

        <div className="flex justify-between mt-5">
          <span
            onClick={handleDelete}
            className="text-red-700 cursor-pointer hover:underline"
          >
            Delete
          </span>

          <span
            onClick={handleSignout}
            className="text-red-700 cursor-pointer hover:underline"
          >
            Sign Out
          </span>
        </div>
      </form>
      {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full mt-4 cursor-pointer hover:underline"
      >
        Show Listings
      </button>

      {/* <div className="flex flex-col gap-4 mt-3">
        {userListings && userListings.length > 0 ? (
          userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex justify-between items-center gap-4 border rounded-lg p-3 hover:shadow-md transition"
            >
              <Link
                to={`/listing/${listing._id}`}
                className="flex items-center gap-4"
              >
                <img
                  src={listing.images?.[0] || ""}
                  alt={listing.name}
                  className="h-16 w-16 rounded-md object-cover bg-slate-100"
                />

                <p className="font-medium text-slate-700 hover:underline">
                  {listing.name}
                </p>
              </Link>

              <div className="flex gap-3">
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => handleListingDelete(listing._id)}
                >
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 hover:underline text-sm">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-10">
            <p className="text-lg font-medium">No listings yet</p>
            <p className="text-sm">
              You haven’t created any listings. Create one to get started.
            </p>
          </div>
        )}
      </div> */}

      <div className="mt-6 flex flex-col gap-4">
        {userListings?.length > 0 ? (
          userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition"
            >
              {/* Left: Image + title */}
              <Link
                to={`/listing/${listing._id}`}
                className="flex items-center gap-4 min-w-0"
              >
                <img
                  src={listing.images?.[0] || "/placeholder.png"}
                  alt={listing.name}
                  className="h-16 w-16 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                />

                <div className="min-w-0">
                  <p className="font-semibold text-slate-700 truncate hover:underline">
                    {listing.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Click to view listing
                  </p>
                </div>
              </Link>

              {/* Right: actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>

                <Link
                  to={`/update-listing/${listing._id}`}
                  className="text-sm font-medium text-green-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <p className="text-lg font-semibold text-slate-600">
              No listings yet
            </p>
            <p className="text-sm text-slate-500 mt-1">
              You haven’t created any listings. Create one to get started.
            </p>
          </div>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {showListingsError && (
        <p className="text-red-500">Failed to load listings</p>
      )}
    </div>
  );
}
