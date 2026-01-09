"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: "bg-white border-dark-green text-dark-green shadow-green-900/10",
    error: "bg-red-50 border-red-600 text-red-900 shadow-red-900/10",
    info: "bg-blue-50 border-blue-600 text-blue-900 shadow-blue-900/10",
    warning:
      "bg-yellow-50 border-yellow-600 text-yellow-900 shadow-yellow-900/10",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`relative w-full p-4 border-l-4 rounded shadow-lg max-w-md ${bgColors[type]} animate-slide-in pointer-events-auto`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0" aria-hidden="true">
          {icons[type]}
        </span>
        <p className="flex-1 text-sm">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Fermer la notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
