"use client";

import { useEffect, useState } from "react";

interface ButtonSpinnerProps {
  visible: boolean;
}

export function ButtonSpinner({ visible }: ButtonSpinnerProps) {
  const [dash, setDash] = useState("12 20");

  useEffect(() => {
    if (!visible) {
      return;
    }
    const id = window.setInterval(() => {
      const arc = 8 + Math.floor(Math.random() * 14);
      const gap = 16 + Math.floor(Math.random() * 12);
      setDash(`${arc} ${gap}`);
    }, 800);
    return () => window.clearInterval(id);
  }, [visible]);

  return (
    <span
      aria-hidden
      className="tm-button__spinner"
      data-visible={visible ? "true" : "false"}
    >
      <svg aria-hidden="true" data-tm-spinner fill="none" viewBox="0 0 16 16">
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeDasharray={dash}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}
