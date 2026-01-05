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
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });

  const userId = currentUser?._id ?? currentUser?.user?._id ?? currentUser?.id;
  const initialAvatar =
    currentUser?.avatar ?? currentUser?.user?.avatar ?? null;
  const [preview, setPreview] = useState(initialAvatar);
  const [loading, setLoading] = useState(false);
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
      const res = await fetch(`/api/user/update/${userId}`, {
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

      const res = await fetch(`/api/user/profile-pic/${userId}`, {
        method: "PUT",
        body: formData,
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

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
      const res = await fetch(`/api/auth/signout`);
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
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
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

        <div className="flex justify-between mt-5">
          <span onClick={handleDelete} className="text-red-700 cursor-pointer">
            Delete
          </span>

          <span onClick={handleSignout} className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </form>
      {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
    </div>
  );
}
