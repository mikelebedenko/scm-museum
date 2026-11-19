import type { ButtonHTMLAttributes } from "react"

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  /** Обов'язковий: у кнопки-іконки немає тексту */
  "aria-label": string
  size?: "md" | "sm"
  /** Увімкнений стан (акцентний колір) */
  active?: boolean
}

/** Кнопка з іконкою. Розміри: --icon-button-size / --icon-button-size-sm. */
export function IconButton({
  size = "md",
  active,
  className,
  type = "button",
  ...rest
}: Props) {
  const cls = ["ib", size === "sm" && "sm", active && "on", className]
    .filter(Boolean)
    .join(" ")
  return <button type={type} className={cls} {...rest} />
}
