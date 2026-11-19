export type Role = "base" | "extended" | "staff" | "admin"
export type Perm = "search" | "ai" | "script" | "analytics" | "admin"

export const ROLE_META: Record<Role, {
  label: string
  desc: string
  perms: Perm[]
}> = {
  base: {
    label: "Базова",
    desc: "Пошук і перегляд історій та їхніх медіа, пошукові чати, Обране, власні теги",
    perms: ["search"],
  },
  extended: {
    label: "Розширена",
    desc: "Контекстний діалог, відповіді ШІ, генерація текстових сценаріїв",
    perms: ["search", "ai", "script"],
  },
  staff: {
    label: "Співробітник",
    desc: "Перегляд аналітичних показників та експорт даних",
    perms: ["analytics"],
  },
  admin: {
    label: "Адміністратор",
    desc: "Облікові записи, ролі, сесії, налаштування платформи",
    perms: ["admin"],
  },
}
export const ROLES = Object.keys(ROLE_META) as Role[]
export const permsOf = (roles: Role[]) =>
  new Set<Perm>(roles.flatMap((r) => ROLE_META[r].perms))

export interface User {
  id: string
  email: string
  name: string
  org: string
  password: string
  roles: Role[]
  status: "active" | "blocked" | "pending"
  mfa: boolean
  terms: string | null
  termsAt: string | null
  created: string
  lastLogin: string | null
}
export interface Session {
  id: string
  userId: string
  device: string
  started: string
  last: string
  ended: string | null
  reason: string | null
}
export interface LogEntry {
  id: string
  ts: string
  type: string
  result: "ok" | "fail"
  actor: string
  target?: string
  info?: string
}

export interface Hit {
  fid: string
  score: number
}
export interface Msg {
  id: string
  role: "user" | "ai"
  text: string
  ts: string
  status?: "ok" | "empty" | "error"
  hits?: Hit[]
  answer?: string | null
  ctx?: boolean
  query?: string
}
export interface Chat {
  id: string
  title: string
  created: string
  msgs: Msg[]
}
export interface Script {
  id: string
  title: string
  prompt: string
  body: string
  created: string
  sources: string[]
}
export interface UserTag {
  id: string
  name: string
}
export interface UserData {
  chats: Chat[]
  active: string | null
  favs: string[]
  tags: UserTag[]
  assign: Record<string, string[]>
  ratings: Record<string, "rel" | "irrel">
  answerRatings: Record<string, "useful" | "useless">
  scripts: Script[]
}
export interface Settings {
  timeoutMin: number
  termsVersion: string
  storyStatus: Record<string, string>
}
export interface State {
  users: User[]
  data: Record<string, UserData>
  sessions: Session[]
  log: LogEntry[]
  settings: Settings
  sessionId: string | null
  notice: string | null
}
