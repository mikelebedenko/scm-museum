import type { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Фільтр увімкнено (акцентна межа й текст) */
  active?: boolean
}

/** Кнопка-фільтр (мова, теги, рубрики). */
export function FilterButton({ active, className, type = "button", ...rest }: Props) {
  const cls = ["fbtn", active && "on", className].filter(Boolean).join(" ")
  return <button type={type} className={cls} {...rest} />
}
