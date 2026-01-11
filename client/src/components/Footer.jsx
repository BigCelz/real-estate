import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="text-white font-bold text-lg">KaidaHeavens</div>

        <div className="mt-4 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} YourRealty. All rights reserved.
        </div>

        {/* Social Icons */}
        <div className="flex gap-3 text-gray-400">
          <a href="#" className="hover:text-white transition">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}
