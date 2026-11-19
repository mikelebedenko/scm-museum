import { Button } from "../components/Button"
import { Chip } from "../components/Chip"
import { IconButton } from "../components/IconButton"
import { useMemo, useState } from "react"
import { useMe, useStore, useActions } from "../store"
import { Icon, Modal, Empty, toast } from "../ui"
import { stories, storyCover, LANG, thumbUrl } from "../data"
import { fmt } from "../lib"
import { TagPicker, UserTagChips, TagFilter } from "./shared"

/** FR-30–32: створення, редагування та видалення власних тегів. */
export function TagsModal({ onClose }: { onClose: () => void }) {
  const { data } = useMe()
  const a = useActions()
  const [name, setName] = useState("")
  const [edit, setEdit] = useState<string | null>(null)
  const [val, setVal] = useState("")
  const [del, setDel] = useState<string | null>(null)
  const uses = (id: string) =>
    Object.values(data.assign).filter((x) => x.includes(id)).length
  const dup = (n: string, except?: string) =>
    data.tags.some(
      (t) => t.id !== except && t.name.toLowerCase() === n.trim().toLowerCase(),
    )
  const add = () => {
    const n = name.trim()
    if (!n) return
    if (dup(n)) {
      toast("Такий тег уже існує")
      return
    }
    a.createTag(n)
    setName("")
  }
  const save = (id: string) => {
    const n = val.trim()
    if (!n) return
    if (dup(n, id)) {
      toast("Такий тег уже існує")
      return
    }
    a.renameTag(id, n)
    setEdit(null)
    toast("Тег оновлено")
  }
  return (
    <Modal title="Мої теги" onClose={onClose}>
      <div className="newtag">
        <input
          placeholder="Назва нового тегу…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <Button variant="primary" onClick={add} disabled={!name.trim()}>
          <Icon n="plus" s={14} />
          Створити
        </Button>
      </div>
      {data.tags.length === 0 && (
        <Empty icon="tag" title="Тегів ще немає">
          Створіть тег і призначайте його історіям у результатах.
        </Empty>
      )}
      <div className="tlist">
        {data.tags.map((t) => (
          <div key={t.id} className="trow">
            {edit === t.id ? (
              <div className="tr1">
                <input
                  autoFocus
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save(t.id)
                    if (e.key === "Escape") setEdit(null)
                  }}
                />
                <Button variant="primary" size="sm" onClick={() => save(t.id)}>
                  Зберегти
                </Button>
                <Button size="sm" onClick={() => setEdit(null)}>
                  Скасувати
                </Button>
              </div>
            ) : (
              <div className="tr1">
                <b>
                  <Icon n="tag" s={14} />
                  {t.name}
                </b>
                <small>{uses(t.id)} історій</small>
                <IconButton
                  size="sm"
                  aria-label="Перейменувати"
                  onClick={() => {
                    setEdit(t.id)
                    setVal(t.name)
                  }}
                >
                  <Icon n="edit" s={14} />
                </IconButton>
                <IconButton
                  size="sm"
                  aria-label="Видалити"
                  onClick={() => setDel(t.id)}
                >
                  <Icon n="trash" s={14} />
                </IconButton>
              </div>
            )}
            {del === t.id && (
              <div className="confirm">
                <span>Видалити тег і зняти його з {uses(t.id)} історій?</span>
                <Button size="sm" onClick={() => setDel(null)}>
                  Ні
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    a.deleteTag(t.id)
                    setDel(null)
                    toast("Тег видалено")
                  }}
                >
                  Видалити
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  )
}

/** FR-26–29: власний перелік «Обране» з фільтром за тегами. */
export function FavoritesModal({
  onClose,
  onOpen,
}: {
  onClose: () => void
  onOpen: (mid: string) => void
}) {
  const { state } = useStore()
  const { data } = useMe()
  const a = useActions()
  const [tagF, setTagF] = useState<string[]>([])
  const toggle = (t: string) =>
    setTagF((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))
  const open = data.favs
    .map((id) => stories.find((s) => s.id === id))
    .filter(
      (s): s is typeof stories[number] =>
        !!s && state.settings.storyStatus[s.id] === "Відкрита",
    )
  const hiddenN = data.favs.length - open.length
  const list = useMemo(
    () =>
      open.filter((s) =>
        tagF.every((t) =>
          t.startsWith("my:")
            ? (data.assign[s.id] ?? []).includes(t.slice(3))
            : s.tags.includes(t),
        ),
      ),
    [open, tagF, data.assign],
  )
  return (
    <Modal wide title="Обране" onClose={onClose}>
      <div className="filters flat">
        <TagFilter sel={tagF} toggle={toggle} />
        {tagF.map((t) => (
          <Chip tone="selected" key={t}>
            {t.startsWith("my:")
              ? data.tags.find((x) => x.id === t.slice(3))?.name
              : t}
            <button onClick={() => toggle(t)}>
              <Icon n="close" s={10} />
            </button>
          </Chip>
        ))}
        {tagF.length > 0 && (
          <button className="lnk" onClick={() => setTagF([])}>
            Скинути
          </button>
        )}
      </div>
      {hiddenN > 0 && (
        <div className="banner">
          <Icon n="lock" s={14} />
          {hiddenN} істор. приховано: їх більше не позначено як «Відкриті».
        </div>
      )}
      {open.length === 0 && (
        <Empty icon="star" title="Обране порожнє">
          Додавайте цілі історії зірочкою у результатах пошуку або на сайті
          музею.
        </Empty>
      )}
      {open.length > 0 && list.length === 0 && (
        <Empty icon="filter" title="Немає історій з такими тегами">
          Змініть або скиньте фільтр.
        </Empty>
      )}
      <div className="favlist">
        {list.map((s) => {
          const m = storyCover(s.id)
          return (
            <div key={s.id} className="favrow">
              <button
                className="thumb sm"
                onClick={() => onOpen(m.id)}
                aria-label={`Відкрити ${s.title}`}
              >
                <img
                  src={thumbUrl(m.id, 240, 160)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden"
                  }}
                />
                <span className="pl">
                  <Icon n="play" s={14} fill />
                </span>
              </button>
              <div className="fb">
                <span className="story-label">ІСТОРІЯ</span>
                <h3>
                  <button className="hlink" onClick={() => onOpen(m.id)}>
                    {s.title}
                  </button>
                </h3>
                <p className="muted sm">{s.summary}</p>
                <p className="muted sm">
                  {m.kind === "video" ? "Відео" : "Аудіо"} · текстовий опис ·{" "}
                  {LANG[m.lang]} · {fmt(m.duration)}
                </p>
                <div className="chips">
                  {s.tags.slice(0, 4).map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                  <UserTagChips storyId={s.id} removable />
                  <TagPicker storyId={s.id} />
                </div>
              </div>
              <IconButton
                active
                className="fav"
                aria-label="Видалити з Обраного"
                title="Видалити з Обраного"
                onClick={() => {
                  a.toggleFav(s.id)
                  toast("Історію видалено з Обраного")
                }}
              >
                <Icon n="star" s={16} fill />
              </IconButton>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
