import { useState } from "react"
import { Button } from "../components/Button"
import { Checkbox } from "../components/Checkbox"
import { FilterButton } from "../components/FilterButton"
import { IconButton } from "../components/IconButton"
import { LinkButton } from "../components/LinkButton"
import { Icon, type IconName } from "../ui"
import { useMe, useStore } from "../store"
import {
  RUBRICS,
  stories,
  story,
  storyMedia,
  type Material,
} from "../data"
import { fmt } from "../lib"

type Nav =
  | { v: "menu" }
  | { v: "all" }
  | { v: "topics" }
  | { v: "topic"; id: string }
  | { v: "favs" }
  | { v: "tags" }
  | { v: "tag"; id: string }

type TypeFilter = "all" | "video" | "audio" | "text"

const TYPE_ICON: Record<string, IconName> = {
  video: "video",
  audio: "audio",
  text: "file",
}

type Props = {
  foundStories: Material[]
  storySel: string[]
  selSummary: string
  canScript: boolean
  busy: boolean
  onToggleStory: (id: string) => void
  onOpenMedia: (mediaId: string) => void
  onClear: () => void
  onGenerate: () => void
  onAsk: (q: string) => void
  onManageTags: () => void
}

export function LibPanel(p: Props) {
  const { data } = useMe()
  const { state } = useStore()
  const status = state.settings.storyStatus
  const [nav, setNav] = useState<Nav>({ v: "menu" })
  const [menuOpen, setMenuOpen] = useState(true)
  const [foundOpen, setFoundOpen] = useState(true)
  const [type, setType] = useState<TypeFilter>("all")

  const isOpen = (id: string) => status[id] === "Відкрита"
  const allIds = stories.filter((s) => isOpen(s.id)).map((s) => s.id)
  const favIds = data.favs.filter(isOpen)
  const tagStories = (tagId: string) =>
    allIds.filter((id) => (data.assign[id] ?? []).includes(tagId))
  const tagCount = (tagId: string) => tagStories(tagId).length

  const back = () => {
    if (nav.v === "topic") setNav({ v: "topics" })
    else if (nav.v === "tag") setNav({ v: "tags" })
    else setNav({ v: "menu" })
    setType("all")
  }

  const go = (n: Nav) => {
    setNav(n)
    setType("all")
  }

  const typesOf = (id: string) => {
    const t = new Set<string>(storyMedia(id).map((m) => m.kind))
    if (story(id).hasText) t.add("text")
    return t
  }

  const StoryRows = ({ ids, empty }: { ids: string[]; empty: string }) => {
    const shown = ids.filter((id) => type === "all" || typesOf(id).has(type))
    return (
      <>
        <div className="lib-types">
          {(
            [
              ["all", "Усі"],
              ["video", "Відео"],
              ["audio", "Аудіо"],
              ["text", "Текст"],
            ] as const
          ).map(([k, l]) => (
            <FilterButton key={k} active={type === k} onClick={() => setType(k)}>
              {l}
            </FilterButton>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="lib-hint">{empty}</p>
        ) : (
          <ul className="found-list">
            {shown.map((id) => {
              const media = storyMedia(id)
              const dur = media.reduce((a, m) => a + m.duration, 0)
              return (
                <li key={id}>
                  <Checkbox
                    checked={p.storySel.includes(id)}
                    onChange={() => p.onToggleStory(id)}
                    title="Додати до сценарію"
                  />
                  <button
                    className="found-item"
                    onClick={() => p.onOpenMedia(media[0].id)}
                  >
                    <span className="found-title">{story(id).title}</span>
                    <span className="found-meta">
                      {[...typesOf(id)].map((t) => (
                        <Icon key={t} n={TYPE_ICON[t]} s={14} />
                      ))}
                      {dur > 0 && fmt(dur)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </>
    )
  }

  const NavItem = ({
    icon,
    label,
    count,
    to,
  }: {
    icon: IconName
    label: string
    count?: number
    to: Nav
  }) => (
    <button onClick={() => go(to)}>
      <Icon n={icon} s={20} />
      <span className="lbl">{label}</span>
      {count !== undefined && count > 0 && <small>{count}</small>}
      <span className="nav-go">
        <Icon n="down" s={16} />
      </span>
    </button>
  )

  let title = "Бібліотека"
  let body: React.ReactNode = null
  if (nav.v === "all") {
    title = "Усі матеріали"
    body = <StoryRows ids={allIds} empty="Матеріалів немає." />
  } else if (nav.v === "topics") {
    title = "Теми"
    body = (
      <nav className="side-nav">
        {RUBRICS.map((r) => (
          <button key={r.id} title={r.description} onClick={() => go({ v: "topic", id: r.id })}>
            <span className="lbl">{r.title}</span>
            <small>{r.storyIds.filter(isOpen).length}</small>
            <span className="nav-go">
              <Icon n="down" s={16} />
            </span>
          </button>
        ))}
      </nav>
    )
  } else if (nav.v === "topic") {
    const r = RUBRICS.find((x) => x.id === nav.id)!
    title = r.title
    body = (
      <>
        <LinkButton onClick={() => p.onAsk(r.title)} disabled={p.busy}>
          <Icon n="search" s={14} /> Запитати про тему в чаті
        </LinkButton>
        <StoryRows ids={r.storyIds.filter(isOpen)} empty="У цій темі немає історій." />
      </>
    )
  } else if (nav.v === "favs") {
    title = "Обране"
    body = <StoryRows ids={favIds} empty="Позначайте історії зірочкою — вони з’являться тут." />
  } else if (nav.v === "tags") {
    title = "Теги"
    body = (
      <>
        {data.tags.length === 0 ? (
          <p className="lib-hint">Тегів ще немає.</p>
        ) : (
          <nav className="side-nav">
            {data.tags.map((t) => (
              <button key={t.id} onClick={() => go({ v: "tag", id: t.id })}>
                <Icon n="tag" s={20} />
                <span className="lbl">{t.name}</span>
                <small>{tagCount(t.id)}</small>
                <span className="nav-go">
                  <Icon n="down" s={16} />
                </span>
              </button>
            ))}
          </nav>
        )}
        <LinkButton onClick={p.onManageTags}>Керувати тегами</LinkButton>
      </>
    )
  } else if (nav.v === "tag") {
    const t = data.tags.find((x) => x.id === nav.id)
    title = t?.name ?? "Тег"
    body = <StoryRows ids={tagStories(nav.id)} empty="З цим тегом ще немає історій." />
  }

  return (
    <aside className="lib" aria-label="Бібліотека">
      {nav.v === "menu" ? (
        <>
          <button
            className="acc-head side-head"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>Бібліотека</span>
            <span className={`acc-chev ${menuOpen ? "is-open" : ""}`}>
              <Icon n="down" s={18} />
            </span>
          </button>
          {menuOpen && (
            <nav className="side-nav">
              <NavItem icon="video" label="Усі матеріали" count={allIds.length} to={{ v: "all" }} />
              <NavItem icon="list" label="Теми" count={RUBRICS.length} to={{ v: "topics" }} />
              <NavItem icon="star" label="Обране" count={favIds.length} to={{ v: "favs" }} />
              <NavItem icon="tag" label="Теги" to={{ v: "tags" }} />
            </nav>
          )}
          {p.foundStories.length > 0 && (
            <div className="lib-section">
              <button
                className="acc-head side-label"
                aria-expanded={foundOpen}
                onClick={() => setFoundOpen(!foundOpen)}
              >
                <span>Знайдені матеріали</span>
                <span className={`acc-chev ${foundOpen ? "is-open" : ""}`}>
                  <Icon n="down" s={18} />
                </span>
              </button>
              {foundOpen && (
                <ul className="found-list">
                  {p.foundStories.map((m) => (
                    <li key={m.storyId}>
                      <Checkbox
                        checked={p.storySel.includes(m.storyId)}
                        onChange={() => p.onToggleStory(m.storyId)}
                        title="Додати до сценарію"
                      />
                      <button
                        className="found-item"
                        onClick={() => p.onOpenMedia(m.id)}
                      >
                        <span className="found-title">{m.story}</span>
                        <span className="found-meta">
                          <Icon n={m.kind === "video" ? "video" : "audio"} s={14} />
                          {fmt(m.duration)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="lib-crumb">
            <IconButton aria-label="Назад" onClick={back}>
              <Icon n="back" s={20} />
            </IconButton>
            <span>{title}</span>
          </div>
          <div className="lib-body">{body}</div>
        </>
      )}
      {p.selSummary && (
        <div className="lib-section">
          <div className="sel-row">
            <span>Вибрано: {p.selSummary}</span>
            <LinkButton onClick={p.onClear}>Скасувати</LinkButton>
          </div>
          <Button variant="primary" disabled={!p.canScript} onClick={p.onGenerate}>
            <Icon n="spark" s={14} />
            Згенерувати сценарій
          </Button>
        </div>
      )}
    </aside>
  )
}
