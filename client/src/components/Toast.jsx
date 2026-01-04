import React, { useEffect } from "react";

export default function Toast({ toast, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const { message, type } = toast;
  const bg = type === "success" ? "bg-slate-600" : type === "error" ? "bg-red-600" : "bg-slate-600";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow text-white ${bg}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
