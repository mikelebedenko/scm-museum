# Design tokens — SCM.Museum

Єдине джерело: [`src/styles/tokens.css`](../src/styles/tokens.css) → папка `src/styles/tokens/`. Живий довідник: `/#/tokens`.
Правило: у `index.css` і компонентах — **тільки `var(--token)`**, без hex/rgba/px «з голови».

## Колекції (як у Figma-бібліотеці)
| Файл | Колекція |
|---|---|
| `tokens/colors.css` | Colors |
| `tokens/typography.css` | Typography |
| `tokens/stroke.css` | Stroke |
| `tokens/radius.css` | Radius |
| `tokens/scale.css` | Scale (контроли, іконки, лейаут) |
| `tokens/spacing.css` | Spacing |
| `tokens/components.css` | Component Tokens (`--btn-*`, `--chip-*`, `--field-*`, `--card-*`, `--panel-*`, `--modal-*`, `--tab-*`, `--table-*`…) |
| `tokens/effects.css` | тіні, z-index, рух, стани (додатково) |

Поки токенізовано компоненти: button, icon button, chip, field/select, card, panel, modal/popover/toast, tabs, table, header. Інші класи читають базові токени напряму.

## Три рівні
1. **Примітиви** `--p-*` — сирі значення (палітра). Напряму в компонентах не використовуються.
2. **Семантичні** `--color-*`, `--type-*`, `--space-*`… — те, що вживаємо у стилях.
3. **Компоненти** — класи в `index.css`, які читають семантичні токени.
Тема/ребрендинг = зміна примітивів і посилань у секції «Кольори».

## Кольори
| Група | Токени |
|---|---|
| Поверхні | `bg`, `surface-1…4`, `surface-sunken` |
| Текст | `text`, `text-muted`, `text-subtle`, `text-on-accent`, `text-on-media` |
| Межі | `border`, `border-strong`, `border-stronger` |
| Акцент | `accent`, `accent-hover`, `accent-wash/-subtle/-muted/-border` |
| Статуси | `success`, `danger`, `warning` (+ `-bg`, `-border`, `-text`), `info` |
| Медіа | `media-video`, `media-audio` |
| Накладки | `scrim`, `overlay`, `overlay-strong` |

Прозорі варіанти акценту й статусів рахуються через `color-mix` від базового кольору — змінюєте один токен, змінюються всі.

## Типографіка
Шрифт: Montserrat (`--font-sans`), моно — `--font-mono`.
Шкала: `--fs-xs 11 · sm 12 · md 13 · base 14 · lg 16 · xl 18 · 2xl 22 · 3xl 28 · 4xl 36`.
Ваги: `--fw-regular 400 · medium 500 · semibold 600 · bold 700`. Інтерліньяж: `--lh-none/tight/snug/normal/relaxed`. Трекінг: `--ls-normal/wide/wider`.

Ролі (використовувати як `font: var(--type-…)`):

| Роль | Розмір | Де |
|---|---|---|
| `display` | 36 | hero на екрані входу |
| `h1` | 28 | назва сторінки/матеріалу |
| `h2` | 22 | заголовок розділу |
| `h3` | 18 | заголовок колонки/модалки |
| `h4` | 16 | заголовок картки |
| `body-lg/body/body-sm` | 16/14/13 | основний текст |
| `caption` | 12 | підписи, метадані |
| `label` | 13 semibold | кнопки, поля |
| `overline` | 11 | eyebrow (+ `uppercase`, `--ls-wider`) |
| `brand` | 22 medium | назва продукту в шапці |
| `mono` | 12 | таймкоди, цифри |

## Відступи, форма, розміри
- Відступи — крок 4px: `--space-half 2 · 1 4 · 2 8 · 3 12 · 4 16 · 5 20 · 6 24 · 8 32 · 10 40 · 12 48 · 14 56 · 20 80`.
- Радіуси: `xs 4 · sm 8 · md 12 · lg 16 · xl 20 · pill · full`.
- Межі: `--border-width 1px`, `--border-width-thick 2px`.
- Тіні/кільця: `--shadow-md`, `--shadow-accent`, `--shadow-inset`, `--ring-accent`, `--ring-focus`, `--focus-outline`.
- Висота контролів: `--control-xs 24 · sm 28 · md 36 · lg 44`. Іконки: `--icon-sm/md/lg`.
- Лейаут: `--header-height`, `--sidebar-width`, `--container-sm/md/lg`, `--app-min-width/height`.
- Шари: `--z-raised/panel/popover/tooltip/modal/toast`. Рух: `--duration-fast/base/slow`, `--ease`.

## Що ще не токенізовано
- Розміри декоративних елементів (іконки-крапки, прогрес-бари, thumbnail) та ширини колонок сітки — лишилися числами в `index.css`.
- Динамічна геометрія у `style={{}}` (позиції на таймлайні) — це дані, не стиль.
- Брейкпоінти (`@media (max-width: 1250px)`) — CSS-змінні в медіазапитах не працюють; винести можна окремо.

## Структура стилів
- `src/index.css` — лише список `@import`; порядок імпортів = порядок каскаду, **не змінювати**.
- `src/styles/tokens/` — токени; `src/styles/base.css` — reset і утиліти; `src/styles/components/*.css` — стилі за областями (shell, ui, search, media, player-*, fragment-card, stories…).
- Файли `auth.css`, `personal.css`, `admin.css` (+ частини `shell.css`/`ui.css`) зараз не використовуються в UI (екрани входу, обраного, аналітики, адмінки) — залишені як заготовка.
- У ряді файлів пізніші правила перекривають ранні (наприклад, кнопки та картки). Об'єднання дублікатів — окреме завдання.

## Перевірка
`pnpm lint:tokens` (скрипт `scripts/check-tokens.mjs`) шукає в `index.css`, `base.css` і `components/*.css`:
- сирі кольори: `#hex`, `rgb()/rgba()/hsl()`;
- `px` у `padding`, `margin`, `gap`, `font-size`, `border-radius`, `z-index` (мають бути `--space-*`, `--fs-*`, `--radius-*`, `--z-*`).
Висоти, ширини та негативні відступи не перевіряються. При порушеннях команда виходить з кодом 1 і друкує файл та рядок.

## Компоненти (src/components)
| Компонент | Props |
|---|---|
| `Button` | `variant`: default · primary · danger; `size`: md · sm; `wide` |
| `IconButton` | `aria-label` (обов'язково), `size`: md · sm, `active` |
| `Chip` | `tone`: default · mine · selected · add |
| `FilterButton` | `active` |
| `LinkButton` | — |
| `Checkbox` | `checked`, `onChange`, `title`, children = підпис |
| `Segmented` | `value`, `options[{value,label}]`, `onChange` |
| `Tabs` | `value`, `options[{value,label}]`, `onChange` |

Усі три — тонкі обгортки над класами `.btn` / `.ib` / `.chip`; розміри, радіуси й кольори беруться з Component Tokens. Нові кнопки пишемо через компоненти, а не `<button className="btn…">`.
Показ усіх варіантів: `/#/tokens`.

> Не запускайте `pnpm format` (oxfmt) на файлах з інлайновими типами: він прибирає `;` у `{ a: string; b: number }` і ламає синтаксис.

## Автоперевірки (CI)
`.github/workflows/ci.yml` на кожен push у `main` і кожен pull request запускає: `pnpm typecheck`, `pnpm lint:tokens`, `pnpm build`. Локально все разом: `pnpm check`.
