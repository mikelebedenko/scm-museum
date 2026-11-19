import type { HTMLAttributes, ReactNode } from "react"

export type ChipTone = "default" | "mine" | "selected" | "add"

type Props = HTMLAttributes<HTMLElement> & {
  tone?: ChipTone
  children?: ReactNode
  "aria-expanded"?: boolean
}

const TONE_CLASS: Record<ChipTone, string> = {
  default: "",
  mine: "mine",
  selected: "on",
  add: "add",
}

/** Чип/тег. tone="add" — інтерактивна кнопка «додати», решта — span. Токени: --chip-*. */
export function Chip({ tone = "default", className, ...rest }: Props) {
  const cls = ["chip", TONE_CLASS[tone], className].filter(Boolean).join(" ")
  if (tone === "add") return <button type="button" className={cls} {...rest} />
  return <span className={cls} {...rest} />
}
