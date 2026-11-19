/**
 * Логотип SCM.Museum: фасад музею (фронтон і колони). Кольори — з токенів.
 */
export function Logo({ size = "var(--logo-size)" }: { size?: number | string }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="SCM.Museum"
    >
      <circle cx="20" cy="20" r="20" fill="var(--color-accent)" />
      <g
        fill="var(--color-text-on-accent)"
        stroke="var(--color-text-on-accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M20 9.5 30.5 15.5H9.5Z" />
        <rect x="12" y="18.5" width="3.5" height="8" rx="0.5" stroke="none" />
        <rect x="18.25" y="18.5" width="3.5" height="8" rx="0.5" stroke="none" />
        <rect x="24.5" y="18.5" width="3.5" height="8" rx="0.5" stroke="none" />
        <rect x="9.5" y="28.5" width="21" height="2.5" rx="0.5" stroke="none" />
      </g>
    </svg>
  )
}
