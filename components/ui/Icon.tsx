const paths = {
  tooth: (
    <path d="M7.5 3C5 3 3 5 3 7.6c0 2.6 1.3 4.4 1.9 6.7.6 2.2.8 4.3 1.8 6.1.5.8 1.5.8 1.9-.1.7-1.6.9-3.6 1.7-5 .4-.7 1.4-.7 1.8 0 .8 1.4 1 3.4 1.7 5 .4.9 1.4.9 1.9.1 1-1.8 1.2-3.9 1.8-6.1.6-2.3 1.9-4.1 1.9-6.7C21 5 19 3 16.5 3c-1.9 0-3 1-4.5 1S9.4 3 7.5 3Z" />
  ),
  shield: (
    <>
      <path d="M12 3 19 6v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkle: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  ),
  braces: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1.5" />
      <path d="M9 8v8M15 8v8M3 12h18" />
    </>
  ),
  implant: (
    <>
      <path d="M7.5 3h9l-1.2 4.5H8.7L7.5 3Z" />
      <path d="M10 7.5V10h4V7.5M9.5 12.5h5M10 15h4M10.5 17.5h3M12 17.5V21" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  toothbrush: (
    <>
      <path d="M3 21l8-8" />
      <path d="m11 13 7-7 2.5 2.5-7 7L11 13Z" />
      <path d="m12.5 11.5-1.8-1.8M14.8 9.2 13 7.4M17 7l-1.8-1.8" />
    </>
  ),
  floss: (
    <>
      <rect x="3" y="7" width="8" height="13" rx="2" />
      <path d="M3 11h8M7 7V4" />
      <path d="M11 15c4 0 4.5-6 7-9 .7-.9 1.7-1.5 3-1.5" />
    </>
  ),
  candy: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M8 12 3 8.5v7L8 12ZM16 12l5-3.5v7L16 12ZM10.5 9.5l3 5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.8-4.8" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  calendarCheck: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="m9 15.5 2 2 4-4" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.6 4-2.1 1.3a11 11 0 0 0 6.7 6.7l1.3-2.1 4 1.6V19a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  arrowRight: <path d="M4 12h16m-6-6 6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "size-6",
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
