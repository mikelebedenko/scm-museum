import type { ButtonHTMLAttributes } from "react"

/** Кнопка-посилання (акцентний текст без рамки). */
export function LinkButton({ className, type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={["lnk", className].filter(Boolean).join(" ")} {...rest} />
}
