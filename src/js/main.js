'use strict';

/* ===================================================================
   Business Commandos — Тест на системность бизнеса
   Main JavaScript — Quiz Logic, Radar Chart, Screen Transitions
   =================================================================== */

/* === CONFIG === */

// Вставьте URL вашего Google Apps Script webhook (см. docs/google-sheets-setup.md)
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby25XvUx7zaRCIomKl55OxYix6BfU9aDSxv3YPM3i11HaHu5RAFa_npxOEOvgeHkd2r6A/exec';

// URL сайта (заменить перед выкладкой на продакшен-домен)
const SITE_URL = 'https://audit.businesscommandos.ru/';

// Яндекс Метрика — ID счётчика
const YM_ID = 105930063;

function reachGoal(goalName) {
  if (typeof ym === 'function') {
    ym(YM_ID, 'reachGoal', goalName);
  }
}

/* === DATA === */

const SECTORS = [
  {
    id: 'sales',
    name: 'Продажи',
    fullName: 'Продажи',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    questions: [
      'Есть CRM-система, менеджеры вносят все данные — можно посмотреть результаты работы в любой момент',
      'Конверсия на каждом этапе воронки продаж измеряется и анализируется — понятно, где теряются клиенты',
      'У продажников есть скрипты и регулярные тренировки по отработке возражений',
      'Выручка прогнозируемая — можно заранее посчитать, сколько продаж будет в следующем месяце'
    ]
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    fullName: 'Маркетинг',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    questions: [
      'В компании есть руководитель маркетинга (или отдела маркетинга), который отвечает за результат',
      'Разработана маркетинговая стратегия — понятно, кому, что и через какие каналы продвигаем',
      'Есть маркетинговый дашборд — цена лида, конверсии, ROI по каждому каналу видны и анализируются регулярно',
      'Маркетинг генерирует стабильный и предсказуемый поток лидов — известна стоимость привлечения клиента, есть план по количеству заявок и он выполняется'
    ]
  },
  {
    id: 'production',
    name: 'Производство',
    fullName: 'Производство / Оказание услуг',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    questionsGoods: [
      'Продукция производится в запланированные сроки, себестоимость точно известна',
      'Внедрён складской учёт и планирование закупок материалов',
      'На производстве внедрён контроль качества — брак и пересорт почти исключены',
      'Есть сильный начальник производства, который решает операционные вопросы без участия собственника'
    ],
    questionsServices: [
      'Себестоимость услуги точно известна, есть понятная система ценообразования',
      'Компания контролирует качество оказания услуг — собирает обратную связь и следит за NPS',
      'Внедрена система проектного управления — коммуникация по клиентским проектам прозрачна',
      'Рекламации минимальны, клиенты довольны качеством — есть повторные обращения и рекомендации'
    ],
    questions: null
  },
  {
    id: 'finance',
    name: 'Финансы',
    fullName: 'Финансы',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    questions: [
      'Собственник точно знает чистую прибыль компании и чётко разделяет личные деньги и деньги бизнеса',
      'Ежемесячно формируется управленческая отчётность: ДДС, P&L, и не реже раза в квартал — баланс',
      'Компания не боится кассовых разрывов — внедрено финансовое планирование минимум на 2-3 месяца вперёд',
      'Собственник точно знает, сколько денег на счетах, сколько должны контрагенты и сколько должна компания'
    ]
  },
  {
    id: 'hr',
    name: 'Кадры',
    fullName: 'Кадры: найм и адаптация',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    questions: [
      'Для ключевых должностей есть описанные воронки найма — понятно, как ищем, отбираем и проверяем кандидатов',
      'Адаптация нового сотрудника расписана пошагово и требует минимального личного участия собственника',
      'Если ключевой сотрудник уволится, замена найдётся за 2-3 недели без ущерба для бизнеса',
      'Для каждой должности есть должностная инструкция, которая точно описывает обязанности и метрики результата'
    ]
  },
  {
    id: 'quality',
    name: 'Качество',
    fullName: 'Контроль качества',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    questions: [
      'В компании есть ответственный (человек или отдел) за контроль качества ключевых процессов',
      'Работа отдела продаж контролируется — звонки прослушиваются, переписки проверяются, CRM анализируется на корректность заполнения',
      'Руководители регулярно получают отчёты о нарушениях и ведут работу по их устранению',
      'Контроль качества — проактивный: проблемы выявляются до того, как клиент пожалуется'
    ]
  },
  {
    id: 'management',
    name: 'Управление',
    fullName: 'Общая система управления',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    questions: [
      'Планёрки проходят регулярно, не реже раза в неделю — на них ставятся задачи, подводятся итоги, анализируются цифры',
      'У каждого сотрудника есть понятные зоны ответственности — прописано, кто за какие функции и бизнес-процессы отвечает',
      'Все задачи фиксируются письменно в системе управления задачами, где контролируется их выполнение',
      'Бизнес работает без постоянного участия собственника — 80-90% решений принимаются командой самостоятельно'
    ]
  },
  {
    id: 'strategy',
    name: 'Стратегия',
    fullName: 'Стратегия и планирование',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    questions: [
      'У компании есть чёткие цели минимум на год, декомпозированные на квартальные планы',
      'В компании внедрена система целеполагания (OKR, KPI или аналог) — цели сотрудников связаны с целями компании',
      'Собственник знает свою бизнес-модель и unit-экономику: маржинальность по продуктам, LTV клиента, точку безубыточности',
      'Стратегические сессии проходят регулярно — не реже раза в квартал подводятся итоги и корректируется курс'
    ]
  }
];

const FEEDBACK_MESSAGES = [
  'Готово! Переходим к маркетингу.',
  'Отлично! Теперь посмотрим на ваш продукт.',
  'Хорошо! Переходим к финансам.',
  'Принято! Теперь — кадры.',
  'Понял! Смотрим на контроль качества.',
  'Хорошо! Переходим к системе управления.',
  'Почти готово! Последний блок — стратегия.',
  'Готово! Формируем ваше колесо баланса\u2026'
];

const SECTOR_DESCRIPTIONS = {
  strategy: {
    danger: {
      meaning: 'В компании нет чётких целей и понятной стратегии — каждый день решаете, что важнее прямо сейчас.',
      impact: 'Команда работает вразнобой, ресурсы расходуются на второстепенное, бизнес топчется на месте.',
      action: 'Первый шаг — провести стратегическую сессию и сформулировать цели компании минимум на год.'
    },
    warning: {
      meaning: 'Стратегия есть, но она существует в голове собственника, а не в документах и процессах компании.',
      impact: 'Команда догадывается о приоритетах, а не знает их. Планы срываются, потому что нет системы контроля.',
      action: 'Декомпозируйте стратегию до квартальных планов и свяжите с ними KPI каждого руководителя.'
    },
    success: {
      meaning: 'Стратегия описана, цели декомпозированы, регулярные сессии планирования проходят в срок.',
      impact: 'Команда работает в одном направлении, ресурсы расходуются эффективно.',
      action: 'Убедитесь, что стратегия живёт в ежедневных решениях команды, а не только на бумаге.'
    }
  },
  management: {
    danger: {
      meaning: 'Бизнес держится на вас: вы принимаете большинство решений, задачи не фиксируются, планёрок нет или они хаотичны.',
      impact: 'Вы не можете уйти в отпуск без потерь. Сотрудники не берут ответственность, потому что система этого не требует.',
      action: 'Начните с одного еженедельного совещания с фиксацией задач в любой системе — хоть в таблице Google.'
    },
    warning: {
      meaning: 'Управленческие инструменты есть, но применяются непоследовательно: одни руководители используют, другие — нет.',
      impact: 'Информация теряется, задачи зависают, собственник всё равно вовлечён в оперативку больше, чем хотелось бы.',
      action: 'Стандартизируйте управленческий ритм: одинаковый формат планёрок, единая система задач для всех.'
    },
    success: {
      meaning: 'В компании работает регулярный менеджмент: совещания, задачи, отчёты — всё по системе.',
      impact: 'Собственник управляет стратегически, а не операционно. Бизнес работает без его постоянного присутствия.',
      action: 'Поддерживайте систему и проверяйте, не деградируют ли процессы — это случается при росте команды.'
    }
  },
  hr: {
    danger: {
      meaning: 'Найм — хаотичный процесс: берёте первого подходящего, адаптация зависит от настроения собственника.',
      impact: 'Высокая текучка, долгое вхождение в должность, уход ключевых людей парализует бизнес.',
      action: 'Опишите портрет идеального кандидата и создайте простой адаптационный чек-лист хотя бы для ключевых должностей.'
    },
    warning: {
      meaning: 'Воронки найма существуют, но адаптация всё ещё требует много времени собственника или опытных сотрудников.',
      impact: 'Новые люди входят медленно, ключевые сотрудники перегружены обучением, риск при уходе одного человека высок.',
      action: 'Создайте базу знаний с регламентами и видеоинструкциями — это сократит адаптацию в 2\u20133 раза.'
    },
    success: {
      meaning: 'Найм и адаптация работают как конвейер: понятные воронки, описанные процессы, минимальное участие собственника.',
      impact: 'Бизнес не зависит от конкретных людей, замена сотрудника не создаёт кризиса.',
      action: 'Убедитесь, что стандарты найма обновляются под рост компании и меняющиеся требования рынка.'
    }
  },
  finance: {
    danger: {
      meaning: 'Финансы непрозрачны: не понятно, сколько зарабатывает компания, деньги бизнеса и личные смешаны.',
      impact: 'Кассовые разрывы как неожиданность, невозможность планировать развитие, высокий риск потерять бизнес.',
      action: 'Начните разделять личный и корпоративный счёт, фиксируйте все доходы и расходы хотя бы в таблице.'
    },
    warning: {
      meaning: 'Базовая отчётность ведётся, но управленческий учёт неполный: P&L или ДДС есть, но не оба и не регулярно.',
      impact: 'Решения о найме, инвестициях и ценах принимаются интуитивно, а не на основе цифр.',
      action: 'Внедрите ежемесячный управленческий отчёт: ДДС + P&L + прогноз ликвидности на 2 месяца вперёд.'
    },
    success: {
      meaning: 'Финансы прозрачны: собственник знает прибыль, остатки на счетах, дебиторку и кредиторку в любой момент.',
      impact: 'Решения принимаются на основе данных, кассовые разрывы исключены, бизнес управляем.',
      action: 'Проверьте, насколько финансовая отчётность используется руководителями для принятия решений — не только собственником.'
    }
  },
  marketing: {
    danger: {
      meaning: 'Маркетинга как системы нет: клиенты приходят по сарафану, реклама запускается хаотично и без аналитики.',
      impact: 'Нестабильный поток клиентов, невозможность прогнозировать выручку, зависимость от удачи.',
      action: 'Зафиксируйте, откуда сейчас приходят клиенты, и сделайте один канал стабильным и измеримым.'
    },
    warning: {
      meaning: 'Маркетинг ведётся, но без чёткой стратегии и системы аналитики: нет понимания стоимости лида и ROI каналов.',
      impact: 'Бюджет расходуется неоптимально, масштабировать рекламу страшно — непонятно, что сработает.',
      action: 'Внедрите маркетинговый дашборд: CPL и конверсии по каждому каналу в одном месте, еженедельный мониторинг.'
    },
    success: {
      meaning: 'Маркетинг генерирует стабильный поток лидов с измеримой стоимостью по каждому каналу.',
      impact: 'Выручка прогнозируема, масштабирование рекламы управляемо, маркетолог работает по стратегии.',
      action: 'Проверьте, насколько маркетинговая стратегия синхронизирована с планами продаж и производства.'
    }
  },
  sales: {
    danger: {
      meaning: 'Продажи непредсказуемы: CRM не используется, скриптов нет, результат зависит от личности конкретного менеджера.',
      impact: 'Выручка скачет непрогнозируемо, потеря клиентов на каждом этапе воронки, уход менеджера = потеря базы.',
      action: 'Внедрите CRM хотя бы для фиксации контактов и этапов сделки — это первый шаг к управляемым продажам.'
    },
    warning: {
      meaning: 'CRM есть, воронка описана, но конверсии не анализируются регулярно, скрипты не обновляются.',
      impact: 'Лиды теряются на понятных этапах, менеджеры работают по-разному, прогноз выручки неточный.',
      action: 'Раз в месяц анализируйте конверсию на каждом этапе воронки и разбирайте с менеджерами реальные звонки.'
    },
    success: {
      meaning: 'Продажи управляемы: CRM заполняется, воронка отслеживается, выручка на следующий месяц прогнозируется с точностью \u00b115%.',
      impact: 'Рост выручки управляем, слабые места воронки видны и исправляются вовремя.',
      action: 'Убедитесь, что система продаж масштабируется: новый менеджер выходит на плановые показатели за 4\u20136 недель.'
    }
  },
  production: {
    danger: {
      meaning: 'Производство непрозрачно: сроки срываются, себестоимость неизвестна, брак не контролируется.',
      impact: 'Клиенты недовольны, маржа падает из-за скрытых потерь, собственник тушит пожары в цехе.',
      action: 'Начните с двух вещей: посчитайте реальную себестоимость продукта и зафиксируйте нормативы сроков.'
    },
    warning: {
      meaning: 'Производство работает, но начальник цеха всё ещё зависит от собственника при нестандартных ситуациях.',
      impact: 'Масштабирование ограничено пропускной способностью, контроль качества — реактивный, а не системный.',
      action: 'Опишите ключевые производственные процессы и передайте операционную ответственность начальнику производства.'
    },
    success: {
      meaning: 'Производство работает по регламентам: сроки соблюдаются, себестоимость известна, качество контролируется системно.',
      impact: 'Собственник не вовлечён в операционку, масштабирование возможно без потери качества.',
      action: 'Найдите, где ещё можно сократить потери — хронометраж операций и ABC-анализ SKU дадут ответ.'
    }
  },
  'production-services': {
    danger: {
      meaning: 'Услуги оказываются без стандартов: каждый делает как умеет, себестоимость не считается, рекламаций много.',
      impact: 'Клиенты уходят после первой сделки, маржа под угрозой, репутация страдает.',
      action: 'Зафиксируйте стандарт качественной услуги и начните собирать обратную связь после каждого проекта.'
    },
    warning: {
      meaning: 'Качество услуг в целом устраивает клиентов, но контроль непоследователен — зависит от конкретного исполнителя.',
      impact: 'NPS нестабилен, повторные обращения есть, но не системные, масштабирование приводит к деградации качества.',
      action: 'Внедрите систему сбора NPS после каждого проекта и разбирайте негативные случаи на регулярных встречах команды.'
    },
    success: {
      meaning: 'Качество услуг стабильно: процессы описаны, NPS отслеживается, рекламации редки и разбираются системно.',
      impact: 'Клиенты возвращаются и рекомендуют — органический рост за счёт репутации.',
      action: 'Формализуйте ваши стандарты качества и используйте их в найме: продавайте их как конкурентное преимущество.'
    }
  },
  quality: {
    danger: {
      meaning: 'Контроля качества нет как системы: проблемы обнаруживаются, когда клиент уже недоволен.',
      impact: 'Репутационные потери, рост расходов на устранение последствий, демотивация команды.',
      action: 'Назначьте ответственного за качество и начните с еженедельного разбора жалоб и ошибок.'
    },
    warning: {
      meaning: 'Контроль есть, но работает реактивно: проверки проводятся после инцидентов, а не по регламенту.',
      impact: 'Часть проблем всё ещё доходит до клиента, ОКК не работает как независимый фильтр.',
      action: 'Переведите контроль в проактивный режим: внедрите чек-листы проверки на ключевых этапах процесса.'
    },
    success: {
      meaning: 'Контроль качества — системный и проактивный: отдел ОКК работает независимо, звонки прослушиваются, CRM проверяется регулярно.',
      impact: 'Проблемы выявляются до клиента, команда работает в культуре стандартов.',
      action: 'Убедитесь, что данные ОКК влияют на систему мотивации — иначе контроль останется формальным.'
    }
  }
};

/* === STATE === */

const state = {
  currentScreen: 'landing',
  currentSector: 0,
  businessType: null, // 'goods' or 'services'
  answers: {},        // { 'strategy-0': 5, 'strategy-1': 8, ... }
  contactData: {},
  sectorAverages: []
};

/* === DOM REFS === */

const dom = {
  screens: {
    landing: document.getElementById('screen-landing'),
    quiz: document.getElementById('screen-quiz'),
    choice: document.getElementById('screen-choice'),
    feedback: document.getElementById('screen-feedback'),
    contact: document.getElementById('screen-contact'),
    results: document.getElementById('screen-results')
  },
  btnStartTest: document.getElementById('btn-start-test'),
  btnQuizNext: document.getElementById('btn-quiz-next'),
  btnQuizBack: document.getElementById('btn-quiz-back'),
  quizBody: document.getElementById('quiz-body'),
  progressFill: document.getElementById('progress-fill'),
  progressLabel: document.getElementById('progress-sector-label'),
  feedbackText: document.getElementById('feedback-text'),
  contactForm: document.getElementById('contact-form'),
  btnSubmitContact: document.getElementById('btn-submit-contact'),
  resultScore: document.getElementById('result-score'),
  resultPercent: document.getElementById('result-percent'),
  statusTitle: document.getElementById('status-title'),
  statusDesc: document.getElementById('status-desc'),
  resultsStatus: document.getElementById('results-status'),
  resultsWeak: document.getElementById('results-weak'),
  btnShare: document.getElementById('btn-share')
};

/* === SCREEN TRANSITIONS === */

function showScreen(screenName) {
  const current = dom.screens[state.currentScreen];
  const next = dom.screens[screenName];

  if (current) {
    current.classList.remove('screen--active');
    current.hidden = true;
  }

  next.hidden = false;
  // Force reflow before adding active class for transition
  void next.offsetHeight;
  next.classList.add('screen--active');

  state.currentScreen = screenName;
  window.scrollTo(0, 0);

  // Focus management for accessibility
  const heading = next.querySelector('h1, h2, h3');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

/* === DEMO WHEEL (Landing page) === */

function drawDemoWheel() {
  const demoValues = [8, 6, 7, 9, 5, 8, 7, 6];
  const labels = SECTORS.map(s => s.name);
  drawRadarChart('demo-wheel', demoValues, labels, 200, 160, false);
}

/* === RADAR CHART GENERATOR === */

function drawRadarChart(svgId, values, labels, cx, cy, animate) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const maxVal = 10;
  const levels = [2, 4, 6, 8, 10];
  const numAxes = values.length;
  const angleStep = (2 * Math.PI) / numAxes;
  const startAngle = -Math.PI / 2; // Start from top
  const maxRadius = Math.min(cx, cy) - 50;

  let html = '';

  // Background grid polygons
  levels.forEach(level => {
    const points = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const r = (level / maxVal) * maxRadius;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    html += `<polygon points="${points.join(' ')}" fill="none" stroke="#1E3A5F" stroke-opacity="0.5" stroke-width="1"/>`;
  });

  // Axes
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const x2 = cx + maxRadius * Math.cos(angle);
    const y2 = cy + maxRadius * Math.sin(angle);
    html += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#1E3A5F" stroke-opacity="0.5" stroke-width="1"/>`;
  }

  // Data polygon
  const dataPoints = [];
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const r = (values[i] / maxVal) * maxRadius;
    dataPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  // Determine fill color based on overall average
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  let fillColor, strokeColor;
  if (avg <= 4) {
    fillColor = 'rgba(239, 68, 68, 0.25)';
    strokeColor = '#EF4444';
  } else if (avg <= 7) {
    fillColor = 'rgba(234, 179, 8, 0.25)';
    strokeColor = '#EAB308';
  } else {
    fillColor = 'rgba(34, 197, 94, 0.25)';
    strokeColor = '#22C55E';
  }

  const animClass = animate ? ' class="radar-area"' : '';
  html += `<polygon points="${dataPoints.join(' ')}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" stroke-opacity="0.9"${animClass}/>`;

  // Data points with color coding per axis
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const r = (values[i] / maxVal) * maxRadius;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);

    let dotColor;
    if (values[i] <= 4) {
      dotColor = '#EF4444';
    } else if (values[i] <= 7) {
      dotColor = '#EAB308';
    } else {
      dotColor = '#22C55E';
    }

    html += `<circle cx="${px}" cy="${py}" r="5" fill="${dotColor}" stroke="#070B14" stroke-width="2"/>`;

    // Axis color line overlay (from center to data point)
    const lineEnd = cx + maxRadius * Math.cos(angle);
    const lineEndY = cy + maxRadius * Math.sin(angle);
    html += `<line x1="${cx}" y1="${cy}" x2="${lineEnd}" y2="${lineEndY}" stroke="${dotColor}" stroke-opacity="0.3" stroke-width="2"/>`;
  }

  // Labels
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const labelR = maxRadius + 28;
    const lx = cx + labelR * Math.cos(angle);
    const ly = cy + labelR * Math.sin(angle);

    let anchor = 'middle';
    if (Math.cos(angle) < -0.1) anchor = 'end';
    else if (Math.cos(angle) > 0.1) anchor = 'start';

    let dotColor;
    if (values[i] <= 4) {
      dotColor = '#EF4444';
    } else if (values[i] <= 7) {
      dotColor = '#EAB308';
    } else {
      dotColor = '#22C55E';
    }

    html += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="central" fill="${dotColor}" font-family="Inter, sans-serif" font-size="12" font-weight="500">${labels[i]}</text>`;
    // Score next to label
    html += `<text x="${lx}" y="${ly + 14}" text-anchor="${anchor}" dominant-baseline="central" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11">${values[i].toFixed(1)}</text>`;
  }

  svg.innerHTML = html;
}

/* === QUIZ RENDERING === */

function getQuestionsForSector(sectorIndex) {
  const sector = SECTORS[sectorIndex];
  if (sectorIndex === 2) {
    return state.businessType === 'goods' ? sector.questionsGoods : sector.questionsServices;
  }
  return sector.questions;
}

function renderSector(sectorIndex) {
  const sector = SECTORS[sectorIndex];
  const questions = getQuestionsForSector(sectorIndex);

  let html = `
    <div class="quiz-sector fade-in">
      <h2 class="quiz-sector__title">
        ${sector.icon}
        ${sector.fullName}
      </h2>
      <p class="quiz-sector__instruction">Оцените, насколько каждое утверждение соответствует вашему бизнесу прямо сейчас.</p>
  `;

  questions.forEach((q, qi) => {
    const key = `${sector.id}-${qi}`;
    const selectedValue = state.answers[key] || null;

    html += `
      <div class="quiz-question">
        <p class="quiz-question__text">
          <span class="quiz-question__number">${qi + 1}.</span> ${q}
        </p>
        <div class="rating-buttons" role="radiogroup" aria-label="Оценка от 1 до 10">
    `;

    for (let v = 1; v <= 10; v++) {
      const selected = selectedValue === v ? ' rating-btn--selected' : '';
      html += `<button type="button" class="rating-btn${selected}" data-sector="${sector.id}" data-question="${qi}" data-value="${v}" role="radio" aria-checked="${selectedValue === v}" aria-label="Оценка ${v}">${v}</button>`;
    }

    html += `
        </div>
        <div class="rating-labels">
          <span>1 — хаос</span>
          <span>10 — система</span>
        </div>
      </div>
    `;
  });

  html += '</div>';

  dom.quizBody.innerHTML = html;
  updateProgress();
  updateNavButtons();
}

function updateProgress() {
  const pct = ((state.currentSector + 1) / 8) * 100;
  dom.progressFill.style.width = `${pct}%`;
  dom.progressLabel.textContent = `Сектор ${state.currentSector + 1} из 8 \u2014 ${SECTORS[state.currentSector].name}`;

  const progressBar = dom.progressFill.closest('.quiz-progress');
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', state.currentSector + 1);
  }
}

function updateNavButtons() {
  dom.btnQuizBack.hidden = state.currentSector === 0;

  const isLast = state.currentSector === 7;
  dom.btnQuizNext.textContent = isLast ? 'Получить результат' : 'Далее \u2192';

  checkAllAnswered();
}

function checkAllAnswered() {
  const sector = SECTORS[state.currentSector];
  const questions = getQuestionsForSector(state.currentSector);
  let allAnswered = true;

  for (let i = 0; i < questions.length; i++) {
    const key = `${sector.id}-${i}`;
    if (!state.answers[key]) {
      allAnswered = false;
      break;
    }
  }

  dom.btnQuizNext.disabled = !allAnswered;
}

/* === QUIZ EVENT HANDLERS === */

// Rating button clicks via event delegation
dom.quizBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.rating-btn');
  if (!btn) return;

  const sectorId = btn.dataset.sector;
  const questionIndex = btn.dataset.question;
  const value = parseInt(btn.dataset.value, 10);
  const key = `${sectorId}-${questionIndex}`;

  state.answers[key] = value;
  saveProgress();

  // Update visual state for this question group
  const group = btn.closest('.rating-buttons');
  group.querySelectorAll('.rating-btn').forEach(b => {
    b.classList.remove('rating-btn--selected');
    b.setAttribute('aria-checked', 'false');
  });
  btn.classList.add('rating-btn--selected');
  btn.setAttribute('aria-checked', 'true');

  checkAllAnswered();
});

// Keyboard support for rating buttons
dom.quizBody.addEventListener('keydown', (e) => {
  const btn = e.target.closest('.rating-btn');
  if (!btn) return;

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    btn.click();
  }

  const group = btn.closest('.rating-buttons');
  const buttons = Array.from(group.querySelectorAll('.rating-btn'));
  const idx = buttons.indexOf(btn);

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    const next = buttons[idx + 1] || buttons[0];
    next.focus();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = buttons[idx - 1] || buttons[buttons.length - 1];
    prev.focus();
  }
});

// Next button
dom.btnQuizNext.addEventListener('click', () => {
  if (dom.btnQuizNext.disabled) return;

  // If going from sector 1 (marketing) to sector 2 (production), show business type choice
  if (state.currentSector === 1 && !state.businessType) {
    showFeedback(1, () => {
      showScreen('choice');
    });
    return;
  }

  if (state.currentSector < 7) {
    const fromSector = state.currentSector;
    showFeedback(fromSector, () => {
      state.currentSector++;
      showScreen('quiz');
      renderSector(state.currentSector);
    });
  } else {
    // Last sector done -> contact form
    showFeedback(7, () => {
      prepareBlurredWheel();
      showScreen('contact');
      reachGoal('quiz_complete');
    });
  }
});

// Back button
dom.btnQuizBack.addEventListener('click', () => {
  if (state.currentSector > 0) {
    state.currentSector--;
    // If going back from sector 6 (production), may need to revisit choice
    renderSector(state.currentSector);
    updateProgress();
  }
});

// Start test
dom.btnStartTest.addEventListener('click', () => {
  state.currentSector = 0;
  showScreen('quiz');
  renderSector(0);
  reachGoal('quiz_start');
});

// Business type choice
document.querySelectorAll('.btn--choice').forEach(btn => {
  btn.addEventListener('click', () => {
    state.businessType = btn.dataset.type;
    // Set questions for production sector based on choice
    state.currentSector = 2;
    showScreen('quiz');
    renderSector(2);
  });
});

/* === MICRO FEEDBACK === */

function showFeedback(sectorIndex, callback) {
  dom.feedbackText.textContent = FEEDBACK_MESSAGES[sectorIndex];
  showScreen('feedback');

  setTimeout(() => {
    if (callback) callback();
  }, 1200);
}

/* === CONTACT FORM === */

function validateField(field, errorEl) {
  const value = field.value.trim();
  let errorMsg = '';

  switch (field.id) {
    case 'field-name':
      if (!value) errorMsg = 'Введите ваше имя';
      break;
    case 'field-phone':
      if (!value) {
        errorMsg = 'Введите корректный номер телефона';
      } else if (!/^[\d\s\+\-\(\)]{7,18}$/.test(value)) {
        errorMsg = 'Введите корректный номер телефона';
      }
      break;
    case 'field-email':
      if (!value) {
        errorMsg = 'Введите корректный адрес электронной почты';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = 'Введите корректный адрес электронной почты';
      }
      break;
  }

  errorEl.textContent = errorMsg;
  if (errorMsg) {
    field.classList.add('form-input--error');
  } else {
    field.classList.remove('form-input--error');
  }

  return !errorMsg;
}

dom.contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameField = document.getElementById('field-name');
  const phoneField = document.getElementById('field-phone');
  const emailField = document.getElementById('field-email');

  const nameValid = validateField(nameField, document.getElementById('error-name'));
  const phoneValid = validateField(phoneField, document.getElementById('error-phone'));
  const emailValid = validateField(emailField, document.getElementById('error-email'));

  if (nameValid && phoneValid && emailValid) {
    state.contactData = {
      name: nameField.value.trim(),
      phone: phoneField.value.trim(),
      email: emailField.value.trim()
    };

    calculateResults();
    sendLeadData();
    reachGoal('contact_submit');
    localStorage.removeItem('bw_progress');

    // Если пришли с result.html (challenge) — редирект обратно с моими результатами
    var refRaw = sessionStorage.getItem('bw_ref');
    if (refRaw) {
      try {
        var ref = JSON.parse(refRaw);
        sessionStorage.removeItem('bw_ref');
        var myScores = state.sectorAverages.map(function(v) { return v.toFixed(1); }).join(',');
        var myName = encodeURIComponent(state.contactData.name);
        window.location.href = 'result.html?n=' + encodeURIComponent(ref.n) +
          '&s=' + encodeURIComponent(ref.s) +
          '&b=' + ref.b +
          '&my=' + myScores +
          '&myname=' + myName;
        return;
      } catch (e) { /* если JSON сломан — показываем обычные результаты */ }
    }

    showScreen('results');
    renderResults();
    prefillDiagnosticPhone();
  }
});

// Real-time validation on blur
['field-name', 'field-phone', 'field-email'].forEach(fieldId => {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId.replace('field-', '')}`);
  field.addEventListener('blur', () => {
    if (field.value.trim()) {
      validateField(field, errorEl);
    }
  });
});

/* === BLURRED PREVIEW WHEEL === */

function prepareBlurredWheel() {
  const averages = calculateSectorAverages();
  const labels = SECTORS.map(s => s.name);
  drawRadarChart('blurred-wheel', averages, labels, 200, 200, false);
}

/* === RESULTS CALCULATION === */

function calculateSectorAverages() {
  const averages = [];
  SECTORS.forEach((sector, idx) => {
    const questions = getQuestionsForSector(idx);
    let sum = 0;
    let count = 0;
    questions.forEach((_, qi) => {
      const key = `${sector.id}-${qi}`;
      if (state.answers[key]) {
        sum += state.answers[key];
        count++;
      }
    });
    averages.push(count > 0 ? sum / count : 0);
  });
  return averages;
}

function calculateResults() {
  state.sectorAverages = calculateSectorAverages();
}

function getZone(value) {
  if (value <= 4) return 'danger';
  if (value <= 7) return 'warning';
  return 'success';
}

function getZoneColorClass(value) {
  return `score-color--${getZone(value)}`;
}

function renderResults() {
  const averages = state.sectorAverages;
  const totalScore = averages.reduce((a, b) => a + b, 0);
  const percent = Math.round((totalScore / 80) * 100);

  // Animate score number
  animateNumber(dom.resultScore, totalScore, 1);
  dom.resultPercent.textContent = `${percent}%`;

  // Color coding for score
  const scoreZone = getZone(totalScore / 8);
  dom.resultScore.className = `results-score__number ${getZoneColorClass(totalScore / 8)}`;
  dom.resultPercent.className = `results-score__percent ${getZoneColorClass(totalScore / 8)}`;

  // Status text
  let statusTitle, statusDesc;
  if (totalScore >= 60) {
    statusTitle = 'Системный бизнес';
    statusDesc = 'У вас крепкая основа — процессы выстроены, команда работает. Но даже здесь есть точки роста: устраните оставшиеся провалы, и бизнес выйдет на следующий уровень.';
  } else if (totalScore >= 35) {
    statusTitle = 'Бизнес на ручном управлении';
    statusDesc = 'Бизнес работает, но держится на вас лично. Вы — и стратег, и операционный директор, и пожарный. Это потолок роста: без системы масштабирование приведёт к хаосу.';
  } else {
    statusTitle = 'Бизнес в режиме выживания';
    statusDesc = 'Вы тушите пожары каждый день. Процессов нет, ответственность размыта, финансы непрозрачны. Без системного вмешательства ситуация не изменится — только усугубится.';
  }

  dom.statusTitle.textContent = statusTitle;
  dom.statusTitle.className = `results-status__title ${getZoneColorClass(totalScore / 8)}`;
  dom.statusDesc.textContent = statusDesc;

  // Draw radar chart
  const labels = SECTORS.map(s => s.name);
  drawRadarChart('result-wheel', averages, labels, 250, 250, true);

  // Find 2 weakest sectors
  const indexed = averages.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => a.val - b.val);
  const weakest = indexed.slice(0, 2);

  let weakHtml = '<h3 class="results-weak__heading">Ваши зоны роста</h3>';
  weakest.forEach(({ val, idx }) => {
    const sector = SECTORS[idx];
    const zone = getZone(val);
    let descKey = sector.id;

    // For production sector with services type, use different description
    if (idx === 2 && state.businessType === 'services') {
      descKey = 'production-services';
    }

    const desc = SECTOR_DESCRIPTIONS[descKey][zone];

    weakHtml += `
      <div class="weak-card weak-card--${zone}">
        <div class="weak-card__header">
          <span class="weak-card__score ${getZoneColorClass(val)}">${val.toFixed(1)}</span>
          <span class="weak-card__name">${sector.fullName}</span>
        </div>
        <p class="weak-card__detail"><strong>Что это значит:</strong> ${desc.meaning}</p>
        <p class="weak-card__detail"><strong>К чему приводит:</strong> ${desc.impact}</p>
        <p class="weak-card__detail"><strong>Что делать:</strong> ${desc.action}</p>
      </div>
    `;
  });

  dom.resultsWeak.innerHTML = weakHtml;
}

/* === SCORE ANIMATION === */

function animateNumber(el, target, decimals) {
  const duration = 800;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = current.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }

  requestAnimationFrame(tick);
}

/* === DIAGNOSTIC CTA (inline-форма на странице результатов) === */

// Предзаполнение телефона при показе результатов
function prefillDiagnosticPhone() {
  var phoneField = document.getElementById('diag-phone');
  if (phoneField && state.contactData.phone) {
    phoneField.value = state.contactData.phone;
  }
}

// Выбор способа связи (toggle)
document.querySelectorAll('.btn--method').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (btn.classList.contains('btn--method--selected')) {
      btn.classList.remove('btn--method--selected');
      return;
    }
    document.querySelectorAll('.btn--method').forEach(function(b) {
      b.classList.remove('btn--method--selected');
    });
    btn.classList.add('btn--method--selected');
  });
});

// Отправка заявки
document.getElementById('btn-diagnostic').addEventListener('click', function() {
  reachGoal('diagnostic_click');

  var phoneField = document.getElementById('diag-phone');
  var phone = phoneField.value.trim();

  // Обновляем телефон если изменили
  if (phone) {
    state.contactData.phone = phone;
  }

  // Выбранный способ связи (может быть пустым)
  var selectedMethod = document.querySelector('.btn--method--selected');
  var preferredContact = selectedMethod ? selectedMethod.dataset.method : '';

  // Отправка в Google Sheets
  sendDiagnosticData(preferredContact);

  // Показываем подтверждение, скрываем форму
  document.getElementById('diagnostic-form').hidden = true;
  document.getElementById('diagnostic-success').hidden = false;
});

function sendDiagnosticData(preferredContact) {
  if (!WEBHOOK_URL) return;

  var payload = {
    action: 'diagnostic_request',
    email: state.contactData.email,
    phone: state.contactData.phone,
    name: state.contactData.name,
    preferredContact: preferredContact
  };

  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).catch(function(err) {
    console.error('Ошибка отправки заявки на диагностику:', err);
  });
}

/* === SHARE === */

dom.btnShare.addEventListener('click', () => {
  var scores = state.sectorAverages.map(function(v) { return v.toFixed(1); });
  var encodedName = encodeURIComponent(state.contactData.name || 'Я');
  var btype = state.businessType || 'services';
  var resultUrl = SITE_URL + 'result.html?n=' + encodedName + '&s=' + scores.join(',') + '&b=' + btype;
  var totalScore = state.sectorAverages.reduce(function(a, b) { return a + b; }, 0);
  var shareText = 'Прошёл тест на системность бизнеса. Мой индекс — ' + totalScore.toFixed(1) + ' из 80. А какой у тебя? → ' + resultUrl;

  reachGoal('share_click');

  navigator.clipboard.writeText(shareText).then(function() {
    var btn = dom.btnShare;
    var hint = document.getElementById('share-hint');
    var original = btn.textContent;
    btn.textContent = '✓ Скопировано!';
    if (hint) hint.hidden = false;
    setTimeout(function() {
      btn.textContent = original;
    }, 3000);
  }).catch(function() {});
});

/* === CHECKLIST DOWNLOAD (PDF) === */

document.getElementById('btn-download-checklist').addEventListener('click', () => {
  reachGoal('checklist_download');
  generateChecklistPDF();
});

function buildResultsUrl() {
  var scores = state.sectorAverages.map(function(v) { return v.toFixed(1); });
  return SITE_URL + '#r=' + btoa(scores.join(','));
}

function generateChecklistPDF() {
  window.open('checklist.html', '_blank');
}

/* === SEND LEAD DATA === */

function buildLeadPayload() {
  const averages = state.sectorAverages;
  const totalScore = averages.reduce((a, b) => a + b, 0);

  let status;
  if (totalScore >= 60) {
    status = 'Системный бизнес';
  } else if (totalScore >= 35) {
    status = 'Бизнес на ручном управлении';
  } else {
    status = 'Бизнес в режиме выживания';
  }

  // Два самых слабых сектора
  const indexed = averages.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => a.val - b.val);

  return {
    name: state.contactData.name,
    phone: state.contactData.phone,
    email: state.contactData.email,
    businessType: state.businessType,
    scores: {
      sales: +averages[0].toFixed(1),
      marketing: +averages[1].toFixed(1),
      production: +averages[2].toFixed(1),
      finance: +averages[3].toFixed(1),
      hr: +averages[4].toFixed(1),
      quality: +averages[5].toFixed(1),
      management: +averages[6].toFixed(1),
      strategy: +averages[7].toFixed(1)
    },
    totalScore: +totalScore.toFixed(1),
    status: status,
    weakZone1: SECTORS[indexed[0].idx].fullName + ' (' + indexed[0].val.toFixed(1) + ')',
    weakZone2: SECTORS[indexed[1].idx].fullName + ' (' + indexed[1].val.toFixed(1) + ')',
    answers: Object.assign({}, state.answers)
  };
}

function sendLeadData() {
  if (!WEBHOOK_URL) {
    console.warn('WEBHOOK_URL не настроен — данные не отправлены. См. docs/google-sheets-setup.md');
    return;
  }

  const payload = buildLeadPayload();

  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).catch(function(err) {
    console.error('Ошибка отправки лида:', err);
  });
}

/* === RESTORE RESULTS FROM URL HASH === */

function tryRestoreFromHash() {
  var hash = window.location.hash;
  if (!hash || hash.indexOf('#r=') !== 0) return false;

  try {
    var encoded = hash.slice(3); // убираем '#r='
    var decoded = atob(encoded);
    var values = decoded.split(',').map(Number);

    if (values.length !== 8 || values.some(isNaN)) return false;

    // Восстанавливаем результаты
    state.sectorAverages = values;
    showScreen('results');
    renderResults();
    prefillDiagnosticPhone();
    reachGoal('results_restored');
    return true;
  } catch (e) {
    return false;
  }
}

/* === REF PARAMS (сохраняем контекст с result.html challenge) === */

function readRefParams() {
  var params = new URLSearchParams(window.location.search);
  var refN = params.get('ref_n');
  var refS = params.get('ref_s');
  var refB = params.get('ref_b');
  if (refN && refS) {
    sessionStorage.setItem('bw_ref', JSON.stringify({ n: refN, s: refS, b: refB || 'services' }));
  }
}

/* === PROGRESS SAVE/RESTORE (localStorage) === */

function saveProgress() {
  try {
    localStorage.setItem('bw_progress', JSON.stringify({
      answers: state.answers,
      btype: state.businessType
    }));
  } catch (e) {}
}

function tryRestoreProgress() {
  try {
    var saved = localStorage.getItem('bw_progress');
    if (!saved) return false;
    var data = JSON.parse(saved);
    if (!data.answers || Object.keys(data.answers).length === 0) return false;
    state.answers = data.answers;
    if (data.btype) state.businessType = data.btype;
    return true;
  } catch (e) {
    return false;
  }
}

/* === DEMO MODE (только для локального просмотра) === */

function tryDemoMode() {
  var params = new URLSearchParams(window.location.search);
  var demo = params.get('demo');
  if (!demo) return false;

  var demoScores = [7, 4, 8, 3, 6, 5, 5, 7];
  state.businessType = 'services';
  state.sectorAverages = demoScores;
  state.contactData = { name: 'Павел', phone: '+7 900 000-00-00', email: 'demo@example.com' };

  if (demo === 'contact') {
    showScreen('contact');
    return true;
  }
  if (demo === 'results') {
    showScreen('results');
    renderResults();
    prefillDiagnosticPhone();
    return true;
  }
  if (demo === 'shared') {
    // Симулирует открытие чужой shared-ссылки (#r=...)
    showScreen('results');
    renderResults();
    return true;
  }
  return false;
}

/* === INITIALIZATION === */

function init() {
  readRefParams();
  tryRestoreProgress();
  if (tryDemoMode()) return;
  if (!tryRestoreFromHash()) {
    drawDemoWheel();
  }
}

init();
