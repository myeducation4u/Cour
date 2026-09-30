export function SpecIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    className: "h-4 w-4 text-mist",
    "aria-hidden": true as const,
  };
  switch (name) {
    case "weather":
      return (
        <svg {...common}>
          <path d="M7 16h11a3.5 3.5 0 0 0 .2-7 5 5 0 0 0-9.6-1.4A3.8 3.8 0 0 0 7 16Z" />
          <path d="M9 19v1M12 19v2M15 19v1" />
        </svg>
      );
    case "thermal":
      return (
        <svg {...common}>
          <path d="M10 13.5V6.2a2 2 0 1 1 4 0v7.3a3.2 3.2 0 1 1-4 0Z" />
          <path d="M12 8.5v5" />
        </svg>
      );
    case "stitch":
      return (
        <svg {...common}>
          <path d="M5 19c4-1 6-7 4-12" />
          <circle cx="9" cy="6" r="1.4" />
          <path d="M12 5h8M12 9h6M4 19h7" />
        </svg>
      );
    case "pocket":
      return (
        <svg {...common}>
          <path d="M6 8h12v10H6z" />
          <path d="M6 12h12" />
          <path d="M12 12v6" />
        </svg>
      );
    case "fit":
      return (
        <svg {...common}>
          <path d="M4 12h16M8 8 4 12l4 4M16 8l4 4-4 4" />
        </svg>
      );
    default:
      return null;
  }
}

export const SPEC_ICON = ["weather", "thermal", "stitch", "pocket", "fit"] as const;
