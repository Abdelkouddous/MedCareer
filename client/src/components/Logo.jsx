import React from "react";

const Logo = ({ width = 28, height = 28, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="20"
        fill="var(--primary-500)"
        fillOpacity="0.15"
      />
      <path
        d="M 18 28 L 40 74 L 54 36 L 58 48 L 64 22 L 68 52 L 73 42 L 82 46"
        stroke="var(--primary-500)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
