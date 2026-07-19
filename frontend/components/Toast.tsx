"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onDone: () => void;
  duration?: number;
}

export default function Toast({ message, onDone, duration = 1500 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), duration);
    const t2 = setTimeout(onDone, duration + 300); // 等淡出动画结束再回调
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone, duration]);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-green-600 text-white text-sm rounded-xl shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      ✅ {message}
    </div>
  );
}
