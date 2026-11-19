import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Checkbox } from "../components/Checkbox"
import { Segmented } from "../components/Segmented"
import { FilterButton } from "../components/FilterButton"
import { IconButton } from "../components/IconButton"
import { LinkButton } from "../components/LinkButton"
import { Icon, Popover, Tip, type IconName } from "../ui"
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
  frag,
  genreOf,
  mat,
  fragStart,
  fragEnd,
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
  | { v: "play"; id: string; text: boolean; t?: number; e?: number; prev: Nav }

type TypeFilter = "all" | "video" | "audio" | "text"

const TYPE_LABEL: Record<string, string> = {
  video: "Відео",
  audio: "Аудіо",
  text: "Текст",
}

const TYPE_ICON: Record<string, IconName> = {
  video: "video",
  audio: "audio",
  text: "file",
}

type Props = {
  foundStories: Material[]
  foundQuery: string
  storySel: string[]
  selSummary: string
  canScript: boolean
  busy: boolean
  open: boolean
  onToggle: () => void
  fragSel: string[]
  playReq: { id: string; t: number; e: number; n: number } | null
  onToggleStory: (id: string) => void
  onToggleFrag: (id: string) => void
  onSetStories: (ids: string[], on: boolean) => void
  onClear: () => void
  onGenerate: () => void
  onAsk: (q: string) => void
  onManageTags: () => void
  onOpenScripts: () => void
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
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    if (p.playReq)
      setNav({
        v: "play",
        id: p.playReq.id,
        text: false,
        t: p.playReq.t,
        e: p.playReq.e,
        prev: { v: "menu" },
      })
  }, [p.playReq])
  useEffect(() => {
    if (!p.selSummary) setSheet(false)
  }, [p.selSummary])
  useEffect(() => {
    if (!sheet) return
    const f = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false)
    addEventListener("keydown", f)
    return () => removeEventListener("keydown", f)
  }, [sheet])

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
        (type === "all" || storyMedia(id).some((m) => m.kind === type)) &&
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
                active={topic !== "all" || topicMenu}
                aria-expanded={topicMenu}
                onClick={() => setTopicMenu(!topicMenu)}
              >
                <span>
                  {topic === "all"
                    ? "Усі теми"
                    : RUBRICS.find((r) => r.id === topic)?.title}
                </span>
                <span className={`acc-chev ${topicMenu ? "is-open" : ""}`}>
                  <Icon n="down" s={14} />
                </span>
              </FilterButton>
              <Popover
                open={topicMenu}
                onClose={() => setTopicMenu(false)}
                className="topicpop"
              >
                <div className="topic-opts" role="listbox" aria-label="Тема">
                  {[{ id: "all", title: "Усі теми" }, ...RUBRICS].map((r) => (
                    <button
                      key={r.id}
                      role="option"
                      aria-selected={topic === r.id}
                      className={topic === r.id ? "on" : ""}
                      onClick={() => {
                        setTopic(r.id)
                        setTopicMenu(false)
                      }}
                    >
                      <span>{r.title}</span>
                      {topic === r.id && <Icon n="check" s={16} />}
                    </button>
                  ))}
                </div>
              </Popover>
            </span>
          )}
        </div>
        {shown.length > 1 && (
          <Checkbox
            className="lib-all"
            checked={shown.every((id) => p.storySel.includes(id))}
            onChange={() =>
              p.onSetStories(
                shown,
                !shown.every((id) => p.storySel.includes(id)),
              )
            }
          >
            <em>Вибрати всі ({shown.length})</em>
          </Checkbox>
        )}
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

  const StoryCard = ({ id, picked = false }: { id: string; picked?: boolean }) => {
    const st = story(id)
    const cover = storyCover(id)
    const types = typesOf(id)
    const dur = storyMedia(id).reduce((a, m) => a + m.duration, 0)
    const read = storyMedia(id).reduce((a, m) => a + (m.readMin ?? 0), 0)
    const sel = p.storySel.includes(id)
    // вигляд картки: за обраним типом, інакше за основним (відео → аудіо → текст)
    const kind: "video" | "audio" | "text" =
      !picked && type !== "all" && types.has(type)
        ? type
        : types.has("video")
          ? "video"
          : types.has("audio")
            ? "audio"
            : "text"
    const removeBtn = (
      <IconButton
        className="lib-card-remove"
        size="sm"
        aria-label="Прибрати зі сценарію"
        onClick={() => p.onToggleStory(id)}
      >
        <Icon n="close" s={16} />
      </IconButton>
    )
    const check = picked ? null : (
      <Checkbox
        className="lib-thumb-sel"
        checked={sel}
        onChange={() => p.onToggleStory(id)}
        title="Додати до сценарію"
      />
    )
    const goStory = () => {
      if (picked) setSheet(false)
      openStory(id)
    }
    return (
      <article
        className={`lib-story is-${kind} ${sel && !picked ? "selected" : ""} ${picked ? "is-picked" : ""}`}
      >
        {kind === "text" ? null : (
          <div className="lib-thumb">
            <button onClick={goStory} aria-label={`Відкрити історію ${st.title}`}>
              {kind === "video" ? (
                <img
                  src={thumbUrl(cover.id, 320, 200)}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden"
                  }}
                />
              ) : (
                <span className="lib-thumb-audio">
                  <Icon n="audio" s={36} />
                </span>
              )}
            </button>
            {check}
          </div>
        )}
        <div className="lib-story-body">
          {kind === "text" ? (
            <div className="lib-story-head">
              {check}
              <button className="lib-story-title" onClick={goStory}>
                {st.title}
              </button>
            </div>
          ) : (
            <button className="lib-story-title" onClick={goStory}>
              {st.title}
            </button>
          )}
          <p>{st.summary}</p>
          <span className="found-meta">
            {kind === "text" && genreOf(st.tags) && (
              <span className="lib-genre">{genreOf(st.tags)}</span>
            )}
            {[...types].map((t) => (
              <Tip key={t} text={TYPE_LABEL[t]}>
                <Icon n={TYPE_ICON[t]} s={14} />
              </Tip>
            ))}
            {dur > 0 && (
              <Tip text="Загальна тривалість">
                <span>{fmt(dur)}</span>
              </Tip>
            )}
            {dur === 0 && read > 0 && (
              <Tip text="Час читання">
                <span>{read} хв</span>
              </Tip>
            )}
          </span>
        </div>
        {picked && removeBtn}
      </article>
    )
  }

  const FragCard = ({ fid }: { fid: string }) => {
    const f = frag(fid)
    const m = mat(f.mid)
    const kind = m.kind
    const range = `${fmt(fragStart(f))} – ${fmt(fragEnd(f))}`
    const open = () => {
      setSheet(false)
      setNav({ v: "play", id: m.id, text: false, t: fragStart(f), e: fragEnd(f), prev: nav })
    }
    return (
      <article className={`lib-story is-${kind} is-picked`}>
        {kind !== "text" && (
          <div className="lib-thumb">
            <button onClick={open} aria-label={`Відкрити фрагмент ${range}`}>
              {kind === "video" ? (
                <img
                  src={thumbUrl(m.id, 320, 200)}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden"
                  }}
                />
              ) : (
                <span className="lib-thumb-audio">
                  <Icon n="audio" s={36} />
                </span>
              )}
            </button>
          </div>
        )}
        <div className="lib-story-body">
          <button className="lib-story-title" onClick={open}>
            {m.story}
          </button>
          <p>{f.desc}</p>
          <span className="found-meta">
            <Tip text={TYPE_LABEL[kind]}>
              <Icon n={TYPE_ICON[kind]} s={14} />
            </Tip>
            <Tip text="Позначений фрагмент">
              <span>{range}</span>
            </Tip>
          </span>
        </div>
        <IconButton
          className="lib-card-remove"
          size="sm"
          aria-label="Прибрати фрагмент"
          onClick={() => p.onToggleFrag(fid)}
        >
          <Icon n="close" s={16} />
        </IconButton>
      </article>
    )
  }

  const MatCard = ({
    m,
    asText = false,
    current = false,
    onOpen,
  }: {
    m: Material
    asText?: boolean
    current?: boolean
    onOpen: () => void
  }) => {
    const kind: "video" | "audio" | "text" = asText ? "text" : m.kind
    const heading = asText ? "Текст і транскрипція" : m.title
    const desc = asText
      ? "Повний текст розмови з поділом за мовцями"
      : `${m.speaker} · ${m.recorded}`
    return (
      <article className={`lib-story is-${kind} ${kind === "text" ? "is-mat-text" : ""} ${current ? "selected" : ""}`}>
        {kind !== "text" ? (
          <div className="lib-thumb">
            <button onClick={onOpen} aria-label={`Відкрити ${heading}`}>
              {kind === "video" ? (
                <img
                  src={thumbUrl(m.id, 320, 200)}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden"
                  }}
                />
              ) : (
                <span className="lib-thumb-audio">
                  <Icon n="audio" s={36} />
                </span>
              )}
            </button>
          </div>
        ) : (
          <span className="lib-kind-ico lib-kind-ico-lg">
            <Icon n="file" s={22} />
          </span>
        )}
        <div className="lib-story-body">
          <button className="lib-story-title" onClick={onOpen}>
            {heading}
          </button>
          <p>{desc}</p>
          {(kind !== "text" || (!asText && m.readMin)) && (
            <span className="found-meta">
              {kind !== "text" && (
                <Tip text={TYPE_LABEL[kind]}>
                  <Icon n={TYPE_ICON[kind]} s={14} />
                </Tip>
              )}
              {kind !== "text" && m.duration > 0 && (
                <Tip text="Тривалість">
                  <span>{fmt(m.duration)}</span>
                </Tip>
              )}
              {kind === "text" && !asText && m.readMin ? (
                <Tip text="Час читання">
                  <span>{m.readMin} хв читання</span>
                </Tip>
              ) : null}
            </span>
          )}
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
          <button key={r.id} className="has-desc" onClick={() => go({ v: "topic", id: r.id })}>
            <span className="lbl">
              {r.title}
              <span className="lib-desc">{r.description}</span>
            </span>
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
    title = "Вибране"
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
    const genre = genreOf(st.tags)
    title = "Історія"
    body = (
      <div className="lib-detail">
        {cover.kind === "video" && (
          <button className="lib-hero" onClick={() => play(cover.id)} aria-label="Відтворити">
            <img src={thumbUrl(cover.id, 640, 360)} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
            <span className="lib-hero-play"><Icon n="play" s={20} fill /></span>
          </button>
        )}
        {cover.kind === "audio" && (
          <button className="lib-hero is-audio" onClick={() => play(cover.id)} aria-label="Відтворити">
            <span className="lib-thumb-audio" />
            <span className="lib-wave" aria-hidden>
              {Array.from({ length: 34 }).map((_, i) => (
                <i key={i} style={{ height: `${14 + ((i * 37) % 70)}%` }} />
              ))}
            </span>
            <span className="lib-hero-play is-accent"><Icon n="play" s={20} fill /></span>
          </button>
        )}
        {cover.kind === "text" && (
          <button className="lib-hero is-text" onClick={() => play(cover.id, true)} aria-label="Читати">
            <span className="lib-thumb-audio" />
            <span className="lib-lines" aria-hidden>
              <i /><i /><i /><i /><i />
            </span>
            <span className="lib-read-btn">
              <Icon n="file" s={16} />
              Читати
            </span>
          </button>
        )}
        <div className="lib-detail-head">
          <h3>{st.title}</h3>
          <p className="lib-meta">
            {cover.kind === "text" && genre ? (
              <span className="lib-genre">{genre}</span>
            ) : (
              <span className={`kind ${cover.kind}`}>
                <Icon n={TYPE_ICON[cover.kind]} s={12} />
                {TYPE_LABEL[cover.kind]}
              </span>
            )}
            {cover.speaker} · {cover.recorded}
            {cover.duration > 0 && ` · ${fmt(cover.duration)}`}
            {cover.kind === "text" && cover.readMin ? ` · ${cover.readMin} хв читання` : ""}
          </p>
        </div>
        <p className="lib-hint">{st.summary}</p>
        <div className="chips">
          {st.tags
            .filter((t) => !genre || t.toLowerCase() !== genre.toLowerCase())
            .map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
        {cover.kind === "text" && cover.segments[0] && (
          <div className="lib-quote-wrap">
            <p className="lib-quote">«{cover.segments[0].uk}»</p>
            <LinkButton onClick={() => play(cover.id, true)}>Читати далі</LinkButton>
          </div>
        )}
        <div className="lib-actions">
          <Button size="sm" variant={fav ? "primary" : "default"} onClick={() => act.toggleFav(nav.id)}>
            <Icon n="star" s={14} fill={fav} />
            {fav ? "У вибраному" : "Додати до вибраного"}
          </Button>
          <Button size="sm" variant={sel ? "primary" : "default"} onClick={() => p.onToggleStory(nav.id)}>
            <Icon n={sel ? "check" : "plus"} s={14} />
            {sel ? "У сценарії" : "Додати до сценарію"}
          </Button>
        </div>
        {(() => {
          const extra = media.slice(1)
          const showTr = st.hasText && cover.kind !== "text"
          if (extra.length === 0 && !showTr) return null
          return (
            <>
              <hr className="lib-sep" />
              <h4 className="lib-subhead">Додаткові матеріали</h4>
              <div className="lib-cards">
                {extra.map((m) => (
                  <MatCard key={m.id} m={m} onOpen={() => play(m.id)} />
                ))}
                {showTr && (
                  <MatCard m={media[0]} asText onOpen={() => play(media[0].id, true)} />
                )}
              </div>
            </>
          )
        })()}
      </div>
    )
  } else if (nav.v === "play") {
    const cur = nav
    const st = story(storyOf(cur.id))
    title = "Історія"
    body = (
      <div className="lib-detail">
        <Media
          key={`${cur.id}:${cur.text}:${cur.t ?? 0}`}
          id={cur.id}
          t0={cur.t}
          e0={cur.e}
          inline
          textOnly={cur.text}
          selected={p.storySel.includes(st.id)}
          onToggleSelected={() => p.onToggleStory(st.id)}
          onClose={back}
        />
        {(() => {
          const all = storyMedia(st.id)
          const others = all.filter(
            (m) => m.id !== cur.id || (cur.text && m.kind !== "text"),
          )
          const showTr = st.hasText && !cur.text && !all.every((m) => m.kind === "text")
          if (others.length === 0 && !showTr) return null
          return (
            <>
              <hr className="lib-sep" />
              <h4 className="lib-subhead">Додаткові матеріали</h4>
              <div className="lib-cards">
                {others.map((m) => (
                  <MatCard
                    key={m.id}
                    m={m}
                    onOpen={() => setNav({ ...cur, id: m.id, text: false })}
                  />
                ))}
                {showTr && (
                  <MatCard m={all[0]} asText onOpen={() => setNav({ ...cur, text: true })} />
                )}
              </div>
            </>
          )
        })()}
      </div>
    )
  } else if (nav.v === "tag") {
    const t = data.tags.find((x) => x.id === nav.id)
    title = t?.name ?? "Тег"
    body = <StoryRows ids={tagStories(nav.id)} empty="З цим тегом ще немає історій." />
  }

  if (!p.open) {
    const railGo = (to: Nav) => {
      go(to)
      p.onToggle()
    }
    const items: { icon: IconName; label: string; run: () => void }[] = [
      { icon: "grid", label: "Усі історії", run: () => railGo({ v: "all" }) },
      { icon: "list", label: "Теми", run: () => railGo({ v: "topics" }) },
      { icon: "star", label: "Вибране", run: () => railGo({ v: "favs" }) },
      { icon: "tag", label: "Теги", run: () => railGo({ v: "tags" }) },
      { icon: "file", label: "Сценарії", run: p.onOpenScripts },
    ]
    return (
      <aside className="lib-rail" aria-label="Бібліотека">
        <Tip text="Показати бібліотеку">
          <IconButton aria-label="Показати бібліотеку" onClick={p.onToggle}>
            <Icon n="panelR" s={20} />
          </IconButton>
        </Tip>
        <hr className="lib-rail-sep" />
        {items.map((it, i) => (
          <span key={it.label} className="lib-rail-item">
            {i === 1 && <hr className="lib-rail-sep" />}
            <Tip text={it.label}>
              <IconButton aria-label={it.label} onClick={it.run}>
                <Icon n={it.icon} s={22} />
              </IconButton>
            </Tip>
          </span>
        ))}
      </aside>
    )
  }
  const collapseBtn = (
    <IconButton
      className="lib-collapse"
      aria-label="Сховати бібліотеку"
      onClick={p.onToggle}
    >
      <Icon n="panelR" s={20} />
    </IconButton>
  )
  const fragRows = p.fragSel
  const sheetDur =
    p.storySel.reduce(
      (a, id) =>
        a + storyMedia(id).reduce((x, m) => x + (m.kind === "text" ? 0 : m.duration), 0),
      0,
    ) +
    fragRows.reduce((a, fid) => {
      const f = frag(fid)
      return mat(f.mid).kind === "text" ? a : a + fragEnd(f) - fragStart(f)
    }, 0)
  const sheetRead = p.storySel.reduce(
    (a, id) => a + storyMedia(id).reduce((x, m) => x + (m.readMin ?? 0), 0),
    0,
  )
  const sheetSummary = [
    p.storySel.length ? `${p.storySel.length} іст.` : "",
    fragRows.length ? `${fragRows.length} фрагм.` : "",
    sheetDur > 0 ? `${fmt(sheetDur)} запису` : "",
    sheetRead > 0 ? `${sheetRead} хв читання` : "",
  ]
    .filter(Boolean)
    .join(" · ")
  const showBar = !!p.selSummary
  return (
    <aside className="lib" aria-label="Бібліотека">
      {sheet ? (
        <div className="lib-sheet">
          <div className="lib-sheet-head">
            <h3 className="lib-sheet-title">Для сценарію</h3>
            <p className="lib-sheet-sum">{sheetSummary}</p>
          </div>
          {p.storySel.length > 0 && (
            <>
              {fragRows.length > 0 && <h4 className="lib-subhead">Історії</h4>}
              <div className="lib-cards">
                {p.storySel.map((id) => (
                  <StoryCard key={id} id={id} picked />
                ))}
              </div>
            </>
          )}
          {fragRows.length > 0 && (
            <>
              {p.storySel.length > 0 && <hr className="lib-sep" />}
              <h4 className="lib-subhead">Фрагменти</h4>
              <div className="lib-cards">
                {fragRows.map((fid) => (
                  <FragCard key={fid} fid={fid} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="lib-scroll">
          {nav.v === "menu" ? (
            <>
              <div className="lib-head">
                <button
                  className="acc-head side-head lib-title-btn"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span>Бібліотека</span>
                  <span className={`acc-chev ${menuOpen ? "is-open" : ""}`}>
                    <Icon n="down" s={22} />
                  </span>
                </button>
                {collapseBtn}
              </div>
              {menuOpen && (
                <nav className="side-nav lib-menu lib-menu-main">
                  <NavItem icon="grid" label="Усі історії" count={allIds.length} to={{ v: "all" }} />
                  <hr className="lib-sep" />
                  <NavItem icon="list" label="Теми" count={RUBRICS.length} to={{ v: "topics" }} />
                  <NavItem icon="star" label="Вибране" count={favIds.length} to={{ v: "favs" }} />
                  <NavItem icon="tag" label="Теги" to={{ v: "tags" }} />
                  <button onClick={p.onOpenScripts}>
                    <Icon n="file" s={24} />
                    <span className="lbl">Сценарії</span>
                    {data.scripts.length > 0 && <small>{data.scripts.length}</small>}
                  </button>
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
                    <small className="lib-count">{p.foundStories.length}</small>
                    <span className={`acc-chev ${foundOpen ? "is-open" : ""}`}>
                      <Icon n="down" s={22} />
                    </span>
                  </button>
                  {foundOpen && p.foundQuery && (
                    <p className="lib-found-q">
                      За запитом «{p.foundQuery}»
                    </p>
                  )}
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
                {collapseBtn}
              </div>
              <div className="lib-body">{body}</div>
            </>
          )}
        </div>
      )}
      {showBar && (
        <div className="lib-bar">
          <div className="sel-row">
            <button
              className="sel-toggle"
              aria-expanded={sheet}
              onClick={() => setSheet(!sheet)}
            >
              <span>Вибрано: {p.selSummary}</span>
              <span className={`acc-chev ${sheet ? "" : "is-open"}`}>
                <Icon n="down" s={16} />
              </span>
            </button>
            <LinkButton onClick={p.onClear}>Очистити все</LinkButton>
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
