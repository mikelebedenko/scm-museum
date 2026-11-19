import type { ReactNode } from "react"

export type SegmentedOption<T extends string> = { value: T; label: ReactNode }

type Props<T extends string> = {
  value: T
  options: SegmentedOption<T>[]
  onChange: (v: T) => void
  className?: string
  "aria-label"?: string
}

/** Сегментований перемикач (один активний варіант). Токени: --btn-*, --control-md. */
export function Segmented<T extends string>({ value, options, onChange, className, ...rest }: Props<T>) {
  return (
    <div className={["seg2", className].filter(Boolean).join(" ")} {...rest}>
      {options.map((o) => (
        <button key={o.value} type="button" className={o.value === value ? "on" : ""} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
