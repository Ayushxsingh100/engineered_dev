import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0" y1="16" x2="32" y2="16" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <path
            d="M5 8 H13 C18 8 18 16 23 16"
            stroke="url(#logo-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M5 16 H13"
            stroke="url(#logo-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M5 24 H13 C18 24 18 16 23 16"
            stroke="url(#logo-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <rect
            x="21"
            y="12.5"
            width="7"
            height="7"
            rx="1.5"
            fill="url(#logo-gradient)"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
