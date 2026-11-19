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
  {
    id: "m8",
    title: "Розповідь Марії Тарасенко про роботу бібліотеки",
    kind: "video",
    lang: "uk",
    speaker: "Марія Тарасенко",
    recorded: "21.08.2022",
    duration: 1980,
    storyId: "st8",
    story: "Бібліотека як укриття",
    tags: ["укриття", "діти", "бібліотека", "взаємодопомога"],
    segments: [
      {
        s: 0,
        e: 70,
        who: I,
        uk: "Марійо, як бібліотека стала місцем, куди приходили люди?",
        en: "Maria, how did the library become a place people came to?",
      },
      {
        s: 70,
        e: 260,
        who: "Марія",
        uk: "Спочатку ми просто відчинили підвал для сусідів. Потім принесли книжки для дітей, щоб вони не сиділи в тиші.",
        en: "At first we simply opened the basement for neighbours. Then we brought books for the children so they would not sit in silence.",
      },
      {
        s: 260,
        e: 520,
        who: "Марія",
        uk: "Щодня о четвертій ми читали вголос. Дорослі теж приходили слухати, це заспокоювало всіх.",
        en: "Every day at four we read aloud. Adults came to listen too; it calmed everyone.",
      },
    ],
  },
  {
    id: "m9",
    title: "Аудіозапис: читання для дітей у підвалі",
    kind: "audio",
    lang: "uk",
    speaker: "Марія Тарасенко",
    recorded: "23.08.2022",
    duration: 1260,
    storyId: "st8",
    story: "Бібліотека як укриття",
    tags: ["діти", "бібліотека", "укриття"],
    segments: [
      {
        s: 0,
        e: 45,
        who: I,
        uk: "Що ви найчастіше читали дітям?",
        en: "What did you read to the children most often?",
      },
      {
        s: 45,
        e: 300,
        who: "Марія",
        uk: "Казки й вірші, які вони знали напам’ять. Діти підказували рядки, і ми разом сміялися.",
        en: "Fairy tales and poems they knew by heart. The children prompted the lines and we laughed together.",
      },
    ],
  },
  {
    id: "m10",
    title: "Інтерв’ю з медсестрою Оксаною Мельник",
    kind: "video",
    lang: "uk",
    speaker: "Оксана Мельник",
    recorded: "09.06.2022",
    duration: 2410,
    storyId: "st9",
    story: "Пункт допомоги на вокзалі",
    tags: ["медицина", "вокзал", "евакуація", "волонтери"],
    segments: [
      {
        s: 0,
        e: 55,
        who: I,
        uk: "Оксано, розкажіть, як працював пункт допомоги на вокзалі.",
        en: "Oksana, tell us how the aid point at the station worked.",
      },
      {
        s: 55,
        e: 310,
        who: "Оксана",
        uk: "Ми приймали сотні людей на добу. Перевіряли тиск, перев’язували, давали воду й теплий чай.",
        en: "We received hundreds of people a day. We checked blood pressure, dressed wounds, gave water and hot tea.",
      },
      {
        s: 310,
        e: 640,
        who: "Оксана",
        uk: "Найважче було з людьми похилого віку: вони боялися залишати свої речі навіть на хвилину.",
        en: "The hardest were the elderly: they were afraid to leave their belongings even for a minute.",
      },
    ],
  },
  {
    id: "m11",
    title: "Свідчення водія Тараса Бондаренка",
    kind: "audio",
    lang: "uk",
    speaker: "Тарас Бондаренко",
    recorded: "15.04.2022",
    duration: 1740,
    storyId: "st10",
    story: "Автобус із Харкова",
    tags: ["евакуація", "дорога", "транспорт", "діти"],
    segments: [
      {
        s: 0,
        e: 50,
        who: I,
        uk: "Тарасе, як ви вирішили їхати за людьми?",
        en: "Taras, how did you decide to go for the people?",
      },
      {
        s: 50,
        e: 330,
        who: "Тарас",
        uk: "Знайомі просили вивезти матір. Я поїхав і повернувся з повним автобусом: ніхто не хотів лишатися.",
        en: "Friends asked me to bring out their mother. I went and came back with a full bus: no one wanted to stay.",
      },
      {
        s: 330,
        e: 600,
        who: "Тарас",
        uk: "На блокпостах нас пропускали швидко, коли бачили дітей. Ми їхали вночі без фар.",
        en: "At checkpoints they let us through quickly when they saw the children. We drove at night without headlights.",
      },
    ],
  },
  {
    id: "m12",
    title: "Розмова з учителькою Ірою Савчук",
    kind: "video",
    lang: "uk",
    speaker: "Ірина Савчук",
    recorded: "30.09.2022",
    duration: 2105,
    storyId: "st11",
    story: "Школа онлайн у підвалі",
    tags: ["діти", "освіта", "укриття"],
    segments: [
      {
        s: 0,
        e: 60,
        who: I,
        uk: "Ірино, як ви продовжували навчання під час обстрілів?",
        en: "Iryna, how did you continue teaching during the shelling?",
      },
      {
        s: 60,
        e: 290,
        who: "Ірина",
        uk: "Ми збиралися в коридорі без вікон. Телефон ловив один куток, тож уроки йшли по черзі.",
        en: "We gathered in a corridor without windows. The phone caught signal in one corner, so lessons went in turns.",
      },
      {
        s: 290,
        e: 560,
        who: "Ірина",
        uk: "Діти малювали свої будинки. Ці малюнки ми зберегли як доказ того, що життя тривало.",
        en: "The children drew their houses. We kept those drawings as proof that life went on.",
      },
    ],
  },
  {
    id: "m13",
    title: "Щоденник Віри Гнатюк (читання)",
    kind: "audio",
    lang: "uk",
    speaker: "Віра Гнатюк",
    recorded: "05.11.2022",
    duration: 1320,
    storyId: "st11",
    story: "Школа онлайн у підвалі",
    tags: ["діти", "освіта", "щоденник"],
    segments: [
      {
        s: 0,
        e: 40,
        who: I,
        uk: "Прочитайте, будь ласка, запис, який вам найдорожчий.",
        en: "Please read the entry that is dearest to you.",
      },
      {
        s: 40,
        e: 280,
        who: "Віра",
        uk: "Сьогодні вчили таблицю множення при свічці. Дівчинка спитала: коли закінчиться війна? Я відповіла: коли ми все вивчимо.",
        en: "Today we learned the multiplication table by candlelight. A girl asked when the war would end. I said: when we have learned everything.",
      },
    ],
  },
  {
    id: "m14",
    title: "Інтерв’ю з Дмитром Романюком про відбудову дахів",
    kind: "video",
    lang: "uk",
    speaker: "Дмитро Романюк",
    recorded: "12.12.2022",
    duration: 1860,
    storyId: "st12",
    story: "Дахи для сусідів",
    tags: ["відбудова", "сусіди", "повернення", "взаємодопомога"],
    segments: [
      {
        s: 0,
        e: 55,
        who: I,
        uk: "Дмитре, з чого почалася відбудова на вашій вулиці?",
        en: "Dmytro, what did the rebuilding on your street start with?",
      },
      {
        s: 55,
        e: 300,
        who: "Дмитро",
        uk: "З дахів. Узимку без даху не можна. Ми зібрали бригаду з сусідів і розподілили будинки за чергою.",
        en: "With roofs. You cannot go without a roof in winter. We formed a team from neighbours and shared the houses by turns.",
      },
      {
        s: 300,
        e: 590,
        who: "Дмитро",
        uk: "Матеріали давали волонтери, а роботу ми робили самі. За місяць закрили сімнадцять будинків.",
        en: "Volunteers gave materials and we did the work ourselves. In a month we covered seventeen houses.",
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
    id: "st8",
    title: "Бібліотека як укриття",
    summary:
      "Бібліотекарка розповідає, як підвал став місцем читань для дітей і підтримки сусідів.",
    tags: ["укриття", "діти", "бібліотека", "взаємодопомога"],
    mediaIds: ["m8", "m9"],
    hasText: true,
  },
  {
    id: "st9",
    title: "Пункт допомоги на вокзалі",
    summary:
      "Медсестра про прийом евакуйованих, перев’язки й допомогу літнім людям на вокзалі.",
    tags: ["медицина", "вокзал", "евакуація", "волонтери"],
    mediaIds: ["m10"],
    hasText: true,
  },
  {
    id: "st10",
    title: "Автобус із Харкова",
    summary:
      "Водій розповідає, як вивозив людей нічними рейсами та проходив блокпости з дітьми.",
    tags: ["евакуація", "дорога", "транспорт", "діти"],
    mediaIds: ["m11"],
    hasText: true,
  },
  {
    id: "st11",
    title: "Школа онлайн у підвалі",
    summary:
      "Вчителька та її учениця про навчання при свічках, уроки по черзі й дитячі малюнки.",
    tags: ["діти", "освіта", "укриття", "щоденник"],
    mediaIds: ["m12", "m13"],
    hasText: true,
  },
  {
    id: "st12",
    title: "Дахи для сусідів",
    summary:
      "Історія спільної відбудови вулиці: бригада з мешканців закриває дахи перед зимою.",
    tags: ["відбудова", "сусіди", "повернення", "взаємодопомога"],
    mediaIds: ["m14"],
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
    storyIds: ["st2", "st3", "st5", "st9", "st10"],
  },
  {
    id: "life-under-fire",
    title: "Життя під час війни",
    description: "Укриття, блокада та щоденні рішення цивільних у небезпеці.",
    storyIds: ["st1", "st4", "st8", "st11"],
  },
  {
    id: "mutual-aid",
    title: "Взаємодопомога",
    description:
      "Історії волонтерів, сусідів і незнайомих людей, які підтримували одне одного.",
    storyIds: ["st1", "st2", "st3", "st5", "st6", "st8", "st9", "st12"],
  },
  {
    id: "return",
    title: "Повернення та відбудова",
    description: "Повернення додому й відновлення громад після деокупації.",
    storyIds: ["st6", "st12"],
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
  {
    id: "f16",
    mid: "m8",
    a: 1,
    b: 2,
    desc: "Бібліотека стає укриттям і місцем щоденних читань для дітей",
    tags: ["укриття", "діти", "бібліотека"],
  },
  {
    id: "f17",
    mid: "m9",
    a: 1,
    b: 1,
    desc: "Діти разом із бібліотекаркою згадують улюблені казки й вірші",
    tags: ["діти", "бібліотека"],
  },
  {
    id: "f18",
    mid: "m10",
    a: 1,
    b: 2,
    desc: "Робота пункту допомоги на вокзалі та допомога літнім людям",
    tags: ["медицина", "вокзал", "евакуація"],
  },
  {
    id: "f19",
    mid: "m11",
    a: 1,
    b: 2,
    desc: "Нічні рейси з евакуації та проходження блокпостів з дітьми",
    tags: ["евакуація", "дорога", "діти"],
  },
  {
    id: "f20",
    mid: "m12",
    a: 1,
    b: 2,
    desc: "Уроки по черзі в коридорі без вікон і дитячі малюнки",
    tags: ["діти", "освіта", "укриття"],
  },
  {
    id: "f21",
    mid: "m13",
    a: 1,
    b: 1,
    desc: "Запис зі щоденника: таблиця множення при свічці",
    tags: ["діти", "освіта", "щоденник"],
  },
  {
    id: "f22",
    mid: "m14",
    a: 1,
    b: 2,
    desc: "Бригада сусідів закриває дахи перед зимою",
    tags: ["відбудова", "сусіди", "взаємодопомога"],
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
  m8: "1576239414703-a4449131fda3",
  m9: "1649514829261-209a19e77263",
  m10: "1553184257-604db3e574a8",
  m11: "1786719664235-78cb91943275",
  m12: "1777269749032-d8d458ae594d",
  m13: "1608487583634-0f31766e4cb1",
  m14: "1576239414703-a4449131fda3",
}
export const thumbUrl = (mid: string, w = 480, h = 300) =>
  `https://images.unsplash.com/photo-${THUMBS[mid]}?auto=format&fit=crop&w=${w}&h=${h}&q=70`
