import { useEffect, useMemo, useRef, useState } from "react"
import { useMe, useStore, useActions } from "../store"
import Media from "./Media"
import { Icon, Popover, Modal, Empty, toast, Tip } from "../ui"
import {
  SUGGESTIONS,
  LANG,
  thumbUrl,
  frag,
  mat,
  fragStart,
  fragEnd,
  fragQuote,
  fragWho,
  stories,
  storyCover,
  RUBRICS,
  fragments,
} from "../data"
import { fmt, range, dShort, dt } from "../lib"
import { TagPicker, UserTagChips, TagFilter, LangFilter } from "./shared"
import { TagsModal, FavoritesModal } from "./Library"
import type { Msg } from "../types"

export default function Search() {
  const { state } = useStore()
  const { data, perms } = useMe()
  const a = useActions()
  const chat = data.chats.find((c) => c.id === data.active) ?? null
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [pick, setPick] = useState<string | null>(null)
  const [hist, setHist] = useState(false)
  const [hq, setHq] = useState("")
  const [del, setDel] = useState<string | null>(null)
  const end = useRef<HTMLDivElement>(null)
  const [type, setType] = useState<"all" | "audio" | "video">("all")
  const [lang, setLang] = useState<string[]>([])
  const [tagF, setTagF] = useState<string[]>([])
  const [sel, setSel] = useState<string[]>([])
  const [storySel, setStorySel] = useState<string[]>([])
  const [script, setScript] = useState(false)
  const [media, setMedia] = useState<{ id: string t: number e: number } | null>(
    null,
  )
  const [favOnly, setFavOnly] = useState(false)
  const [scripts, setScripts] = useState(false)
  const [tagsM, setTagsM] = useState(false)
  const [favsM, setFavsM] = useState(false)
  const status = state.settings.storyStatus

  const aiMsgs = chat?.msgs.filter((m) => m.role === "ai") ?? []
  const active: Msg | undefined =
    aiMsgs.find((m) => m.id === pick) ?? aiMsgs[aiMsgs.length - 1]
  const [view, setView] = useState<"search" | "rubrics">("rubrics")
  const [rubric, setRubric] = useState("all")
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [chat?.msgs.length, busy])
  useEffect(() => {
    setSel([])
  }, [active?.id])

  const taRef = useRef<HTMLTextAreaElement>(null)
  const newChat = () => {
    setView("rubrics")
    // порожній чат не дублюємо: просто переводимо фокус на поле запиту
    if (chat && chat.msgs.length === 0)
      toast("Поточний чат порожній — введіть запит")
    else {
      a.newChat()
      setPick(null)
      toast("Створено новий чат")
    }
    setTimeout(() => taRef.current?.focus(), 50)
  }

  const send = (text: string, force = false) => {
    if (!text.trim() || busy) return
    setBusy(true)
    setView("search")
    setInput("")
    setPick(null)
    a.sendQuery(text.trim(), chat?.id ?? null, force, () => setBusy(false))
  }

  // BR-03: приховуємо фрагменти історій, що перестали бути «Відкрита»
  const allHits = active?.hits ?? []
  const open = allHits.filter(
    (h) => status[mat(frag(h.fid).mid).storyId] === "Відкрита",
  )
  const hidden = allHits.length - open.length
  const hits = useMemo(
    () =>
      open.filter((h) => {
        const f = frag(h.fid)
        const m = mat(f.mid)
        if (type !== "all" && m.kind !== type) return false
        if (lang.length && !lang.includes(m.lang)) return false
        if (favOnly && !data.favs.includes(m.storyId)) return false
        return tagF.every((t) =>
          t.startsWith("my:")
            ? (data.assign[m.storyId] ?? []).includes(t.slice(3))
            : m.tags.includes(t) || f.tags.includes(t),
        )
      }),
    [open, type, lang, tagF, favOnly, data.assign, data.favs],
  )
  // для сценарію враховуємо лише виділені фрагменти, що видно після фільтрів
  const picked = sel.filter((id) => hits.some((h) => h.fid === id))
  const storyFragments = fragments
    .filter((f) => storySel.includes(mat(f.mid).storyId))
    .map((f) => f.id)
  const scriptIds = Array.from(new Set([...picked, ...storyFragments]))
  const filtersOn =
    type !== "all" || lang.length > 0 || tagF.length > 0 || favOnly
  const toggleSel = (id: string) =>
    setSel((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]))
  const toggleTag = (t: string) =>
    setTagF((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))
  const browseStories = stories.filter(
    (s) =>
      status[s.id] === "Відкрита" &&
      (rubric === "all" ||
        RUBRICS.find((item) => item.id === rubric)?.storyIds.includes(s.id)),
  )

  const histChats = data.chats.filter(
    (c) =>
      !hq.trim() ||
      c.title.toLowerCase().includes(hq.toLowerCase()) ||
      c.msgs.some((m) =>
        (m.text + (m.answer ?? "")).toLowerCase().includes(hq.toLowerCase()),
      ),
  )
  const snippet = (c: typeof data.chats[number]) => {
    const m = c.msgs.find((x) =>
      (x.text + (x.answer ?? "")).toLowerCase().includes(hq.toLowerCase()),
    )
    return m ? (m.text || m.answer || "").slice(0, 70) : ""
  }

  return (
    <div className="ws">
      <section className="chatcol" aria-label="Пошуковий чат">
        <div className="colhead">
          <div className="relative grow">
            <button
              className="chtitle"
              onClick={() => setHist(!hist)}
              aria-expanded={hist}
            >
              <b>{chat?.title ?? "Чат"}</b>
            </button>
            <Popover
              open={hist}
              onClose={() => setHist(false)}
              className="hist"
            >
              <label className="fld inl">
                <Icon n="search" s={14} />
                <input
                  autoFocus
                  placeholder="Пошук за текстом у чатах…"
                  value={hq}
                  onChange={(e) => setHq(e.target.value)}
                />
              </label>
              <div className="pop-list tall">
                {histChats.length === 0 && (
                  <p className="muted sm pad">Нічого не знайдено</p>
                )}
                {histChats.map((c) => (
                  <div
                    key={c.id}
                    className={`hrow ${c.id === data.active ? "on" : ""}`}
                  >
                    <button
                      onClick={() => {
                        a.setActive(c.id)
                        setPick(null)
                        setView(
                          c.msgs.some((m) => m.role === "ai")
                            ? "search"
                            : "rubrics",
                        )
                        setHist(false)
                        setHq("")
                      }}
                    >
                      <b>{c.title}</b>
                      <small>
                        {dShort(c.created)} ·{" "}
                        {c.msgs.filter((m) => m.role === "user").length} запитів
                      </small>
                      {hq && snippet(c) && <em>…{snippet(c)}…</em>}
                    </button>
                    <button
                      className="ib sm"
                      onClick={() => setDel(c.id)}
                      aria-label="Видалити чат"
                    >
                      <Icon n="trash" s={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Popover>
          </div>
          <Tip text="Створити новий пошуковий чат">
            <button className="btn" onClick={newChat}>
              <Icon n="plus" s={14} />
              Новий чат
            </button>
          </Tip>
        </div>

        <div className="thread">
          {(!chat || chat.msgs.length === 0) && (
            <div className="intro">
              <h2>Що ви шукаєте в архіві?</h2>
              <p>
                Опишіть тему природною мовою — платформа знайде релевантні
                історії та покаже точні фрагменти їхніх джерел.
              </p>
              <div className="sugs">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
              {!perms.has("ai") && (
                <p className="locknote">
                  <Icon n="lock" s={13} /> Відповіді ШІ та контекстний діалог
                  доступні з Розширеною роллю.
                </p>
              )}
            </div>
          )}
          {chat?.msgs.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="q">
                <span className="mark" />
                {m.text}
              </div>
            ) : (
              <div
                key={m.id}
                className={`ans ${active?.id === m.id ? "cur" : ""}`}
              >
                <button
                  className="ansbtn"
                  onClick={() => {
                    setPick(m.id)
                    setView("search")
                  }}
                  aria-label="Показати результати цього запиту"
                >
                  {m.status === "error" && (
                    <div className="state err">
                      <Icon n="alert" />
                      Не вдалося отримати результати пошуку.
                    </div>
                  )}
                  {m.status === "empty" && (
                    <div className="state">
                      <Icon n="search" />
                      Релевантних історій не знайдено.
                    </div>
                  )}
                  {m.status === "ok" && (
                    <div className="found">
                      <b>
                        {
                          new Set(
                            m.hits?.map((h) => mat(frag(h.fid).mid).storyId) ??
                              [],
                          ).size
                        }
                      </b>{" "}
                      історій знайдено
                      {m.ctx && (
                        <span className="ctx">з урахуванням контексту</span>
                      )}
                    </div>
                  )}
                  {m.answer ? (
                    <p className="aitext">
                      <Icon n="spark" s={13} /> {m.answer}
                    </p>
                  ) : (
                    m.status === "ok" && (
                      <p className="locknote">
                        <Icon n="lock" s={13} /> Відповідь ШІ — з Розширеною
                        роллю
                      </p>
                    )
                  )}
                </button>
                {m.status === "error" && (
                  <button
                    className="btn sm"
                    onClick={() => send(m.query ?? "", true)}
                  >
                    Повторити запит
                  </button>
                )}
              </div>
            ),
          )}
          {busy && (
            <div className="ans">
              <div className="state">
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>{" "}
                Шукаю в індексі…
              </div>
            </div>
          )}
          <div ref={end} />
        </div>

        <div className="composer">
          <textarea
            ref={taRef}
            value={input}
            placeholder="Сформулюйте запит або уточніть попередній…"
            rows={2}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
          />
          <div className="crow">
            <button
              className="btn gold"
              disabled={busy || !input.trim()}
              onClick={() => send(input)}
            >
              <Icon n="send" s={14} />
              Шукати
            </button>
          </div>
        </div>
      </section>

      <section className="rescol" aria-label="Історії архіву">
        <div className="colhead">
          <div className="modehead grow">
            <div
              className="seg2 viewmode viewmode-head"
              aria-label="Режим перегляду"
            >
              <button
                className={view === "search" ? "on" : ""}
                onClick={() => setView("search")}
              >
                Результати пошуку ·{" "}
                {active
                  ? new Set(hits.map((h) => mat(frag(h.fid).mid).storyId)).size
                  : 0}
              </button>
              <button
                className={view === "rubrics" ? "on" : ""}
                onClick={() => setView("rubrics")}
              >
                Рубрики
              </button>
            </div>
            {scriptIds.length > 0 && (
              <span className="selpill" role="status">
                <i />
                До сценарію:{" "}
                {[
                  storySel.length ? `${storySel.length} іст.` : "",
                  picked.length ? `${picked.length} фрагм.` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
                <button
                  onClick={() => {
                    setSel([])
                    setStorySel([])
                  }}
                  aria-label="Скасувати вибір"
                  title="Скасувати вибір"
                >
                  <Icon n="close" s={10} />
                </button>
              </span>
            )}
          </div>
          <Tip text="Мій список «Обране»">
            <button className="btn" onClick={() => setFavsM(true)}>
              <Icon n="star" s={14} />
              Обране{data.favs.length ? ` · ${data.favs.length}` : ""}
            </button>
          </Tip>
          <Tip text="Створення, редагування та видалення власних тегів">
            <button className="btn" onClick={() => setTagsM(true)}>
              <Icon n="tag" s={14} />
              Теги
            </button>
          </Tip>
          <Tip text="Збережені чернетки сценаріїв">
            <button className="btn" onClick={() => setScripts(true)}>
              <Icon n="file" s={14} />
              Чернетки{data.scripts.length ? ` · ${data.scripts.length}` : ""}
            </button>
          </Tip>
          <Tip
            text={
              !perms.has("script")
                ? "Потрібна Розширена роль"
                : scriptIds.length === 0
                  ? "Спершу оберіть історії в рубриках або фрагменти пошуку"
                  : "Створити текстову чернетку сценарію з обраних джерел"
            }
          >
            <button
              className="btn gold"
              disabled={!perms.has("script") || scriptIds.length === 0}
              onClick={() => setScript(true)}
            >
              <Icon n="spark" s={14} />
              Згенерувати сценарій
            </button>
          </Tip>
        </div>
        <div className="filters">
          {view === "rubrics" ? (
            <div className="rubric-tabs">
              <button
                className={`fbtn ${rubric === "all" ? "on" : ""}`}
                onClick={() => setRubric("all")}
              >
                Усі історії
              </button>
              {RUBRICS.map((item) => (
                <button
                  key={item.id}
                  className={`fbtn ${rubric === item.id ? "on" : ""}`}
                  onClick={() => setRubric(item.id)}
                >
                  {item.title}
                  <span>{item.storyIds.length}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="seg2">
                {(["all", "video", "audio"] as const).map((t) => (
                  <button
                    key={t}
                    className={type === t ? "on" : ""}
                    onClick={() => setType(t)}
                  >
                    {t === "all" ? "Усі" : t === "video" ? "Відео" : "Аудіо"}
                  </button>
                ))}
              </div>
              <LangFilter
                sel={lang}
                toggle={(l) =>
                  setLang((x) =>
                    x.includes(l) ? x.filter((y) => y !== l) : [...x, l],
                  )
                }
              />
              <TagFilter sel={tagF} toggle={toggleTag} />
              <button
                className={`fbtn ${favOnly ? "on" : ""}`}
                onClick={() => setFavOnly(!favOnly)}
                aria-pressed={favOnly}
              >
                <Icon n="star" s={13} fill={favOnly} />
                Обране
              </button>
              {filtersOn && (
                <button
                  className="lnk"
                  onClick={() => {
                    setType("all")
                    setLang([])
                    setTagF([])
                    setFavOnly(false)
                  }}
                >
                  Скинути
                </button>
              )}
            </>
          )}
        </div>
        {view === "search" && tagF.length > 0 && (
          <div className="activetags">
            {tagF.map((t) => (
              <span key={t} className="chip on">
                {t.startsWith("my:")
                  ? data.tags.find((x) => x.id === t.slice(3))?.name
                  : t}
                <button onClick={() => toggleTag(t)}>
                  <Icon n="close" s={10} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="results">
          {view === "rubrics" && (
            <div className="rubric-view">
              <div className="rubric-intro">
                <div>
                  <h2>
                    {rubric === "all"
                      ? "Досліджуйте історії за темами"
                      : RUBRICS.find((item) => item.id === rubric)?.title}
                  </h2>
                  <p>
                    {rubric === "all"
                      ? "Переглядайте відкриті історії архіву й додавайте цікаві до персонального кабінету."
                      : RUBRICS.find((item) => item.id === rubric)?.description}
                  </p>
                </div>
                <span className="rubric-count">
                  <small>Історій</small>
                  <b>{browseStories.length}</b>
                </span>
              </div>
              <div className="story-grid">
                {browseStories.map((s) => (
                  <BrowseStory
                    key={s.id}
                    story={s}
                    selected={storySel.includes(s.id)}
                    onToggle={() =>
                      setStorySel((current) =>
                        current.includes(s.id)
                          ? current.filter((id) => id !== s.id)
                          : [...current, s.id],
                      )
                    }
                    onOpen={(id) => setMedia({ id, t: 0, e: 0 })}
                  />
                ))}
              </div>
            </div>
          )}
          {view === "search" && hidden > 0 && (
            <div className="banner">
              <Icon n="lock" s={14} />
              {hidden} фрагм. приховано: історію більше не позначено як
              «Відкрита».
            </div>
          )}
          {view === "search" && !active && (
            <Empty icon="search" title="Почніть із запиту">
              Тут з’являться історії та релевантні фрагменти їхніх відео, аудіо
              й текстів.
            </Empty>
          )}
          {view === "search" && active?.status === "error" && (
            <Empty icon="alert" title="Не вдалося отримати результати">
              Спробуйте повторити запит пізніше.
            </Empty>
          )}
          {view === "search" && active?.status === "empty" && (
            <Empty icon="search" title="Релевантних фрагментів не знайдено">
              Спробуйте інші слова або ширше формулювання.
            </Empty>
          )}
          {view === "search" &&
            active?.status === "ok" &&
            hits.length === 0 && (
              <Empty icon="filter" title="Нічого не відповідає фільтрам">
                Змініть або скиньте фільтри.
              </Empty>
            )}
          {view === "search" &&
            hits.map((h) => {
              const f = frag(h.fid)
              const m = mat(f.mid)
              const s = fragStart(f),
                e = fragEnd(f)
              const key = `${active!.id}:${f.id}`
              const fav = data.favs.includes(m.storyId)
              return (
                <article
                  key={h.fid}
                  className={`frag ${sel.includes(f.id) ? "sel" : ""}`}
                  onClick={(ev) => {
                    // клік по картці вибирає фрагмент; інтерактивні елементи всередині працюють самостійно
                    if (
                      (ev.target as HTMLElement).closest(
                        "button, a, input, label, select, textarea, .pop",
                      )
                    )
                      return
                    if (window.getSelection()?.toString()) return
                    toggleSel(f.id)
                  }}
                >
                  <div className="fr-media">
                    <button
                      className="thumb"
                      onClick={() => setMedia({ id: m.id, t: s, e })}
                      aria-label={`Відкрити ${m.title} з ${fmt(s)}`}
                    >
                      <img
                        src={thumbUrl(m.id, 480, 270)}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden"
                        }}
                      />
                      <span className="pl">
                        <Icon n="play" s={16} fill />
                      </span>
                      <span className={`kb ${m.kind}`}>
                        <Icon n={m.kind} s={11} />
                        {fmt(m.duration)}
                      </span>
                      <span
                        className="pos"
                        title="Положення фрагмента в записі"
                      >
                        <i
                          style={{
                            left: `${(s / m.duration) * 100}%`,
                            width: `${Math.max(2, ((e - s) / m.duration) * 100)}%`,
                          }}
                        />
                      </span>
                    </button>
                    <label className="cb on-thumb" title="Додати до сценарію">
                      <input
                        type="checkbox"
                        checked={sel.includes(f.id)}
                        onChange={() => toggleSel(f.id)}
                      />
                      <span />
                    </label>
                  </div>
                  <div className="fr-body">
                    <header className="fr-head">
                      <div className="fr-id">
                        <span className="story-label">ІСТОРІЯ</span>
                        <h3>{m.story}</h3>
                        <p className="fr-meta">
                          <span className={`kind ${m.kind}`}>
                            <Icon n={m.kind} s={12} />
                            {m.kind === "video" ? "Відео" : "Аудіо"}
                          </span>
                          <span>{LANG[m.lang]}</span>
                          <span className="tcr" title="Часові межі фрагмента">
                            {fmt(s)} – {fmt(e)}
                          </span>
                          <span
                            className="score"
                            title="Семантична релевантність"
                          >
                            {h.score}% збіг
                          </span>
                        </p>
                        <p className="source-line">
                          Джерело:{" "}
                          <button
                            className="hlink"
                            onClick={() => setMedia({ id: m.id, t: s, e })}
                          >
                            {m.title}
                          </button>
                        </p>
                      </div>
                      <button
                        className={`ib fav ${fav ? "on" : ""}`}
                        onClick={() => {
                          a.toggleFav(m.storyId)
                          toast(
                            fav
                              ? "Історію видалено з Обраного"
                              : "Історію додано до Обраного",
                          )
                        }}
                        aria-label={
                          fav
                            ? "Видалити історію з Обраного"
                            : "Додати історію до Обраного"
                        }
                        title={
                          fav
                            ? "Видалити історію з Обраного"
                            : "Додати історію до Обраного"
                        }
                      >
                        <Icon n="star" s={18} fill={fav} />
                      </button>
                    </header>
                    <p className="desc">{f.desc}</p>
                    <p className="quote">
                      <b>{fragWho(f)}:</b> «{fragQuote(f)}»
                    </p>
                    <div className="chips">
                      {f.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                      <UserTagChips storyId={m.storyId} />
                      <TagPicker storyId={m.storyId} />
                    </div>
                    <footer className="fr-foot">
                      <button
                        className="btn sm"
                        onClick={() => setMedia({ id: m.id, t: s, e })}
                      >
                        <Icon n="play" s={12} fill />
                        Відкрити з {fmt(s)}
                      </button>
                      <div
                        className="fr-rate"
                        role="group"
                        aria-label="Оцінка релевантності"
                      >
                        <button
                          className={`rt ${
                            data.ratings[key] === "rel" ? "on" : ""
                          }`}
                          onClick={() => a.rate(key, "rel")}
                          aria-pressed={data.ratings[key] === "rel"}
                        >
                          <Icon n="up" s={13} />
                          Релевантно
                        </button>
                        <button
                          className={`rt dn ${
                            data.ratings[key] === "irrel" ? "on bad" : ""
                          }`}
                          onClick={() => a.rate(key, "irrel")}
                          aria-pressed={data.ratings[key] === "irrel"}
                        >
                          <Icon n="up" s={13} />
                          Нерелевантно
                        </button>
                      </div>
                    </footer>
                  </div>
                </article>
              )
            })}
        </div>
        {media && (
          <Media
            key={`${media.id}:${media.t}`}
            id={media.id}
            t0={media.t}
            e0={media.e}
            onClose={() => setMedia(null)}
          />
        )}
      </section>

      {tagsM && <TagsModal onClose={() => setTagsM(false)} />}
      {favsM && (
        <FavoritesModal
          onClose={() => setFavsM(false)}
          onOpen={(id) => {
            setFavsM(false)
            setMedia({ id, t: 0, e: 0 })
          }}
        />
      )}
      {scripts && <ScriptsModal onClose={() => setScripts(false)} />}
      {del && (
        <Modal
          title="Видалити чат?"
          onClose={() => setDel(null)}
          foot={
            <>
              <button className="btn" onClick={() => setDel(null)}>
                Скасувати
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  a.deleteChat(del)
                  setDel(null)
                  setPick(null)
                  toast("Чат видалено")
                }}
              >
                Видалити
              </button>
            </>
          }
        >
          <p>Чат і всі його запити та результати буде видалено безповоротно.</p>
        </Modal>
      )}
      {script && (
        <ScriptModal ids={scriptIds} onClose={() => setScript(false)} />
      )}
    </div>
  )
}

function BrowseStory({
  story,
  selected,
  onToggle,
  onOpen,
}: {
  story: typeof stories[number]
  selected: boolean
  onToggle: () => void
  onOpen: (id: string) => void
}) {
  const { data } = useMe()
  const a = useActions()
  const cover = storyCover(story.id)
  const fav = data.favs.includes(story.id)

  return (
    <article className={`story-card ${selected ? "selected" : ""}`}>
      <label className="cb story-select" title="Додати історію до сценарію">
        <input type="checkbox" checked={selected} onChange={onToggle} />
        <span />
        <em>До сценарію</em>
      </label>
      <button
        className="story-cover"
        onClick={() => onOpen(cover.id)}
        aria-label={`Відкрити історію ${story.title}`}
      >
        <img
          src={thumbUrl(cover.id, 640, 360)}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden"
          }}
        />
        <span className="story-open">
          <Icon n="play" s={15} fill />
          Відкрити
        </span>
      </button>
      <div className="story-card-body">
        <header>
          <div>
            <span className="story-label">ІСТОРІЯ</span>
            <h3>
              <button className="hlink" onClick={() => onOpen(cover.id)}>
                {story.title}
              </button>
            </h3>
          </div>
        </header>
        <p>{story.summary}</p>
        <div className="chips">
          {story.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
          <UserTagChips storyId={story.id} />
          <TagPicker storyId={story.id} />
        </div>
        <footer className="story-actions">
          <button
            className={`btn sm ${fav ? "gold" : ""}`}
            onClick={() => {
              a.toggleFav(story.id)
              toast(
                fav
                  ? "Історію видалено з Обраного"
                  : "Історію додано до Обраного",
              )
            }}
          >
            <Icon n="star" s={14} fill={fav} />
            {fav ? "В Обраному" : "Додати в Обране"}
          </button>
          <button className="lnk" onClick={() => onOpen(cover.id)}>
            Переглянути історію
          </button>
        </footer>
      </div>
    </article>
  )
}

function ScriptModal({ ids, onClose }: { ids: string[] onClose: () => void }) {
  const a = useActions()
  const [prompt, setPrompt] = useState("")
  const [out, setOut] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const run = () => {
    if (!prompt.trim()) return
    setBusy(true)
    setTimeout(() => {
      setOut(a.genScript(prompt.trim(), ids).body)
      setBusy(false)
    }, 900)
  }
  return (
    <Modal
      wide
      title="Чернетка сценарію"
      onClose={onClose}
      foot={
        out ? (
          <>
            <button
              className="btn"
              onClick={() => {
                navigator.clipboard?.writeText(out)
                toast("Скопійовано")
              }}
            >
              <Icon n="copy" s={14} />
              Копіювати
            </button>
            <button className="btn gold" onClick={onClose}>
              Готово
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={onClose}>
              Скасувати
            </button>
            <button
              className="btn gold"
              disabled={!prompt.trim() || busy}
              onClick={run}
            >
              <Icon n="spark" s={14} />
              {busy ? "Генерація…" : "Згенерувати"}
            </button>
          </>
        )
      }
    >
      {!out ? (
        <>
          <p className="sub">
            Джерела: <b>{ids.length}</b> фрагм.{" "}
            {ids.length === 0 && "— оберіть фрагменти у результатах."}
          </p>
          <label className="fld">
            <span>Тема, акценти та напрям висвітлення (промпт)</span>
            <textarea
              rows={5}
              value={prompt}
              autoFocus
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Напр.: Зосередься на взаємодопомозі незнайомих людей під час евакуації; тон — стриманий, документальний."
            />
          </label>
          <div className="demo local">
            Генерація виконується локально в інфраструктурі Замовника. Чернетка
            збережеться автоматично.
          </div>
        </>
      ) : (
        <>
          <div className="okmsg">
            <Icon n="check" />
            Збережено автоматично; чернетку можна переглянути кнопкою
            «Сценарії».
          </div>
          <pre className="scriptout">{out}</pre>
        </>
      )}
    </Modal>
  )
}

function ScriptsModal({ onClose }: { onClose: () => void }) {
  const { data } = useMe()
  const a = useActions()
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Modal wide title="Збережені сценарії" onClose={onClose}>
      {data.scripts.length === 0 && (
        <Empty icon="file" title="Сценаріїв ще немає">
          Оберіть фрагменти та натисніть «Сценарій».
        </Empty>
      )}
      {data.scripts.map((sc) => (
        <div key={sc.id} className="scr">
          <div className="scr-h">
            <button
              className="hlink"
              onClick={() => setOpen(open === sc.id ? null : sc.id)}
            >
              <b>{sc.title}</b>
            </button>
            <small>
              {dt(sc.created)} · {sc.sources.length} матеріалів
            </small>
            <button
              className="ib sm"
              aria-label="Копіювати"
              onClick={() => {
                navigator.clipboard?.writeText(sc.body)
                toast("Скопійовано")
              }}
            >
              <Icon n="copy" s={14} />
            </button>
            <button
              className="ib sm"
              aria-label="Видалити"
              onClick={() => {
                a.deleteScript(sc.id)
                toast("Сценарій видалено")
              }}
            >
              <Icon n="trash" s={14} />
            </button>
          </div>
          <p className="muted sm">Промпт: {sc.prompt}</p>
          {open === sc.id && <pre className="scriptout">{sc.body}</pre>}
        </div>
      ))}
    </Modal>
  )
}
export { range }
