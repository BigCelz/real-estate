import React, { useRef, useState } from "react";
import Toast from "../components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import { updateUser } from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState(null);
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
        setToast({ message: "User ID unavailable. Please sign in again.", type: "error" });
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/user/profile-pic/${userId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setToast({ message: "Upload failed: " + (data.message || ""), type: "error" });
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* Toast component rendered here */}
      {toast && (
        <Toast toast={toast} onClose={() => setToast(null)} />
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
