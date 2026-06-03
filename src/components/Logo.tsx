import React from "react";

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function LogoIcon({ className, width = 32, height = 32 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="16" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f472b6" /> {/* Pink-400 */}
          <stop offset="100%" stopColor="#a855f7" /> {/* Purple-500 */}
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
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 group select-none ${className}`}>
      <LogoIcon className="w-7 h-7 sm:w-8 sm:h-8" />
      <span className="font-bold text-text-primary tracking-tight text-lg sm:text-[22px] font-heading hover:opacity-80 transition-opacity duration-300">
        engineered<span className="text-[#a855f7] font-extrabold">.dev</span>
      </span>
    </div>
  );
}
