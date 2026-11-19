import { useState } from "react"
import { Button } from "../components/Button"
import { Checkbox } from "../components/Checkbox"
import { Segmented } from "../components/Segmented"
import { FilterButton } from "../components/FilterButton"
import { IconButton } from "../components/IconButton"
import { LinkButton } from "../components/LinkButton"
import { Icon, Popover, type IconName } from "../ui"
import Media from "./Media"
import { Chip } from "../components/Chip"
import { useActions, useMe, useStore } from "../store"
import {
  RUBRICS,
  materials,
  stories,
  story,
  storyMedia,
  storyCover,
  thumbUrl,
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
  | { v: "story"; id: string; prev: Nav }
  | { v: "play"; id: string; text: boolean; prev: Nav }

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
  onClear: () => void
  onGenerate: () => void
  onAsk: (q: string) => void
  onManageTags: () => void
}

export function LibPanel(p: Props) {
  const { data } = useMe()
  const { state } = useStore()
  const act = useActions()
  const status = state.settings.storyStatus
  const [nav, setNav] = useState<Nav>({ v: "menu" })
  const [menuOpen, setMenuOpen] = useState(true)
  const [foundOpen, setFoundOpen] = useState(true)
  const [type, setType] = useState<TypeFilter>("all")
  const [topic, setTopic] = useState("all")
  const [topicMenu, setTopicMenu] = useState(false)

  const isOpen = (id: string) => status[id] === "Відкрита"
  const allIds = stories.filter((s) => isOpen(s.id)).map((s) => s.id)
  const favIds = data.favs.filter(isOpen)
  const tagStories = (tagId: string) =>
    allIds.filter((id) => (data.assign[id] ?? []).includes(tagId))
  const tagCount = (tagId: string) => tagStories(tagId).length

  const back = () => {
    if (nav.v === "story" || nav.v === "play") { setNav(nav.prev); return }
    if (nav.v === "topic") setNav({ v: "topics" })
    else if (nav.v === "tag") setNav({ v: "tags" })
    else setNav({ v: "menu" })
    setType("all")
    setTopic("all")
  }

  const go = (n: Nav) => {
    setNav(n)
    setType("all")
    setTopic("all")
  }
  const play = (id: string, text = false) =>
    setNav({ v: "play", id, text, prev: nav })
  const openStory = (id: string) => setNav({ v: "story", id, prev: nav })

  const storyOf = (mediaId: string) =>
    materials.find((m) => m.id === mediaId)!.storyId
  const typesOf = (id: string) => {
    const t = new Set<string>(storyMedia(id).map((m) => m.kind))
    if (story(id).hasText) t.add("text")
    return t
  }

  const StoryRows = ({
    ids,
    empty,
    topics = false,
  }: {
    ids: string[]
    empty: string
    topics?: boolean
  }) => {
    const shown = ids.filter(
      (id) =>
        (type === "all" || typesOf(id).has(type)) &&
        (topic === "all" ||
          RUBRICS.find((r) => r.id === topic)?.storyIds.includes(id)),
    )
    return (
      <>
        <div className="lib-filters">
          <Segmented
            className="lib-seg"
            aria-label="Тип матеріалів"
            value={type}
            onChange={setType}
            options={[
              { value: "all", label: "Усі" },
              { value: "video", label: "Відео" },
              { value: "audio", label: "Аудіо" },
              { value: "text", label: "Текст" },
            ]}
          />
          {topics && (
            <span className="relative">
              <FilterButton
                className="lib-topic-btn"
                active={topic !== "all"}
                aria-expanded={topicMenu}
                onClick={() => setTopicMenu(!topicMenu)}
              >
                <span>
                  {topic === "all"
                    ? "Теми"
                    : RUBRICS.find((r) => r.id === topic)?.title}
                </span>
                <Icon n="down" s={14} />
              </FilterButton>
              <Popover
                open={topicMenu}
                onClose={() => setTopicMenu(false)}
                className="topicpop"
              >
                <div className="pop-t">Тема</div>
                <div className="pop-list">
                  {[{ id: "all", title: "Усі теми" }, ...RUBRICS].map((r) => (
                    <button
                      key={r.id}
                      className={topic === r.id ? "on" : ""}
                      onClick={() => {
                        setTopic(r.id)
                        setTopicMenu(false)
                      }}
                    >
                      <span className="box">
                        {topic === r.id && <Icon n="check" s={11} />}
                      </span>
                      {r.title}
                    </button>
                  ))}
                </div>
              </Popover>
            </span>
          )}
        </div>
        {shown.length === 0 ? (
          <p className="lib-hint">{empty}</p>
        ) : (
          <div className="lib-cards">
            {shown.map((id) => (
              <StoryCard key={id} id={id} />
            ))}
          </div>
        )}
      </>
    )
  }

  const StoryCard = ({ id }: { id: string }) => {
    const st = story(id)
    const cover = storyCover(id)
    const dur = storyMedia(id).reduce((a, m) => a + m.duration, 0)
    const sel = p.storySel.includes(id)
    return (
      <article className={`lib-story ${sel ? "selected" : ""}`}>
        <div className="lib-thumb">
          <button onClick={() => openStory(id)} aria-label={`Відкрити історію ${st.title}`}>
            <img
              src={thumbUrl(cover.id, 320, 200)}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden"
              }}
            />
          </button>
          <Checkbox
            className="lib-thumb-sel"
            checked={sel}
            onChange={() => p.onToggleStory(id)}
            title="Додати до сценарію"
          />
        </div>
        <div className="lib-story-body">
          <button className="lib-story-title" onClick={() => openStory(id)}>
            {st.title}
          </button>
          <p>{st.summary}</p>
          <span className="found-meta">
            {[...typesOf(id)].map((t) => (
              <Icon key={t} n={TYPE_ICON[t]} s={14} />
            ))}
            {dur > 0 && fmt(dur)}
          </span>
        </div>
      </article>
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
      <Icon n={icon} s={24} />
      <span className="lbl">{label}</span>
      {count !== undefined && count > 0 && <small>{count}</small>}
    </button>
  )

  let title = "Бібліотека"
  let body: React.ReactNode = null
  if (nav.v === "all") {
    title = "Усі історії"
    body = <StoryRows ids={allIds} topics empty="Історій немає." />
  } else if (nav.v === "topics") {
    title = "Теми"
    body = (
      <nav className="side-nav lib-menu">
        {RUBRICS.map((r) => (
          <button key={r.id} onClick={() => go({ v: "topic", id: r.id })}>
            <span className="lbl">{r.title}</span>
            <small>{r.storyIds.filter(isOpen).length}</small>
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
          <nav className="side-nav lib-menu">
            {data.tags.map((t) => (
              <button key={t.id} onClick={() => go({ v: "tag", id: t.id })}>
                <Icon n="tag" s={24} />
                <span className="lbl">{t.name}</span>
                <small>{tagCount(t.id)}</small>
              </button>
            ))}
          </nav>
        )}
        <LinkButton onClick={p.onManageTags}>Керувати тегами</LinkButton>
      </>
    )
  } else if (nav.v === "story") {
    const st = story(nav.id)
    const cover = storyCover(nav.id)
    const media = storyMedia(nav.id)
    const fav = data.favs.includes(nav.id)
    const sel = p.storySel.includes(nav.id)
    title = "Історія"
    body = (
      <div className="lib-detail">
        <button className="lib-hero" onClick={() => play(cover.id)} aria-label="Відтворити">
          <img src={thumbUrl(cover.id, 640, 360)} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
          <span className="lib-hero-play"><Icon n="play" s={20} fill /></span>
        </button>
        <h3>{st.title}</h3>
        <p className="lib-hint">{st.summary}</p>
        <div className="chips">
          {st.tags.map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
        <div className="lib-actions">
          <Checkbox checked={sel} onChange={() => p.onToggleStory(nav.id)}>
            <em>До сценарію</em>
          </Checkbox>
          <Button size="sm" variant={fav ? "primary" : "default"} onClick={() => act.toggleFav(nav.id)}>
            <Icon n="star" s={14} fill={fav} />
            {fav ? "В Обраному" : "В Обране"}
          </Button>
        </div>
        <div className="side-label">Матеріали історії</div>
        <ul className="found-list">
          {media.map((m) => (
            <li key={m.id}>
              <button className="found-item" onClick={() => play(m.id)}>
                <span className="found-title">{m.title}</span>
                <span className="found-meta">
                  <Icon n={TYPE_ICON[m.kind]} s={14} />
                  {fmt(m.duration)}
                </span>
              </button>
            </li>
          ))}
          {st.hasText && (
            <li>
              <button className="found-item" onClick={() => play(media[0].id, true)}>
                <span className="found-title">Текст і транскрипція</span>
                <span className="found-meta"><Icon n="file" s={14} /></span>
              </button>
            </li>
          )}
        </ul>
      </div>
    )
  } else if (nav.v === "play") {
    const cur = nav
    const st = story(storyOf(cur.id))
    title = st.title
    body = (
      <div className="lib-detail">
        <Media key={`${cur.id}:${cur.text}`} id={cur.id} inline textOnly={cur.text} onClose={back} />
        <div className="side-label">Матеріали історії</div>
        <ul className="found-list">
          {storyMedia(st.id).map((m) => (
            <li key={m.id}>
              <button
                className={`found-item ${!cur.text && m.id === cur.id ? "is-current" : ""}`}
                onClick={() => setNav({ ...cur, id: m.id, text: false })}
              >
                <span className="found-title">{m.title}</span>
                <span className="found-meta">
                  <Icon n={TYPE_ICON[m.kind]} s={14} />
                  {fmt(m.duration)}
                </span>
              </button>
            </li>
          ))}
          {st.hasText && (
            <li>
              <button
                className={`found-item ${cur.text ? "is-current" : ""}`}
                onClick={() => setNav({ ...cur, text: true })}
              >
                <span className="found-title">Текст і транскрипція</span>
                <span className="found-meta"><Icon n="file" s={14} /></span>
              </button>
            </li>
          )}
        </ul>
      </div>
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
            <nav className="side-nav lib-menu lib-menu-main">
              <NavItem icon="grid" label="Усі історії" count={allIds.length} to={{ v: "all" }} />
              <hr className="lib-sep" />
              <NavItem icon="list" label="Теми" count={RUBRICS.length} to={{ v: "topics" }} />
              <NavItem icon="star" label="Обране" count={favIds.length} to={{ v: "favs" }} />
              <NavItem icon="tag" label="Теги" to={{ v: "tags" }} />
            </nav>
          )}
          {p.foundStories.length > 0 && (
            <div className="lib-section">
              <button
                className="acc-head side-head"
                aria-expanded={foundOpen}
                onClick={() => setFoundOpen(!foundOpen)}
              >
                <span>Знайдені історії</span>
                <span className={`acc-chev ${foundOpen ? "is-open" : ""}`}>
                  <Icon n="down" s={18} />
                </span>
              </button>
              {foundOpen && (
                <div className="lib-cards">
                  {p.foundStories.map((m) => (
                    <StoryCard key={m.storyId} id={m.storyId} />
                  ))}
                </div>
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
        <div className="lib-sticky">
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
