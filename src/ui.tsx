import { IconButton } from "./components/IconButton"
import { useEffect, useRef, useState, type ReactNode } from "react"

const P: Record<string, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  chat: <path d="M4 5h16v11H9l-5 4Z" />,
  star: (
    <path d="m12 3.5 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8Z" />
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4h8.5l8.5 8.5-8 8Z" />
      <circle cx="7.6" cy="8" r="1.2" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h4M9 13h6M9 17h6" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2.9-1.2 1.8M12 17h.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  trash: <path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13M10 11v6M14 11v6" />,
  send: <path d="M4 12 20 4l-4 16-4.5-6.5Z" />,
  filter: <path d="M4 5h16l-6 7.5V19l-4 1.5v-8Z" />,
  play: <path d="M8 5.5v13l11-6.5Z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="1.5" />
      <path d="m16 10 5-3v10l-5-3" />
    </>
  ),
  audio: <path d="M5 10v4M9 6v12M13 9v6M17 4v16M21 11v2" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  up: (
    <path d="M7 11v9H3v-9Zm0 8h9.5a2 2 0 0 0 2-1.5l1.8-6.5a2 2 0 0 0-1.9-2.5H14l.7-3.5A2 2 0 0 0 12.700 3L7 11" />
  ),
  spark: (
    <path d="m12 3 1.6 5.4L19 10l-5.400 1.600L12 17l-1.600-5.400L5 10l5.400-1.600ZM19 16l.8 2.200L22 19l-2.200.8L19 22l-.8-2.200L16 19l2.200-.8Z" />
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="1.5" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
  check: <path d="m5 12.5 4.500 4.500L19 7.500" />,
  down: <path d="m6 9 6 6 6-6" />,
  chart: <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8" />,
  shield: (
    <>
      <path d="M12 3 4.500 6v6c0 4.500 3 7.500 7.500 9 4.500-1.500 7.500-4.500 7.500-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.600 5.600l2.100 2.100M16.300 16.300l2.100 2.100M18.400 5.600l-2.100 2.100M7.700 16.300l-2.100 2.100" />
    </>
  ),
  logout: <path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" />,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </>
  ),
  edit: <path d="M4 20h4L19 9l-4-4L4 16ZM14 6l4 4" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="1.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  alert: <path d="M12 4 2.500 20h19ZM12 10v5M12 17.500h.01" />,
  back: <path d="M15 5 8 12l7 7" />,
  volume: (
    <path d="M4 10v4h4l5 4V6l-5 4ZM16.500 9a4 4 0 0 1 0 6M18.500 6.500a7.500 7.500 0 0 1 0 11" />
  ),
  mute: <path d="M4 10v4h4l5 4V6l-5 4ZM17 9l4 6M21 9l-4 6" />,
  sub: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 14h4M13 14h4M7 10h2M11 10h6" />
    </>
  ),
  link: (
    <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" />
  ),
  history: <path d="M4 12a8 8 0 1 0 3-6.200M4 4v4h4M12 8v4l3 2" />,
  eye: (
    <>
      <path d="M2 12s3.500-6.500 10-6.500S22 12 22 12s-3.500 6.500-10 6.500S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9M16 7l3 3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.500" r="3.200" />
      <path d="M3 20a6 6 0 0 1 12 0M16 5.500a3.200 3.200 0 0 1 0 6M18 14.500a6 6 0 0 1 3 5.500" />
    </>
  ),
  pulse: <path d="M3 12h4l2.500-6 4 12 2.500-6H21" />,
  list: (
    <path d="M8 6h13M8 12h13M8 18h13M3.500 6h.01M3.500 12h.01M3.500 18h.01" />
  ),
}
export type IconName = keyof typeof P
export function Icon({
  n,
  s = 16,
  fill = false,
}: {
  n: IconName
  s?: number
  fill?: boolean
}) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {P[n]}
    </svg>
  )
}

/** Коротка інформаційна підказка (FR-51). */
export function Hint({ text }: { text: string }) {
  return (
    <span className="hint" tabIndex={0} data-tip={text} aria-label={text}>
      ?
    </span>
  )
}
export function Tip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="tipw" data-tip={text}>
      {children}
    </span>
  )
}

export function Modal({
  title,
  onClose,
  children,
  wide,
  foot,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
  foot?: ReactNode
}) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    addEventListener("keydown", f)
    return () => removeEventListener("keydown", f)
  }, [onClose])
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header>
          <h3>{title}</h3>
          <IconButton onClick={onClose} aria-label="Закрити">
            <Icon n="close" />
          </IconButton>
        </header>
        <div className="mbody">{children}</div>
        {foot && <footer>{foot}</footer>}
      </div>
    </div>
  )
}

export function Popover({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const f = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const t = setTimeout(() => addEventListener("mousedown", f), 0)
    return () => {
      clearTimeout(t)
      removeEventListener("mousedown", f)
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={ref} className={`pop ${className}`}>
      {children}
    </div>
  )
}

export function toast(msg: string) {
  dispatchEvent(new CustomEvent("kd-toast", { detail: msg }))
}
export function Toasts() {
  const [items, setItems] = useState<{ id: number; m: string }[]>([])
  useEffect(() => {
    const f = (e: Event) => {
      const id = Date.now() + Math.random()
      setItems((x) => [...x, { id, m: (e as CustomEvent).detail }])
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3200)
    }
    addEventListener("kd-toast", f)
    return () => removeEventListener("kd-toast", f)
  }, [])
  return (
    <div className="toasts" aria-live="polite">
      {items.map((i) => (
        <div key={i.id} className="toast">
          <Icon n="check" s={14} />
          {i.m}
        </div>
      ))}
    </div>
  )
}

export function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`sw ${on ? "on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <i />
    </button>
  )
}
export function Empty({
  icon,
  title,
  children,
}: {
  icon: IconName
  title: string
  children?: ReactNode
}) {
  return (
    <div className="empty">
      <span>
        <Icon n={icon} s={22} />
      </span>
      <b>{title}</b>
      {children && <p>{children}</p>}
    </div>
  )
}
