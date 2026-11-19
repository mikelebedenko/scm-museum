import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type {
  State,
  User,
  UserData,
  LogEntry,
  Session,
  Msg,
  Role,
  Script,
} from "./types"
import { permsOf } from "./types"
import { uid, now, search, makeAnswer, makeScript } from "./lib"
import { mat, frag, story, stories } from "./data"

export const TERMS_V = "2.0 від 01.09.2025"
const emptyData = (): UserData => ({
  chats: [],
  active: null,
  favs: [],
  tags: [],
  assign: {},
  ratings: {},
  answerRatings: {},
  scripts: [],
})
const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString()

function seed(): State {
  const mk = (
    id: string,
    email: string,
    name: string,
    org: string,
    roles: Role[],
    mfa = true,
    accepted = true,
  ): User => ({
    id,
    email,
    name,
    org,
    password: "demo",
    roles,
    status: "active",
    mfa,
    terms: accepted ? TERMS_V : null,
    termsAt: accepted ? ago(60 * 24 * 20) : null,
    created: ago(60 * 24 * 90),
    lastLogin: ago(180),
  })
  const users: User[] = [
    mk(
      "u1",
      "olena@archive.ua",
      "Олена Мельник",
      "Редакція документальних проєктів",
      ["base", "extended"],
    ),
    mk("u2", "taras@archive.ua", "Тарас Бондар", "Незалежний дослідник", [
      "base",
    ]),
    mk("u3", "staff@archive.ua", "Ірина Шевчук", "Співробітник архіву", [
      "base",
      "extended",
      "staff",
    ]),
    mk("u4", "admin@archive.ua", "Максим Гнатюк", "Адміністрація платформи", [
      "base",
      "admin",
    ]),
    mk(
      "u5",
      "new@archive.ua",
      "Нова Користувачка",
      "Університет",
      ["base"],
      false,
      false,
    ),
  ]
  const statusAll: Record<string, string> = {
    st1: "Відкрита",
    st2: "Відкрита",
    st3: "Відкрита",
    st4: "Відкрита",
    st5: "Відкрита",
    st6: "Відкрита",
    st7: "Закрита",
    st8: "Відкрита",
    st9: "Відкрита",
    st10: "Відкрита",
    st11: "Відкрита",
    st12: "Відкрита",
    st13: "Відкрита",
    st14: "Відкрита",
    st15: "Відкрита",
    st16: "Відкрита",
    st17: "Відкрита",
    st18: "Відкрита",
    st19: "Відкрита",
    st20: "Відкрита",
    st21: "Відкрита",
    st22: "Відкрита",
    st23: "Відкрита",
    st24: "Відкрита",
    st25: "Відкрита",
    st26: "Відкрита",
    st27: "Відкрита",
    st28: "Відкрита",
    st29: "Відкрита",
    st30: "Відкрита",
  }
  const data: Record<string, UserData> = {}
  users.forEach((u) => (data[u.id] = emptyData()))
  const q = "Евакуація цивільних і роль волонтерів"
  const hits = search(q, statusAll)
  const d = data.u1
  d.chats.push({
    id: "c1",
    title: "Евакуація цивільних",
    created: ago(300),
    msgs: [
      { id: "a1", role: "user", text: q, ts: ago(300) },
      {
        id: "a2",
        role: "ai",
        text: "",
        ts: ago(300),
        status: "ok",
        hits,
        query: q,
        answer: makeAnswer(q, hits),
      },
    ],
  })
  d.active = null
  d.favs = ["st1", "st2"]
  d.tags = [
    { id: "t1", name: "Для статті про евакуацію" },
    { id: "t2", name: "Цитати" },
  ]
  d.assign = { st1: ["t1", "t2"], st2: ["t1"] }
  data.u2.chats.push({
    id: "c2",
    title: "Повернення до міст",
    created: ago(900),
    msgs: [],
  })
  data.u2.active = "c2"
  const sessions: Session[] = [
    {
      id: "s0",
      userId: "u1",
      device: "Chrome · цей пристрій",
      started: ago(5),
      last: ago(0),
      ended: null,
      reason: null,
    },
    {
      id: "s2",
      userId: "u2",
      device: "Firefox · Windows",
      started: ago(40),
      last: ago(6),
      ended: null,
      reason: null,
    },
    {
      id: "s3",
      userId: "u3",
      device: "Safari · macOS",
      started: ago(95),
      last: ago(12),
      ended: null,
      reason: null,
    },
  ]
  const log: LogEntry[] = [
    {
      id: "l1",
      ts: ago(95),
      type: "Вхід",
      result: "ok",
      actor: "staff@archive.ua",
    },
    {
      id: "l2",
      ts: ago(60),
      type: "Вхід",
      result: "fail",
      actor: "unknown@mail.ua",
      info: "Невірні облікові дані",
    },
    {
      id: "l3",
      ts: ago(40),
      type: "Вхід",
      result: "ok",
      actor: "taras@archive.ua",
    },
  ]
  return {
    users,
    data,
    sessions,
    log,
    settings: { timeoutMin: 15, termsVersion: TERMS_V, storyStatus: statusAll },
    sessionId: "s0",
    notice: null,
  }
}

const KEY = "kd_state_v4"
type Ctx = { state: State; update: (fn: (s: State) => void) => void }
const C = createContext<Ctx>(null as unknown as Ctx)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => {
    try {
      const r = localStorage.getItem(KEY)
      if (r) {
        const saved = JSON.parse(r) as State
        // Старі версії зберігали Вибране й теги за id медіафайлу. Безшовно переносимо їх на історії.
        Object.values(saved.data).forEach((d) => {
          // На старті показуємо каталог; збережені чати лишаються доступними в історії.
          d.active = null
          d.favs = Array.from(
            new Set(
              d.favs
                .map((id) => (id.startsWith("m") ? mat(id)?.storyId : id))
                .filter(Boolean),
            ),
          )
          const assign: Record<string, string[]> = {}
          Object.entries(d.assign).forEach(([id, tags]) => {
            const sid = id.startsWith("m") ? mat(id)?.storyId : id
            if (sid)
              assign[sid] = Array.from(
                new Set([...(assign[sid] ?? []), ...tags]),
              )
          })
          d.assign = assign
        })
        // Нові історії з каталогу за замовчуванням відкриті (не втрачаємо збережений стан).
        const st = saved.settings.storyStatus
        stories.forEach((x) => {
          if (!(x.id in st)) st[x.id] = "Відкрита"
        })
        return saved
      }
    } catch {
      /* ignore */
    }
    return seed()
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* quota */
    }
  }, [state])
  const update = useCallback(
    (fn: (s: State) => void) =>
      setState((p) => {
        const n = structuredClone(p)
        fn(n)
        return n
      }),
    [],
  )
  return <C.Provider value={{ state, update }}>{children}</C.Provider>
}
export const useStore = () => useContext(C)
export const resetDemo = () => {
  localStorage.removeItem(KEY)
  location.reload()
}

export function addLog(
  s: State,
  type: string,
  result: "ok" | "fail",
  actor: string,
  target?: string,
  info?: string,
) {
  s.log.unshift({ id: uid(), ts: now(), type, result, actor, target, info })
  if (s.log.length > 400) s.log.length = 400
}

export function useMe() {
  const { state } = useStore()
  const session =
    state.sessions.find((x) => x.id === state.sessionId && !x.ended) ?? null
  const user = session
    ? (state.users.find((u) => u.id === session.userId) ?? null)
    : null
  const perms = permsOf(user?.roles ?? [])
  const data = user ? (state.data[user.id] ?? emptyData()) : emptyData()
  return { session, user, perms, data }
}

export function startSession(
  s: State,
  userId: string,
  device = "Chrome · цей пристрій",
) {
  const u = s.users.find((x) => x.id === userId)!
  s.sessions.forEach((x) => {
    if (x.userId === userId && !x.ended) {
      x.ended = now()
      x.reason = "Новий вхід з іншого пристрою"
    }
  })
  const id = uid()
  s.sessions.push({
    id,
    userId,
    device,
    started: now(),
    last: now(),
    ended: null,
    reason: null,
  })
  s.sessionId = id
  s.notice = null
  u.lastLogin = now()
  addLog(s, "Вхід", "ok", u.email)
}
export function endSessions(s: State, userId: string, reason: string) {
  s.sessions.forEach((x) => {
    if (x.userId === userId && !x.ended) {
      x.ended = now()
      x.reason = reason
    }
  })
}

export function useActions() {
  const { state, update } = useStore()
  const { user } = useMe()
  const uidv = user?.id ?? ""
  const actor = user?.email ?? "—"
  const D = (s: State) => s.data[uidv]
  return {
    log: (
      type: string,
      result: "ok" | "fail" = "ok",
      target?: string,
      info?: string,
    ) => update((s) => addLog(s, type, result, actor, target, info)),
    toggleFav: (storyId: string) =>
      update((s) => {
        const d = D(s)
        const on = d.favs.includes(storyId)
        d.favs = on ? d.favs.filter((x) => x !== storyId) : [...d.favs, storyId]
        addLog(
          s,
          on ? "Видалення з вибраного" : "Додавання до вибраного",
          "ok",
          actor,
          story(storyId).title,
        )
      }),
    createTag: (name: string, id = uid()) => {
      update((s) => {
        const d = D(s)
        if (!d.tags.some((t) => t.name.toLowerCase() === name.toLowerCase()))
          d.tags.push({ id, name })
        addLog(s, "Створення тегу", "ok", actor, name)
      })
      return id
    },
    renameTag: (id: string, name: string) =>
      update((s) => {
        const t = D(s).tags.find((x) => x.id === id)
        if (t) t.name = name
        addLog(s, "Редагування тегу", "ok", actor, name)
      }),
    deleteTag: (id: string) =>
      update((s) => {
        const d = D(s)
        d.tags = d.tags.filter((t) => t.id !== id)
        Object.keys(d.assign).forEach((k) => {
          d.assign[k] = d.assign[k].filter((x) => x !== id)
        })
        addLog(s, "Видалення тегу", "ok", actor)
      }),
    toggleAssign: (storyId: string, tid: string) =>
      update((s) => {
        const d = D(s)
        const a = d.assign[storyId] ?? []
        d.assign[storyId] = a.includes(tid)
          ? a.filter((x) => x !== tid)
          : [...a, tid]
      }),
    rate: (key: string, v: "rel" | "irrel") =>
      update((s) => {
        const d = D(s)
        if (d.ratings[key] === v) delete d.ratings[key]
        else d.ratings[key] = v
      }),
    rateAnswer: (id: string, v: "useful" | "useless") =>
      update((s) => {
        const d = D(s)
        if (d.answerRatings[id] === v) delete d.answerRatings[id]
        else d.answerRatings[id] = v
      }),
    newChat: () =>
      update((s) => {
        const d = D(s)
        const c = { id: uid(), title: "Чат", created: now(), msgs: [] }
        d.chats.unshift(c)
        d.active = c.id
        addLog(s, "Створення чату", "ok", actor)
      }),
    setActive: (id: string) =>
      update((s) => {
        D(s).active = id
      }),
    deleteChat: (id: string) =>
      update((s) => {
        const d = D(s)
        d.chats = d.chats.filter((c) => c.id !== id)
        if (d.active === id) d.active = d.chats[0]?.id ?? null
        addLog(s, "Видалення чату", "ok", actor)
      }),
    deleteScript: (id: string) =>
      update((s) => {
        const d = D(s)
        d.scripts = d.scripts.filter((x) => x.id !== id)
        addLog(s, "Видалення сценарію", "ok", actor)
      }),
    renameScript: (id: string, title: string) =>
      update((s) => {
        const sc = D(s).scripts.find((x) => x.id === id)
        if (sc) {
          sc.title = title
          addLog(s, "Перейменування сценарію", "ok", actor)
        }
      }),
    saveScript: (sc: Script) =>
      update((s) => {
        D(s).scripts.unshift(sc)
        addLog(s, "Генерація сценарію", "ok", actor, sc.title)
      }),
    sendQuery: (
      text: string,
      chatId: string | null,
      force = false,
      onDone?: (msgId: string, chatId: string) => void,
    ) => {
      const cid = chatId ?? uid()
      const chat = state.data[uidv].chats.find((c) => c.id === chatId)
      const perms = permsOf(user!.roles)
      const prevQ = chat
        ? [...chat.msgs].reverse().find((m) => m.role === "user")?.text
        : undefined
      const ctx =
        perms.has("ai") && !!prevQ && text.trim().split(/\s+/).length <= 4
      const um: Msg = { id: uid(), role: "user", text, ts: now() }
      update((s) => {
        const d = D(s)
        let c = d.chats.find((x) => x.id === cid)
        if (!c) {
          c = { id: cid, title: text.slice(0, 46), created: now(), msgs: [] }
          d.chats.unshift(c)
        } else if (!c.msgs.length) c.title = text.slice(0, 46)
        c.msgs.push(um)
        d.active = cid
        addLog(s, "Пошуковий запит", "ok", actor)
      })
      setTimeout(() => {
        const failing = !force && /помилк|error/i.test(text)
        const hits = failing
          ? []
          : search(ctx ? `${prevQ} ${text}` : text, state.settings.storyStatus)
        const status: Msg["status"] = failing
          ? "error"
          : hits.length
            ? "ok"
            : "empty"
        const am: Msg = {
          id: uid(),
          role: "ai",
          text: "",
          ts: now(),
          status,
          hits,
          query: text,
          ctx,
          answer:
            perms.has("ai") && status === "ok"
              ? makeAnswer(text, hits, ctx ? prevQ : undefined)
              : null,
        }
        update((s) => {
          const c = D(s)?.chats.find((x) => x.id === cid)
          if (c) c.msgs.push(am)
          if (status === "error") addLog(s, "Помилка пошуку", "fail", actor)
        })
        onDone?.(am.id, cid)
      }, 750)
    },
    genScript: (prompt: string, ids: string[]) => {
      const sc: Script = {
        id: uid(),
        title: prompt.slice(0, 54) || "Без назви",
        prompt,
        body: makeScript(prompt, ids),
        created: now(),
        sources: Array.from(new Set(ids.map((i) => frag(i).mid))),
      }
      update((s) => {
        D(s).scripts.unshift(sc)
        addLog(s, "Генерація сценарію", "ok", actor, sc.title)
      })
      return sc
    },
  }
}
