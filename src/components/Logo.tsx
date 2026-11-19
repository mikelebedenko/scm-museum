// Висоти стовпчиків дзеркальної хвилі (центр — найвищий пік)
const BARS = [4, 9, 14, 8, 18, 26, 16, 23, 11, 17, 7, 12, 4]

/**
 * Логотип SCM.Museum: звукова хвиля — архів усної історії.
 * Кольори — з токенів.
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
        stroke="var(--color-text-on-accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        {BARS.map((h, i) => {
          const x = 20 + (i - 6) * 2.5
          return <line key={i} x1={x} y1={20 - h / 2} x2={x} y2={20 + h / 2} />
        })}
      </g>
    </svg>
  )
}
