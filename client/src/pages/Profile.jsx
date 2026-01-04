import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import { updateUser } from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = "info", duration = 4000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };
  // compute user object/id robustly in case persisted state stores a wrapper
  const userId = currentUser?._id ?? currentUser?.user?._id ?? currentUser?.id;
  const initialAvatar = currentUser?.avatar ?? currentUser?.user?.avatar ?? null;
  const [preview, setPreview] = useState(initialAvatar);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [loading, setLoading] = useState(false);
  console.log(currentUser);

  // handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // show preview immediately
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
        showNotification("User ID unavailable. Please sign in again.", "error");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/user/profile-pic/${userId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        showNotification("Upload failed: " + (data.message || ""), "error");
        return;
      }

      // update Redux store with new avatar
      const newAvatar = data.user?.avatar ?? data.avatar ?? null;
      if (newAvatar) dispatch(updateUser({ avatar: newAvatar }));
      setFile(null);
      showNotification("Profile picture updated!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      {notification && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow text-white ${notification.type === 'success' ? 'bg-green-600' : notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {notification.message}
        </div>
      )}
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleUpload} className="flex flex-col gap-4">
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
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg "
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg "
          id="email"
        />

        <button
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete</span>

          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
}
