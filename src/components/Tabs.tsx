import type { ReactNode } from "react"

export type TabOption<T extends string> = { value: T; label: ReactNode }

type Props<T extends string> = {
  value: T
  options: TabOption<T>[]
  onChange: (v: T) => void
  className?: string
}

/** Вкладки з підкресленням активної. Токени: --tab-padding-x/y. */
export function Tabs<T extends string>({ value, options, onChange, className }: Props<T>) {
  return (
    <div className={["tabs2", className].filter(Boolean).join(" ")} role="tablist">
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={o.value === value} className={o.value === value ? "on" : ""} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
