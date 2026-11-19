import type { ReactNode } from "react"

type Props = {
  checked: boolean
  onChange: () => void
  title?: string
  className?: string
  children?: ReactNode
}

/** Чекбокс зі стилізованим квадратом. children — необов'язковий підпис. */
export function Checkbox({ checked, onChange, title, className, children }: Props) {
  return (
    <label className={["cb", className].filter(Boolean).join(" ")} title={title}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span />
      {children}
    </label>
  )
}
