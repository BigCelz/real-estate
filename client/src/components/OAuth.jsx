import React from "react";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      
      const res = await apiFetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 flex items-center justify-center gap-2 w-full cursor-pointer"
    >
      <FaGoogle />
      Continue with Google
    </button>
  );
}
