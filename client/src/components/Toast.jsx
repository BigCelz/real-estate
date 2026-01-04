import React, { useEffect, useState } from "react";

export default function Toast({ toast, onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const { message, type } = toast;
  const bg = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";

  return (
    <div className="fixed top-6 right-6 z-50 max-w-[90vw] sm:max-w-sm">
      <div
        className={`transform transition-all duration-300 ${visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"} ${bg} px-4 py-2 rounded-lg shadow-lg text-white flex items-start gap-3`}
        role="status"
        aria-live="polite"
      >
        <div className="flex-1 break-words">{message}</div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose && onClose(), 200);
          }}
          aria-label="Close notification"
          className="ml-2 text-white/90 hover:text-white text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
