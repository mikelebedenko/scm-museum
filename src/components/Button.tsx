import type { ButtonHTMLAttributes } from "react"

export type ButtonVariant = "default" | "primary" | "danger"
export type ButtonSize = "md" | "sm"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** На всю ширину контейнера (висота --btn-height-lg) */
  wide?: boolean
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: "",
  primary: "gold",
  danger: "danger",
}

/** Кнопка. Вигляд задають Component Tokens `--btn-*` (src/styles/tokens/components.css). */
export function Button({
  variant = "default",
  size = "md",
  wide,
  className,
  type = "button",
  ...rest
}: Props) {
  const cls = [
    "btn",
    VARIANT_CLASS[variant],
    size === "sm" && "sm",
    wide && "wide",
    className,
  ]
    .filter(Boolean)
    .join(" ")
  return <button type={type} className={cls} {...rest} />
}
