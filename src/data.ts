export interface Segment {
  s: number
  e: number
  who: string
  uk: string
  en: string
}
export interface Material {
  id: string
  title: string
  kind: "audio" | "video"
  lang: "uk" | "en" | "ru"
  speaker: string
  recorded: string
  duration: number
  storyId: string
  story: string
  tags: string[]
  segments: Segment[]
}
export interface Fragment {
  id: string
  mid: string
  a: number
  b: number
  desc: string
  tags: string[]
}
export interface Story {
  id: string
  title: string
  summary: string
  tags: string[]
  mediaIds: string[]
  hasText: boolean
}
export interface Rubric {
  id: string
  title: string
  description: string
  storyIds: string[]
}

export const LANG: Record<string, string> = {
  uk: "Українська",
  en: "English",
  ru: "Російська",
}
const I = "Інтерв’юер"

export const materials: Material[] = [
  {
    id: "m1",
    title: "Інтерв’ю з Оленою Ковальчук",
    kind: "video",
    lang: "uk",
    speaker: "Олена Ковальчук",
    recorded: "14.03.2022",
    duration: 2292,
    storyId: "st1",
    story: "Підвали Лисичанська",
    tags: [
      "укриття",
      "обстріл",
      "діти",
      "вода",
      "взаємодопомога",
      "евакуація",
      "волонтери",
    ],
    segments: [
      {
        s: 0,
        e: 62,
        who: I,
        uk: "Олено, розкажіть, будь ласка, як ви опинилися в підвалі? З чого все почалося?",
        en: "Olena, please tell us how you ended up in the basement. How did it begin?",
      },
      {
        s: 62,
        e: 215,
        who: "Олена",
        uk: "Усе почалося раптово. Ми ще спали, коли почули перший вибух. Чоловік сказав: збирайся, бери дітей, ідемо вниз.",
        en: "It all began suddenly. We were still asleep when we heard the first blast. My husband said: get the children, we are going down.",
      },
      {
        s: 215,
        e: 398,
        who: "Олена",
        uk: "Підвал у нашому будинку старий, там стояли консервації й велосипеди. До кінця першого дня нас було вже двадцять три людини.",
        en: "The basement was old, full of preserves and bicycles. By the end of the first day there were twenty-three of us.",
      },
      {
        s: 398,
        e: 640,
        who: "Олена",
        uk: "На третю добу не лишилося води. Сусід Микола вийшов нагору й приніс трохи з крана. Це нас врятувало.",
        en: "On the third day we ran out of water. Our neighbour Mykola went upstairs and brought some from the tap. That saved us.",
      },
      {
        s: 640,
        e: 905,
        who: "Олена",
        uk: "На сьомий день прийшли волонтери й провели нас до гуманітарного коридору. Я вперше побачила небо.",
        en: "On the seventh day volunteers came and led us to the humanitarian corridor. I saw the sky for the first time.",
      },
    ],
  },
  {
    id: "m2",
    title: "Свідчення волонтера Андрія Кравця",
    kind: "audio",
    lang: "uk",
    speaker: "Андрій Кравець",
    recorded: "02.05.2022",
    duration: 2890,
    storyId: "st2",
    story: "Евакуаційні маршрути",
    tags: [
      "евакуація",
      "волонтери",
      "маршрут",
      "транспорт",
      "літні люди",
      "діти",
      "взаємодопомога",
    ],
    segments: [
      {
        s: 0,
        e: 48,
        who: I,
        uk: "Як ви почали допомагати людям з евакуацією?",
        en: "How did you start helping people with evacuation?",
      },
      {
        s: 48,
        e: 240,
        who: "Андрій",
        uk: "У перші дні плану не було. Ми складали списки людей, шукали транспорт і щоразу прокладали маршрут наново.",
        en: "In the first days there was no plan. We made lists of people, looked for transport and plotted the route anew every time.",
      },
      {
        s: 240,
        e: 470,
        who: "Андрій",
        uk: "Найскладніше було з пальним. Ми збирали його по краплі в усьому місті, і люди віддавали останнє.",
        en: "Fuel was the hardest part. We collected it drop by drop across the city, and people gave their last.",
      },
      {
        s: 470,
        e: 720,
        who: "Андрій",
        uk: "Ми вивезли понад чотириста людей, переважно літніх і мам з дітьми. Кожен рейс був ризиком.",
        en: "We evacuated over four hundred people, mostly the elderly and mothers with children. Every trip was a risk.",
      },
      {
        s: 720,
        e: 960,
        who: "Андрій",
        uk: "Коли повертаюся думкою туди, пам’ятаю не страх, а те, як чужі люди ставали родиною.",
        en: "When I think back, I remember not fear but how strangers became family.",
      },
    ],
  },
  {
    id: "m3",
    title: "Дорога до Дніпра: історія Ірини Савченко",
    kind: "video",
    lang: "uk",
    speaker: "Ірина Савченко",
    recorded: "21.06.2022",
    duration: 1884,
    storyId: "st3",
    story: "Шлях на захід",
    tags: [
      "евакуація",
      "дорога",
      "діти",
      "Дніпро",
      "вокзал",
      "взаємодопомога",
      "волонтери",
    ],
    segments: [
      {
        s: 0,
        e: 70,
        who: I,
        uk: "Розкажіть про дорогу з Лисичанська.",
        en: "Tell us about the road from Lysychansk.",
      },
      {
        s: 70,
        e: 290,
        who: "Ірина",
        uk: "Ми їхали двома автівками, колона стояла по шість годин на блокпостах. Діти засинали просто на задньому сидінні.",
        en: "We drove in two cars, the column stood for six hours at checkpoints. The children fell asleep right on the back seat.",
      },
      {
        s: 290,
        e: 520,
        who: "Ірина",
        uk: "На вокзалі в Дніпрі було дуже багато людей, але всі допомагали одне одному. Незнайома жінка тримала мою дитину, поки я шукала документи.",
        en: "There were very many people at the station in Dnipro, but everyone helped each other. A stranger held my child while I looked for documents.",
      },
      {
        s: 520,
        e: 760,
        who: "Ірина",
        uk: "Волонтери видали нам їжу, ковдри й телефон, щоб зателефонувати рідним. Я плакала вперше за кілька тижнів.",
        en: "Volunteers gave us food, blankets and a phone to call relatives. I cried for the first time in weeks.",
      },
    ],
  },
  {
    id: "m4",
    title: "Лікар про роботу лікарні в блокаді",
    kind: "audio",
    lang: "uk",
    speaker: "Михайло Гречко",
    recorded: "19.06.2022",
    duration: 2420,
    storyId: "st4",
    story: "Лікарня без світла",
    tags: ["медицина", "лікарня", "блокада", "поранені", "діти"],
    segments: [
      {
        s: 0,
        e: 55,
        who: I,
        uk: "Як працювала лікарня під час блокади?",
        en: "How did the hospital work during the blockade?",
      },
      {
        s: 55,
        e: 260,
        who: "Михайло",
        uk: "Лікарня працювала без світла і води. Лікарі оперували при ліхтарику, а вікна затуляли матрацами.",
        en: "The hospital worked without electricity or water. Doctors operated by flashlight and covered the windows with mattresses.",
      },
      {
        s: 260,
        e: 480,
        who: "Михайло",
        uk: "Бракувало ліків і перев’язувальних матеріалів. Ми розривали простирадла на бинти й кип’ятили воду на багатті у дворі.",
        en: "We lacked medicine and dressings. We tore sheets into bandages and boiled water over a fire in the yard.",
      },
      {
        s: 480,
        e: 700,
        who: "Михайло",
        uk: "Поранених привозили щогодини, серед них багато дітей. Ми приймали рішення за секунди, хто першим на стіл.",
        en: "Wounded arrived every hour, many of them children. We decided in seconds who goes to the table first.",
      },
    ],
  },
  {
    id: "m5",
    title: "Interview: volunteer at the border",
    kind: "video",
    lang: "en",
    speaker: "Sarah Mitchell",
    recorded: "30.03.2022",
    duration: 2105,
    storyId: "st5",
    story: "Кордон, березень 2022",
    tags: ["кордон", "біженці", "волонтери", "евакуація", "діти"],
    segments: [
      {
        s: 0,
        e: 50,
        who: I,
        uk: "Що ви побачили, коли вперше приїхали на кордон?",
        en: "What did you see when you first arrived at the border?",
      },
      {
        s: 50,
        e: 240,
        who: "Sarah",
        uk: "Ми приїхали вночі. Черга з машин тягнулася на кілометри, а родини йшли лише з однією сумкою.",
        en: "We arrived at night. The queue of cars stretched for kilometres, and families walked with just one bag each.",
      },
      {
        s: 240,
        e: 470,
        who: "Sarah",
        uk: "Наша команда поставила намет з гарячим чаєм, підгузками та зарядками. Ніхто не питав, хто ти.",
        en: "Our team set up a tent with hot tea, diapers and chargers. Nobody asked who anyone was.",
      },
      {
        s: 470,
        e: 690,
        who: "Sarah",
        uk: "Мені запам’яталося, наскільки спокійними були діти, бо мами не переставали усміхатися.",
        en: "What stays with me is how calm the children were, because their mothers kept smiling.",
      },
    ],
  },
  {
    id: "m6",
    title: "Повернення додому: розмова з Миколою Петренком",
    kind: "audio",
    lang: "ru",
    speaker: "Микола Петренко",
    recorded: "08.09.2022",
    duration: 1760,
    storyId: "st6",
    story: "Після деокупації",
    tags: ["повернення", "відбудова", "сусіди", "вода", "взаємодопомога"],
    segments: [
      {
        s: 0,
        e: 45,
        who: I,
        uk: "Коли ви повернулися до міста?",
        en: "When did you return to the city?",
      },
      {
        s: 45,
        e: 260,
        who: "Микола",
        uk: "Коли ми повернулися, вулиця здавалася водночас знайомою і зовсім іншою. Сусіди почали разом лагодити дахи ще до появи світла.",
        en: "When we returned, the street seemed both familiar and completely different. Neighbours began fixing roofs together before the power came back.",
      },
      {
        s: 260,
        e: 480,
        who: "Микола",
        uk: "Першим ми відновили водогін на нашій вулиці. Двадцять родин по черзі копали траншею.",
        en: "The first thing we restored was the water pipe on our street. Twenty families took turns digging the trench.",
      },
      {
        s: 480,
        e: 700,
        who: "Микола",
        uk: "Тепер ми вечорами сидимо надворі, як раніше. Це і є повернення додому.",
        en: "Now we sit outside in the evenings as before. That is what coming home means.",
      },
    ],
  },
  {
    id: "m7",
    title: "Свідчення про евакуацію з Попасної",
    kind: "audio",
    lang: "uk",
    speaker: "Анонімний свідок",
    recorded: "11.07.2022",
    duration: 1500,
    storyId: "st7",
    story: "Попасна (закрита історія)",
    tags: ["евакуація", "поранені"],
    segments: [
      {
        s: 0,
        e: 40,
        who: I,
        uk: "Розкажіть про день евакуації.",
        en: "Tell us about the day of the evacuation.",
      },
      {
        s: 40,
        e: 300,
        who: "Свідок",
        uk: "Евакуація почалася о шостій ранку, коли вщухли обстріли. Ми вивозили поранених на вантажівках.",
        en: "The evacuation began at six in the morning when shelling subsided. We carried the wounded on trucks.",
      },
    ],
  },
]

export const stories: Story[] = [
  {
    id: "st1",
    title: "Підвали Лисичанська",
    summary:
      "Свідчення родини про перші обстріли, життя в укритті, взаємодопомогу та евакуацію з міста.",
    tags: ["укриття", "обстріл", "діти", "вода", "взаємодопомога", "евакуація"],
    mediaIds: ["m1"],
    hasText: true,
  },
  {
    id: "st2",
    title: "Евакуаційні маршрути",
    summary:
      "Історія волонтера про організацію маршрутів, пошук транспорту та евакуацію цивільних.",
    tags: ["евакуація", "волонтери", "маршрут", "транспорт", "літні люди"],
    mediaIds: ["m2"],
    hasText: true,
  },
  {
    id: "st3",
    title: "Шлях на захід",
    summary:
      "Розповідь про виїзд із Лисичанська, блокпости, дорогу з дітьми та допомогу на вокзалі у Дніпрі.",
    tags: ["евакуація", "дорога", "діти", "Дніпро", "вокзал"],
    mediaIds: ["m3"],
    hasText: true,
  },
  {
    id: "st4",
    title: "Лікарня без світла",
    summary:
      "Свідчення лікаря про роботу медиків у блокаді без електрики, води та достатньої кількості ліків.",
    tags: ["медицина", "лікарня", "блокада", "поранені"],
    mediaIds: ["m4"],
    hasText: true,
  },
  {
    id: "st5",
    title: "Кордон, березень 2022",
    summary:
      "Історія міжнародної волонтерської допомоги родинам і дітям на кордоні навесні 2022 року.",
    tags: ["кордон", "біженці", "волонтери", "евакуація"],
    mediaIds: ["m5"],
    hasText: true,
  },
  {
    id: "st6",
    title: "Після деокупації",
    summary:
      "Розповідь про повернення додому, відбудову вулиці та відновлення водогону силами сусідів.",
    tags: ["повернення", "відбудова", "сусіди", "вода"],
    mediaIds: ["m6"],
    hasText: true,
  },
  {
    id: "st7",
    title: "Попасна",
    summary: "Закрита історія евакуації поранених із Попасної.",
    tags: ["евакуація", "поранені"],
    mediaIds: ["m7"],
    hasText: true,
  },
]

export const RUBRICS: Rubric[] = [
  {
    id: "evacuation",
    title: "Евакуація та дорога",
    description:
      "Виїзд із міст, гуманітарні коридори, маршрути й допомога в дорозі.",
    storyIds: ["st2", "st3", "st5"],
  },
  {
    id: "life-under-fire",
    title: "Життя під час війни",
    description: "Укриття, блокада та щоденні рішення цивільних у небезпеці.",
    storyIds: ["st1", "st4"],
  },
  {
    id: "mutual-aid",
    title: "Взаємодопомога",
    description:
      "Історії волонтерів, сусідів і незнайомих людей, які підтримували одне одного.",
    storyIds: ["st1", "st2", "st3", "st5", "st6"],
  },
  {
    id: "return",
    title: "Повернення та відбудова",
    description: "Повернення додому й відновлення громад після деокупації.",
    storyIds: ["st6"],
  },
]

export const fragments: Fragment[] = [
  {
    id: "f1",
    mid: "m1",
    a: 1,
    b: 2,
    desc: "Початок обстрілу та перші години в укритті; склад людей у підвалі",
    tags: ["укриття", "обстріл", "діти"],
  },
  {
    id: "f2",
    mid: "m1",
    a: 3,
    b: 3,
    desc: "Нестача води на третю добу; взаємодопомога сусідів",
    tags: ["вода", "взаємодопомога"],
  },
  {
    id: "f3",
    mid: "m1",
    a: 4,
    b: 4,
    desc: "Евакуація через гуманітарний коридор за допомогою волонтерів",
    tags: ["евакуація", "волонтери"],
  },
  {
    id: "f4",
    mid: "m2",
    a: 1,
    b: 1,
    desc: "Організація евакуаційних маршрутів у перші дні",
    tags: ["евакуація", "волонтери", "маршрут"],
  },
  {
    id: "f5",
    mid: "m2",
    a: 2,
    b: 3,
    desc: "Пальне, транспорт і масштаб евакуації літніх людей і родин з дітьми",
    tags: ["транспорт", "евакуація", "літні люди", "діти"],
  },
  {
    id: "f6",
    mid: "m2",
    a: 4,
    b: 4,
    desc: "Роздум про взаємодопомогу незнайомих людей",
    tags: ["взаємодопомога"],
  },
  {
    id: "f7",
    mid: "m3",
    a: 1,
    b: 1,
    desc: "Виїзд колоною, блокпости, діти в дорозі",
    tags: ["евакуація", "дорога", "діти"],
  },
  {
    id: "f8",
    mid: "m3",
    a: 2,
    b: 3,
    desc: "Прибуття на вокзал у Дніпрі, допомога незнайомих людей і волонтерів",
    tags: ["Дніпро", "вокзал", "взаємодопомога", "волонтери"],
  },
  {
    id: "f9",
    mid: "m4",
    a: 1,
    b: 2,
    desc: "Робота лікарні без світла та води; нестача ліків і перев’язувальних матеріалів",
    tags: ["медицина", "лікарня", "блокада"],
  },
  {
    id: "f10",
    mid: "m4",
    a: 3,
    b: 3,
    desc: "Потік поранених дітей і вибір пріоритетів у лікарні",
    tags: ["медицина", "діти", "поранені"],
  },
  {
    id: "f11",
    mid: "m5",
    a: 1,
    b: 2,
    desc: "Перші години на кордоні, польова допомога біженцям і евакуйованим",
    tags: ["кордон", "біженці", "волонтери", "евакуація"],
  },
  {
    id: "f12",
    mid: "m5",
    a: 3,
    b: 3,
    desc: "Діти та мами на кордоні",
    tags: ["діти", "кордон"],
  },
  {
    id: "f13",
    mid: "m6",
    a: 1,
    b: 1,
    desc: "Повернення додому, перші дні відбудови, взаємодопомога сусідів",
    tags: ["повернення", "відбудова", "сусіди"],
  },
  {
    id: "f14",
    mid: "m6",
    a: 2,
    b: 2,
    desc: "Спільне відновлення водогону на вулиці",
    tags: ["відбудова", "вода", "взаємодопомога"],
  },
  {
    id: "f15",
    mid: "m7",
    a: 1,
    b: 1,
    desc: "Евакуація поранених з Попасної вантажівками",
    tags: ["евакуація", "поранені"],
  },
]

export const SYSTEM_TAGS = Array.from(
  new Set(materials.flatMap((m) => m.tags)),
).sort((a, b) => a.localeCompare(b, "uk"))
export const mat = (id: string) => materials.find((m) => m.id === id)!
export const story = (id: string) => stories.find((s) => s.id === id)!
export const storyMedia = (id: string) => story(id).mediaIds.map(mat)
export const storyCover = (id: string) => storyMedia(id)[0]
export const frag = (id: string) => fragments.find((f) => f.id === id)!
export const fragStart = (f: Fragment) => mat(f.mid).segments[f.a].s
export const fragEnd = (f: Fragment) => mat(f.mid).segments[f.b].e
export const fragQuote = (f: Fragment) =>
  mat(f.mid)
    .segments.slice(f.a, f.b + 1)
    .map((s) => s.uk)
    .join(" ")
export const fragWho = (f: Fragment) => mat(f.mid).segments[f.a].who

export const SUGGESTIONS = [
  "Евакуація цивільних і роль волонтерів",
  "Як працювала медична допомога без світла",
  "Взаємодопомога сусідів і незнайомих людей",
  "Діти під час евакуації та в укритті",
]

// Превʼю матеріалів (Unsplash, демонстраційні ілюстрації)
const THUMBS: Record<string, string> = {
  m1: "1649514829261-209a19e77263",
  m2: "1786719664235-78cb91943275",
  m3: "1553184257-604db3e574a8",
  m4: "1777269749032-d8d458ae594d",
  m5: "1608487583634-0f31766e4cb1",
  m6: "1576239414703-a4449131fda3",
  m7: "1602710383198-67873f6ab200",
}
export const thumbUrl = (mid: string, w = 480, h = 300) =>
  `https://images.unsplash.com/photo-${THUMBS[mid]}?auto=format&fit=crop&w=${w}&h=${h}&q=70`
