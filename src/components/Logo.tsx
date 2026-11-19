/**
 * Логотип SCM.Museum: три вкладені арки — вхід до музею/архіву
 * і водночас хвилі звуку (усна історія). Кольори — з токенів.
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
        fill="none"
        stroke="var(--color-text-on-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M10 29V20a10 10 0 0 1 20 0v9" />
        <path d="M14 29V20a6 6 0 0 1 12 0v9" />
        <path d="M18 29V20a2 2 0 0 1 4 0v9" />
      </g>
    </svg>
  )
}
