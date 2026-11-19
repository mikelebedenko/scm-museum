import { Tabs } from "../components/Tabs"
import { LinkButton } from "../components/LinkButton"
import { Button } from "../components/Button"
import { Chip } from "../components/Chip"
import { IconButton } from "../components/IconButton"
import { useEffect, useRef, useState } from "react"
import { useMe, useStore, useActions } from "../store"
import { Icon, Hint, Empty, Popover, toast } from "../ui"
import {
  materials,
  LANG,
  fragments,
  fragStart,
  fragEnd,
  thumbUrl,
} from "../data"
import { fmt } from "../lib"
import { TagPicker, UserTagChips } from "./shared"

const SPEEDS = [0.5, 1, 1.5, 2]

export default function Media({
  id,
  t0 = 0,
  e0 = 0,
  onClose,
}: {
  id: string
  t0?: number
  e0?: number
  onClose: () => void
}) {
  const { state } = useStore()
  const { data } = useMe()
  const a = useActions()
  const m = materials.find((x) => x.id === id)
  const [t, setT] = useState(t0)
  const [play, setPlay] = useState(t0 > 0)
  const [vol, setVol] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [sub, setSub] = useState<"off" | "uk" | "en">("uk")
  const [subMenu, setSubMenu] = useState(false)
  const [tab, setTab] = useState<"tr" | "info">("tr")
  const cur = useRef<HTMLButtonElement>(null)
  const dur = m?.duration ?? 1

  useEffect(() => {
    setT(t0)
    setPlay(t0 > 0)
  }, [id, t0])
  useEffect(() => {
    if (!play) return
    const id = setInterval(
      () =>
        setT((x) => {
          if (x + speed >= dur) {
            setPlay(false)
            return dur
          }
          return x + speed
        }),
      1000,
    )
    return () => clearInterval(id)
  }, [play, speed, dur])
  const idx = m ? m.segments.findIndex((s) => t >= s.s && t < s.e) : -1
  useEffect(() => {
    // прокручуємо лише список транскрипції, а не всю панель
    const el = cur.current
    const box = el?.parentElement
    if (play && el && box)
      box.scrollTo({
        top: el.offsetTop - box.clientHeight / 3,
        behavior: "smooth",
      })
  }, [idx, play])

  if (!m)
    return (
      <div className="mpanel">
        <Empty icon="alert" title="Матеріал не знайдено">
          <LinkButton onClick={onClose}>
            Закрити
          </LinkButton>
        </Empty>
      </div>
    )
  // BR-03: прямі посилання на матеріали з неВідкритих історій блокуються
  if (state.settings.storyStatus[m.storyId] !== "Відкрита")
    return (
      <div className="mpanel">
        <div className="denied">
          <Icon n="lock" s={28} />
          <h2>Доступ до матеріалу закрито</h2>
          <p>
            Історію «{m.story}» на публічному порталі більше не позначено як
            «Відкрита». Матеріали недоступні в результатах, чатах, Обраному та
            за прямими посиланнями.
          </p>
          <Button onClick={onClose}>Закрити</Button>
        </div>
      </div>
    )
  const fav = data.favs.includes(m.storyId)
  const seg = idx >= 0 ? m.segments[idx] : null
  const frs = fragments.filter((f) => f.mid === m.id)

  return (
    <div className="mpanel">
      <div className="media">
        <div className="mcrumb">
          <button className="backbtn" onClick={onClose}>
            <Icon n="back" s={16} />
            <span>Назад</span>
          </button>
          <div className="mstory">
            <small>Історія</small>
            <b>{m.story}</b>
          </div>
        </div>
        <div className="mgrid">
          <section className="mleft">
            <div
              className={`stage ${m.kind} ${play ? "playing" : ""}`}
              onClick={() => setPlay(!play)}
            >
              <img
                className="poster"
                src={thumbUrl(m.id, 960, 540)}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden"
                }}
              />
              {m.kind === "audio" ? (
                <div className="eq">
                  {Array.from({ length: 46 }).map((_, i) => (
                    <i
                      key={i}
                      style={{
                        height: `${14 + ((i * 37) % 70)}%`,
                        animationDelay: `${(i % 9) * 0.07}s`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="vid">
                  <Icon n="video" s={54} />
                </div>
              )}
              <div className="stream">
                <i />
                Потік зі сховища Замовника · копія не зберігається
              </div>
              <div className="tcbig">
                {fmt(t)}
                <small> / {fmt(dur)}</small>
              </div>
              {!play && (
                <button className="bigplay" aria-label="Відтворити">
                  <Icon n="play" s={26} fill />
                </button>
              )}
              {sub !== "off" && seg && (
                <div className="cue">{sub === "uk" ? seg.uk : seg.en}</div>
              )}
            </div>
            <div className="pbar">
              <div
                className="scrub"
                role="slider"
                tabIndex={0}
                aria-label="Позиція відтворення"
                aria-valuemin={0}
                aria-valuemax={dur}
                aria-valuenow={Math.round(t)}
                aria-valuetext={`${fmt(t)} з ${fmt(dur)}`}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  setT(
                    Math.min(
                      dur,
                      Math.max(0, ((e.clientX - r.left) / r.width) * dur),
                    ),
                  )
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") setT(Math.min(dur, t + 5))
                  if (e.key === "ArrowLeft") setT(Math.max(0, t - 5))
                }}
              >
                <div className="rail">
                  {frs.map((f) => (
                    <i
                      key={f.id}
                      className="mk"
                      title={f.desc}
                      style={{
                        left: `${(fragStart(f) / dur) * 100}%`,
                        width: `${((fragEnd(f) - fragStart(f)) / dur) * 100}%`,
                      }}
                    />
                  ))}
                  {e0 > t0 && (
                    <i
                      className="hit"
                      style={{
                        left: `${(t0 / dur) * 100}%`,
                        width: `${((e0 - t0) / dur) * 100}%`,
                      }}
                    />
                  )}
                  <i
                    className="fill"
                    style={{ width: `${(t / dur) * 100}%` }}
                  />
                </div>
                <i className="knob" style={{ left: `${(t / dur) * 100}%` }} />
              </div>
              <div className="prow">
                <div className="pl-grp">
                  <button
                    className="skip"
                    onClick={() => setT(Math.max(0, t - 10))}
                    aria-label="Назад на 10 секунд"
                    title="Назад на 10 секунд"
                  >
                    <Icon n="back" s={14} />
                    10
                  </button>
                  <button
                    className="pp"
                    onClick={() => setPlay(!play)}
                    aria-label={play ? "Пауза" : "Відтворити"}
                    title={play ? "Пауза" : "Відтворити"}
                  >
                    <Icon n={play ? "pause" : "play"} s={18} fill />
                  </button>
                  <button
                    className="skip"
                    onClick={() => setT(Math.min(dur, t + 10))}
                    aria-label="Вперед на 10 секунд"
                    title="Вперед на 10 секунд"
                  >
                    10
                    <Icon n="back" s={14} />
                  </button>
                  <span className="ptime">
                    <b>{fmt(t)}</b> / {fmt(dur)}
                  </span>
                </div>
                <div className="pr-grp">
                  <IconButton
                    onClick={() => setMuted(!muted)}
                    aria-label={muted ? "Увімкнути звук" : "Вимкнути звук"}
                    title="Звук"
                  >
                    <Icon n={muted || vol === 0 ? "mute" : "volume"} s={18} />
                  </IconButton>
                  <input
                    className="vol"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : vol}
                    style={
                      {
                        "--v": `${(muted ? 0 : vol) * 100}%`,
                      } as React.CSSProperties
                    }
                    onChange={(e) => {
                      setVol(+e.target.value)
                      setMuted(false)
                    }}
                    aria-label="Гучність"
                  />
                  <button
                    className="pill"
                    onClick={() =>
                      setSpeed(
                        SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length],
                      )
                    }
                    aria-label={`Швидкість ${speed}×, натисніть щоб змінити`}
                    title="Швидкість відтворення"
                  >
                    {speed}×
                  </button>
                  <span className="relative">
                    <button
                      className={`pill ${sub !== "off" ? "on" : ""}`}
                      onClick={() => setSubMenu(!subMenu)}
                      aria-expanded={subMenu}
                      title="Субтитри"
                    >
                      <Icon n="sub" s={15} />
                      {sub === "off"
                        ? "Субтитри"
                        : sub === "uk"
                          ? "Укр"
                          : "Eng"}
                      <Icon n="down" s={12} />
                    </button>
                    <Popover
                      open={subMenu}
                      onClose={() => setSubMenu(false)}
                      className="submenu"
                    >
                      <div className="pop-t">Субтитри</div>
                      <div className="pop-list">
                        {([
                          ["off", "Вимкнені"],
                          ["uk", "Українська"],
                          ["en", "English"],
                        ] as const).map(([k, v]) => (
                          <button
                            key={k}
                            className={sub === k ? "on" : ""}
                            onClick={() => {
                              setSub(k)
                              setSubMenu(false)
                            }}
                          >
                            <span className="box">
                              {sub === k && <Icon n="check" s={11} />}
                            </span>
                            {v}
                          </button>
                        ))}
                      </div>
                    </Popover>
                  </span>
                </div>
              </div>
              {e0 > t0 && (
                <button
                  className="hitchip"
                  onClick={() => {
                    setT(t0)
                    setPlay(true)
                  }}
                >
                  <i />
                  Знайдений фрагмент {fmt(t0)} – {fmt(e0)}
                  <span>До початку</span>
                </button>
              )}
            </div>
            <div className="mtitle">
              <div>
                <h1>{m.title}</h1>
                <p>
                  <span className={`kind ${m.kind}`}>
                    <Icon n={m.kind} s={12} />
                    {m.kind === "video" ? "Відео" : "Аудіо"}
                  </span>
                  <span className="open">Відкрита</span>
                  {LANG[m.lang]} · {m.recorded} · {fmt(m.duration)}
                </p>
              </div>
              <Button
                variant={fav ? "primary" : "default"}
                onClick={() => {
                  a.toggleFav(m.storyId)
                  toast(
                    fav
                      ? "Історію видалено з Обраного"
                      : "Історію додано до Обраного",
                  )
                }}
              >
                <Icon n="star" s={14} fill={fav} />
                {fav ? "Історія в Обраному" : "Додати історію"}
              </Button>
            </div>
          </section>
          <section className="mright">
            <Tabs
              value={tab}
              onChange={setTab}
              options={[
                { value: "tr", label: "Транскрипція" },
                { value: "info", label: "Метадані й теги" },
              ]}
            />
            {tab === "tr" ? (
              <div className="trans">
                {m.segments.map((s, i) => (
                  <button
                    key={i}
                    ref={i === idx ? cur : undefined}
                    className={`tl ${i === idx ? "cur" : ""} ${
                      s.s >= t0 && e0 > t0 && s.e <= e0 ? "hit" : ""
                    }`}
                    onClick={() => {
                      setT(s.s)
                      setPlay(true)
                    }}
                  >
                    <time>{fmt(s.s)}</time>
                    <b>{s.who}</b>
                    <span>{s.uk}</span>
                  </button>
                ))}
                <p className="muted sm pad">
                  Показано транскрипцію, підготовлену для користувацького
                  доступу (деперсоніфіковану).
                </p>
              </div>
            ) : (
              <div className="info">
                <dl>
                  {[
                    ["Мовлення", LANG[m.lang]],
                    ["Спікер", m.speaker],
                    ["Дата запису", m.recorded],
                    ["Тривалість", fmt(m.duration)],
                    ["Історія", m.story],
                    ["Субтитри", "Українська, English"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <h4>
                  Системні теги{" "}
                  <Hint text="Системні теги керуються на публічному порталі" />
                </h4>
                <div className="chips">
                  {m.tags.map((x) => (
                    <Chip key={x}>{x}</Chip>
                  ))}
                </div>
                <h4>Мої теги</h4>
                <div className="chips">
                  <UserTagChips storyId={m.storyId} removable />
                  <TagPicker storyId={m.storyId} />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
