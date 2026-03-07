'use strict';

/* ===================================================================
   Business Commandos — Тест на системность бизнеса
   main-v2.js — Quiz Logic для двухколоночной версии (index-v2.html)
   Standalone файл: не импортирует main.js, данные скопированы.
   =================================================================== */

/* === CONFIG === */

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby25XvUx7zaRCIomKl55OxYix6BfU9aDSxv3YPM3i11HaHu5RAFa_npxOEOvgeHkd2r6A/exec';
const SITE_URL = 'https://audit.businesscommandos.ru/';
const YM_ID = 105930063;

function reachGoal(goalName) {
  if (typeof ym === 'function') {
    ym(YM_ID, 'reachGoal', goalName);
  }
}

/* === SECTOR DATA === */

const SECTORS = [
  {
    id: 'sales',
    name: 'Продажи',
    fullName: 'Продажи',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    description: 'CRM, воронка с конверсиями на каждом этапе, скрипты и тренировки, прогнозируемая выручка.',
    whyImportant: 'Без CRM и скриптов каждый менеджер — чёрный ящик. Зависите от «звёзд».',
    motivation: 'Начало положено. 7 секторов ещё покажут полную картину.',
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
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    description: 'Маркетинговая стратегия, ответственный за результат, дашборд с ROI, предсказуемый поток лидов.',
    whyImportant: 'Без маркетинговой системы продажи зависят от удачи и личных связей.',
    motivation: 'Уже 2 из 8. Колесо начинает вырисовываться.',
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
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    descriptionGoods: 'Себестоимость известна, складской учёт, контроль качества, начальник производства.',
    descriptionServices: 'Себестоимость услуги, NPS и обратная связь, проектное управление, рекламации.',
    whyImportant: 'Непрозрачное производство съедает маржу незаметно. Рост ведёт к хаосу.',
    motivation: 'Половина пути. Продолжайте — результат будет точнее.',
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
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    description: 'Чистая прибыль точно известна, управленческая отчётность, кассовое планирование.',
    whyImportant: '75% кассовых кризисов — следствие отсутствия финансового планирования.',
    motivation: '4 из 8 — финансы часто удивляют.',
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
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    description: 'Воронки найма, пошаговая адаптация, замена ключевых людей без ущерба, должностные инструкции.',
    whyImportant: 'Кадровая зависимость — уязвимость всей системы. Уволится один — остановится всё.',
    motivation: 'Больше половины позади. Осталось 3 сектора.',
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
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    description: 'Ответственный за качество, мониторинг продаж, проактивный контроль до жалоб клиентов.',
    whyImportant: 'Без контроля качества масштабирование = деградация. Один плохой опыт — минус 10 клиентов.',
    motivation: 'Почти готово. Ещё 2 сектора.',
    questions: [
      'В компании есть ответственный (человек или отдел) за контроль качества ключевых процессов',
      'Работа отдела продаж контролируется — звонки прослушиваются, переписки проверяются, CRM анализируется',
      'Руководители регулярно получают отчёты о нарушениях и ведут работу по их устранению',
      'Контроль качества — проактивный: проблемы выявляются до того, как клиент пожалуется'
    ]
  },
  {
    id: 'management',
    name: 'Управление',
    fullName: 'Общая система управления',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    description: 'Регулярные планёрки, чёткая оргструктура, система задач, автономность команды.',
    whyImportant: 'Собственник в операционке — потолок роста. Бизнес должен работать без вас.',
    motivation: 'Последний рывок. Один сектор до результата.',
    questions: [
      'Планёрки проходят регулярно, не реже раза в неделю — на них ставятся задачи, подводятся итоги, анализируются цифры',
      'В компании есть чёткая организационная структура — понятно, кто кому подчиняется и кто принимает решения',
      'Все задачи фиксируются письменно в системе управления задачами, где контролируется их выполнение',
      'Бизнес работает без постоянного участия собственника — 80-90% решений принимаются командой самостоятельно'
    ]
  },
  {
    id: 'strategy',
    name: 'Стратегия',
    fullName: 'Стратегия и планирование',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    description: 'Наличие целей, декомпозиции на квартальные планы, понимание unit-экономики и бизнес-модели.',
    whyImportant: 'Без стратегии бизнес реагирует, а не управляет — команда работает вразнобой.',
    motivation: 'Последний сектор. Результат уже совсем близко.',
    questions: [
      'У компании есть чёткие цели минимум на год, декомпозированные на квартальные планы',
      'В компании внедрена система целеполагания (OKR, KPI или аналог) — цели сотрудников связаны с целями компании',
      'Собственник знает свою бизнес-модель и unit-экономику: маржинальность по продуктам, LTV клиента, точку безубыточности',
      'Стратегические сессии проходят регулярно — не реже раза в квартал подводятся итоги и корректируется курс'
    ]
  }
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
      meaning: 'Бизнес держится на вас: вы принимаете большинство решений, задачи не фиксируются, планёрок нет.',
      impact: 'Вы не можете уйти в отпуск без потерь. Сотрудники не берут ответственность.',
      action: 'Начните с одного еженедельного совещания с фиксацией задач в любой системе.'
    },
    warning: {
      meaning: 'Управленческие инструменты есть, но применяются непоследовательно.',
      impact: 'Информация теряется, задачи зависают, собственник вовлечён в оперативку больше, чем хотелось бы.',
      action: 'Стандартизируйте управленческий ритм: одинаковый формат планёрок, единая система задач.'
    },
    success: {
      meaning: 'В компании работает регулярный менеджмент: совещания, задачи, отчёты — всё по системе.',
      impact: 'Собственник управляет стратегически, а не операционно.',
      action: 'Поддерживайте систему и проверяйте, не деградируют ли процессы при росте команды.'
    }
  },
  hr: {
    danger: {
      meaning: 'Найм — хаотичный процесс: берёте первого подходящего, адаптация зависит от настроения собственника.',
      impact: 'Высокая текучка, долгое вхождение в должность, уход ключевых людей парализует бизнес.',
      action: 'Опишите портрет идеального кандидата и создайте простой адаптационный чек-лист.'
    },
    warning: {
      meaning: 'Воронки найма существуют, но адаптация всё ещё требует много времени собственника.',
      impact: 'Новые люди входят медленно, ключевые сотрудники перегружены обучением.',
      action: 'Создайте базу знаний с регламентами и видеоинструкциями — это сократит адаптацию в 2–3 раза.'
    },
    success: {
      meaning: 'Найм и адаптация работают как конвейер: понятные воронки, описанные процессы.',
      impact: 'Бизнес не зависит от конкретных людей, замена сотрудника не создаёт кризиса.',
      action: 'Убедитесь, что стандарты найма обновляются под рост компании.'
    }
  },
  finance: {
    danger: {
      meaning: 'Финансы непрозрачны: не понятно, сколько зарабатывает компания, деньги бизнеса и личные смешаны.',
      impact: 'Кассовые разрывы как неожиданность, невозможность планировать развитие.',
      action: 'Начните разделять личный и корпоративный счёт, фиксируйте все доходы и расходы в таблице.'
    },
    warning: {
      meaning: 'Базовая отчётность ведётся, но управленческий учёт неполный.',
      impact: 'Решения о найме, инвестициях и ценах принимаются интуитивно, а не на основе цифр.',
      action: 'Внедрите ежемесячный управленческий отчёт: ДДС + P&L + прогноз ликвидности.'
    },
    success: {
      meaning: 'Финансы прозрачны: собственник знает прибыль, остатки на счетах в любой момент.',
      impact: 'Решения принимаются на основе данных, кассовые разрывы исключены.',
      action: 'Проверьте, насколько финансовая отчётность используется руководителями для решений.'
    }
  },
  marketing: {
    danger: {
      meaning: 'Маркетинга как системы нет: клиенты приходят по сарафану, реклама запускается хаотично.',
      impact: 'Нестабильный поток клиентов, невозможность прогнозировать выручку.',
      action: 'Зафиксируйте, откуда сейчас приходят клиенты, и сделайте один канал стабильным.'
    },
    warning: {
      meaning: 'Маркетинг ведётся, но без чёткой стратегии и системы аналитики.',
      impact: 'Бюджет расходуется неоптимально, масштабировать рекламу страшно.',
      action: 'Внедрите маркетинговый дашборд: CPL и конверсии по каждому каналу.'
    },
    success: {
      meaning: 'Маркетинг генерирует стабильный поток лидов с измеримой стоимостью по каждому каналу.',
      impact: 'Выручка прогнозируема, масштабирование рекламы управляемо.',
      action: 'Проверьте синхронизацию маркетинговой стратегии с планами продаж и производства.'
    }
  },
  sales: {
    danger: {
      meaning: 'Продажи непредсказуемы: CRM не используется, скриптов нет, результат зависит от менеджера.',
      impact: 'Выручка скачет, потеря клиентов на каждом этапе воронки, уход менеджера = потеря базы.',
      action: 'Внедрите CRM хотя бы для фиксации контактов и этапов сделки.'
    },
    warning: {
      meaning: 'CRM есть, воронка описана, но конверсии не анализируются регулярно.',
      impact: 'Лиды теряются на понятных этапах, прогноз выручки неточный.',
      action: 'Раз в месяц анализируйте конверсию на каждом этапе и разбирайте реальные звонки.'
    },
    success: {
      meaning: 'Продажи управляемы: CRM заполняется, воронка отслеживается, выручка прогнозируется.',
      impact: 'Рост выручки управляем, слабые места воронки видны и исправляются вовремя.',
      action: 'Убедитесь, что новый менеджер выходит на плановые показатели за 4–6 недель.'
    }
  },
  production: {
    danger: {
      meaning: 'Производство непрозрачно: сроки срываются, себестоимость неизвестна, брак не контролируется.',
      impact: 'Клиенты недовольны, маржа падает из-за скрытых потерь.',
      action: 'Посчитайте реальную себестоимость продукта и зафиксируйте нормативы сроков.'
    },
    warning: {
      meaning: 'Производство работает, но начальник цеха зависит от собственника при нестандартных ситуациях.',
      impact: 'Масштабирование ограничено, контроль качества реактивный.',
      action: 'Опишите ключевые производственные процессы и передайте операционную ответственность.'
    },
    success: {
      meaning: 'Производство работает по регламентам: сроки соблюдаются, себестоимость известна.',
      impact: 'Собственник не вовлечён в операционку, масштабирование возможно.',
      action: 'Найдите, где ещё можно сократить потери — хронометраж операций даст ответ.'
    }
  },
  'production-services': {
    danger: {
      meaning: 'Услуги оказываются без стандартов: каждый делает как умеет, рекламаций много.',
      impact: 'Клиенты уходят после первой сделки, маржа под угрозой.',
      action: 'Зафиксируйте стандарт качественной услуги и начните собирать обратную связь.'
    },
    warning: {
      meaning: 'Качество услуг в целом устраивает клиентов, но контроль непоследователен.',
      impact: 'NPS нестабилен, масштабирование приводит к деградации качества.',
      action: 'Внедрите систему сбора NPS после каждого проекта и разбирайте негативные случаи.'
    },
    success: {
      meaning: 'Качество услуг стабильно: процессы описаны, NPS отслеживается, рекламации редки.',
      impact: 'Клиенты возвращаются и рекомендуют — органический рост за счёт репутации.',
      action: 'Формализуйте стандарты качества и используйте их в найме как конкурентное преимущество.'
    }
  },
  quality: {
    danger: {
      meaning: 'Контроля качества нет как системы: проблемы обнаруживаются, когда клиент уже недоволен.',
      impact: 'Репутационные потери, рост расходов на устранение последствий.',
      action: 'Назначьте ответственного за качество и начните с еженедельного разбора жалоб и ошибок.'
    },
    warning: {
      meaning: 'Контроль есть, но работает реактивно: проверки проводятся после инцидентов.',
      impact: 'Часть проблем всё ещё доходит до клиента, ОКК не работает как независимый фильтр.',
      action: 'Переведите контроль в проактивный режим: внедрите чек-листы на ключевых этапах.'
    },
    success: {
      meaning: 'Контроль качества — системный и проактивный: звонки прослушиваются, CRM проверяется.',
      impact: 'Проблемы выявляются до клиента, команда работает в культуре стандартов.',
      action: 'Убедитесь, что данные ОКК влияют на систему мотивации.'
    }
  }
};

/* === STATE === */

const state = {
  currentView: 'landing',   // landing | quiz | choice | contact | results
  currentSector: 0,
  businessType: null,        // 'goods' | 'services'
  answers: {},
  contactData: {},
  sectorAverages: []
};

/* === HELPERS === */

function getZone(value) {
  if (value <= 4) return 'danger';
  if (value <= 7) return 'warning';
  return 'success';
}

function getZoneColor(value) {
  if (value <= 4) return '#EF4444';
  if (value <= 7) return '#EAB308';
  return '#22C55E';
}

function getZoneColorClass(value) {
  return `score-color--${getZone(value)}`;
}

function getQuestionsForSector(idx) {
  const sector = SECTORS[idx];
  if (idx === 2) {
    return state.businessType === 'goods' ? sector.questionsGoods : sector.questionsServices;
  }
  return sector.questions;
}

function calculateSectorAverages() {
  return SECTORS.map((sector, idx) => {
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
    return count > 0 ? sum / count : 0;
  });
}

/* === SAVE / RESTORE === */

function saveProgress() {
  try {
    localStorage.setItem('bw_v2_progress', JSON.stringify({
      answers: state.answers,
      btype: state.businessType
    }));
  } catch (e) {}
}

function tryRestoreProgress() {
  try {
    const saved = localStorage.getItem('bw_v2_progress');
    if (!saved) return false;
    const data = JSON.parse(saved);
    if (!data.answers || Object.keys(data.answers).length === 0) return false;
    state.answers = data.answers;
    if (data.btype) state.businessType = data.btype;
    return true;
  } catch (e) {
    return false;
  }
}

/* ===================================================================
   SVG RADAR / LIVE WHEEL RENDERING
   =================================================================== */

/**
 * Draws a radar/spider chart.
 * @param {string} svgId - ID of the SVG element
 * @param {number[]} values - Array of 8 values (0-10)
 * @param {string[]} labels - Label names
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {boolean} animate - Whether to animate the polygon
 * @param {number} [size=160] - maxRadius override (inner drawing area)
 */
function drawRadarChart(svgId, values, labels, cx, cy, animate, size) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const maxVal = 10;
  const levels = [2, 4, 6, 8, 10];
  const numAxes = values.length;
  const angleStep = (2 * Math.PI) / numAxes;
  const startAngle = -Math.PI / 2;
  const maxRadius = size !== undefined ? size : Math.min(cx, cy) - 40;

  let html = '';

  // Background grid
  levels.forEach(level => {
    const pts = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const r = (level / maxVal) * maxRadius;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    html += `<polygon points="${pts.join(' ')}" fill="none" stroke="#1E3A5F" stroke-opacity="0.5" stroke-width="1"/>`;
  });

  // Axes
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const x2 = cx + maxRadius * Math.cos(angle);
    const y2 = cy + maxRadius * Math.sin(angle);
    html += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#1E3A5F" stroke-opacity="0.5" stroke-width="1"/>`;
  }

  // Data polygon
  const dataPts = [];
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const r = (values[i] / maxVal) * maxRadius;
    dataPts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  let fillColor, strokeColor;
  if (avg <= 4) {
    fillColor = 'rgba(239, 68, 68, 0.2)';
    strokeColor = '#EF4444';
  } else if (avg <= 7) {
    fillColor = 'rgba(234, 179, 8, 0.2)';
    strokeColor = '#EAB308';
  } else {
    fillColor = 'rgba(34, 197, 94, 0.2)';
    strokeColor = '#22C55E';
  }

  const animClass = animate ? ' class="radar-area"' : '';
  html += `<polygon points="${dataPts.join(' ')}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" stroke-opacity="0.9"${animClass}/>`;

  // Dots + colored axis lines
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const r = (values[i] / maxVal) * maxRadius;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    const dotColor = getZoneColor(values[i]);
    const lineEndX = cx + maxRadius * Math.cos(angle);
    const lineEndY = cy + maxRadius * Math.sin(angle);
    html += `<line x1="${cx}" y1="${cy}" x2="${lineEndX}" y2="${lineEndY}" stroke="${dotColor}" stroke-opacity="0.25" stroke-width="2"/>`;
    html += `<circle cx="${px}" cy="${py}" r="4" fill="${dotColor}" stroke="#070B14" stroke-width="2"/>`;
  }

  // Labels
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const labelR = maxRadius + 22;
    const lx = cx + labelR * Math.cos(angle);
    const ly = cy + labelR * Math.sin(angle);
    let anchor = 'middle';
    if (Math.cos(angle) < -0.1) anchor = 'end';
    else if (Math.cos(angle) > 0.1) anchor = 'start';
    const dotColor = getZoneColor(values[i]);
    html += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="central" fill="${dotColor}" font-family="Inter, sans-serif" font-size="11" font-weight="500">${labels[i]}</text>`;
    html += `<text x="${lx}" y="${ly + 13}" text-anchor="${anchor}" dominant-baseline="central" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10">${values[i].toFixed(1)}</text>`;
  }

  // Auto viewBox
  let vbMinX = cx - maxRadius;
  let vbMaxX = cx + maxRadius;
  let vbMinY = cy - maxRadius;
  let vbMaxY = cy + maxRadius;
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const lr = maxRadius + 22;
    const lx = cx + lr * Math.cos(angle);
    const ly = cy + lr * Math.sin(angle);
    const cosA = Math.cos(angle);
    const estW = labels[i].length * 7;
    let lLeft, lRight;
    if (cosA > 0.1)       { lLeft = lx;          lRight = lx + estW; }
    else if (cosA < -0.1) { lLeft = lx - estW;   lRight = lx; }
    else                  { lLeft = lx - estW / 2; lRight = lx + estW / 2; }
    vbMinX = Math.min(vbMinX, lLeft);
    vbMaxX = Math.max(vbMaxX, lRight);
    vbMinY = Math.min(vbMinY, ly - 8);
    vbMaxY = Math.max(vbMaxY, ly + 22);
  }
  const pad = 8;
  svg.setAttribute('viewBox', `${Math.floor(vbMinX - pad)} ${Math.floor(vbMinY - pad)} ${Math.ceil(vbMaxX - vbMinX + pad * 2)} ${Math.ceil(vbMaxY - vbMinY + pad * 2)}`);
  svg.innerHTML = html;
}

/**
 * Draws the live "building" wheel for the right panel.
 * Completed sectors: filled with real color
 * Current sector: pulsing outline
 * Future sectors: dashed, opacity 0.3
 */
function drawLiveWheel(svgId, completedCount, currentIdx, sectorAverages) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const numAxes = 8;
  const cx = 100;
  const cy = 100;
  const maxRadius = 72;
  const angleStep = (2 * Math.PI) / numAxes;
  const startAngle = -Math.PI / 2;
  const maxVal = 10;
  const levels = [2, 4, 6, 8, 10];

  let html = '';

  // Background grid
  levels.forEach(level => {
    const pts = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const r = (level / maxVal) * maxRadius;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    html += `<polygon points="${pts.join(' ')}" fill="none" stroke="#1E3A5F" stroke-opacity="0.5" stroke-width="1"/>`;
  });

  // Axes
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const x2 = cx + maxRadius * Math.cos(angle);
    const y2 = cy + maxRadius * Math.sin(angle);
    html += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#1E3A5F" stroke-opacity="0.4" stroke-width="1"/>`;
  }

  // Sector fills: one per axis, as a wedge-like polygon (triangle to max circle)
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const nextAngle = startAngle + (i + 1) * angleStep;
    const steps = 8;
    const pts = [`${cx},${cy}`];
    for (let s = 0; s <= steps; s++) {
      const a = angle + (nextAngle - angle) * (s / steps);
      pts.push(`${cx + maxRadius * Math.cos(a)},${cy + maxRadius * Math.sin(a)}`);
    }
    const ptStr = pts.join(' ');

    if (i < completedCount) {
      // Completed — fill at actual value
      const val = sectorAverages[i] || 0;
      const color = getZoneColor(val);
      const r = (val / maxVal) * maxRadius;
      const filledPts = [`${cx},${cy}`];
      for (let s = 0; s <= steps; s++) {
        const a = angle + (nextAngle - angle) * (s / steps);
        filledPts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
      }
      html += `<polygon points="${ptStr}" fill="${color}" fill-opacity="0.08" stroke="none"/>`;
      html += `<polygon points="${filledPts.join(' ')}" fill="${color}" fill-opacity="0.35" stroke="${color}" stroke-width="1.5" stroke-opacity="0.8"/>`;
    } else if (i === currentIdx) {
      // Current — pulsing outline
      html += `<polygon points="${ptStr}" fill="#F59E0B" fill-opacity="0.06" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.8" stroke-dasharray="none" class="v2-wheel-current-pulse"/>`;
    } else {
      // Future — dashed faint
      html += `<polygon points="${ptStr}" fill="none" stroke="#94A3B8" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="3,3"/>`;
    }
  }

  // Labels on axes
  const labels = SECTORS.map(s => s.name);
  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const lr = maxRadius + 16;
    const lx = cx + lr * Math.cos(angle);
    const ly = cy + lr * Math.sin(angle);
    let anchor = 'middle';
    if (Math.cos(angle) < -0.1) anchor = 'end';
    else if (Math.cos(angle) > 0.1) anchor = 'start';
    const fill = i < completedCount ? getZoneColor(sectorAverages[i] || 0) :
                 i === currentIdx    ? '#F59E0B' : '#475569';
    html += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="central" fill="${fill}" font-family="Inter, sans-serif" font-size="9" font-weight="500">${labels[i]}</text>`;
  }

  svg.setAttribute('viewBox', '0 0 200 200');
  svg.innerHTML = html;
}

/* ===================================================================
   VIEW RENDERING
   =================================================================== */

/* --- LANDING --- */
function renderLanding() {
  // Draw demo wheel
  const demoValues = [8, 6, 7, 9, 5, 8, 7, 6];
  const labels = SECTORS.map(s => s.name);
  drawRadarChart('v2-demo-wheel', demoValues, labels, 200, 160, false);
}

/* --- QUIZ LEFT PANEL --- */
function renderQuizLeft(sectorIdx) {
  const sector = SECTORS[sectorIdx];
  const questions = getQuestionsForSector(sectorIdx);
  const sectorTitle = (sectorIdx === 2)
    ? (state.businessType === 'goods' ? 'Производство товаров' : 'Оказание услуг')
    : sector.fullName;

  // Update header
  const sectorLabel = document.getElementById('v2-progress-sector');
  if (sectorLabel) {
    sectorLabel.innerHTML = `<strong>${sectorTitle}</strong> · Сектор ${sectorIdx + 1} из 8`;
  }

  const progressFill = document.getElementById('v2-progress-fill');
  if (progressFill) {
    progressFill.style.width = `${((sectorIdx + 1) / 8) * 100}%`;
  }

  const progressBar = document.getElementById('v2-progress-bar');
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', sectorIdx + 1);
  }

  // Count answered questions for this sector
  let answeredCount = 0;
  questions.forEach((_, qi) => {
    if (state.answers[`${sector.id}-${qi}`]) answeredCount++;
  });

  // Build question HTML (show one question at a time — show first unanswered, or last)
  let activeQ = 0;
  for (let i = 0; i < questions.length; i++) {
    if (!state.answers[`${sector.id}-${i}`]) { activeQ = i; break; }
    if (i === questions.length - 1) activeQ = i;
  }

  const questionBlock = document.getElementById('v2-question-block');
  if (!questionBlock) return;

  // Dots
  let dotsHtml = '';
  for (let i = 0; i < questions.length; i++) {
    const answered = !!state.answers[`${sector.id}-${i}`];
    const current = i === activeQ;
    const cls = answered ? 'v2-question-dot--done' : (current ? 'v2-question-dot--current' : '');
    dotsHtml += `<span class="v2-question-dot ${cls}" aria-hidden="true"></span>`;
  }

  const selectedVal = state.answers[`${sector.id}-${activeQ}`] || null;

  let scaleHtml = '';
  for (let v = 1; v <= 10; v++) {
    const zone = v <= 4 ? 'danger' : v <= 7 ? 'warning' : 'success';
    let btnClass = 'v2-scale-btn';
    if (selectedVal === v) {
      btnClass += ` v2-scale-btn--${zone}`;
    } else if (selectedVal !== null && v <= selectedVal) {
      btnClass += ` v2-scale-btn--hint-${zone}`;
    }
    const checked = selectedVal === v ? 'true' : 'false';
    scaleHtml += `<button type="button" class="${btnClass}" data-sector="${sector.id}" data-question="${activeQ}" data-value="${v}" role="radio" aria-checked="${checked}" aria-label="Оценка ${v}">${v}</button>`;
  }

  questionBlock.innerHTML = `
    <div class="v2-question-counter">
      <span>Вопрос ${activeQ + 1} из ${questions.length}</span>
      <span class="v2-question-dots" aria-hidden="true">${dotsHtml}</span>
    </div>
    <p class="v2-question-text">${questions[activeQ]}</p>
    <div class="v2-scale">
      <div class="v2-scale__buttons" role="radiogroup" aria-label="Оценка от 1 до 10">
        ${scaleHtml}
      </div>
      <div class="v2-scale-labels" aria-hidden="true">
        <span>1 — хаос</span>
        <span>10 — система</span>
      </div>
    </div>
  `;

  updateNavButtons();
}

/* --- QUIZ RIGHT PANEL --- */
function renderQuizRight(sectorIdx) {
  const sector = SECTORS[sectorIdx];
  const completedCount = sectorIdx; // sectors before current are done
  const avgsSoFar = calculateSectorAverages();

  // Sector description
  const descEl = document.getElementById('v2-sector-desc-text');
  const whyEl = document.getElementById('v2-sector-why-text');
  const nameEl = document.getElementById('v2-sector-info-name');
  const iconEl = document.getElementById('v2-sector-info-icon');

  if (nameEl) {
    const title = (sectorIdx === 2)
      ? (state.businessType === 'goods' ? 'Производство' : 'Оказание услуг')
      : sector.name;
    nameEl.textContent = title;
  }
  if (iconEl) iconEl.innerHTML = sector.icon;

  if (descEl) {
    if (sectorIdx === 2) {
      descEl.textContent = state.businessType === 'goods'
        ? sector.descriptionGoods
        : (sector.descriptionServices || sector.description || '');
    } else {
      descEl.textContent = sector.description || '';
    }
  }
  if (whyEl) whyEl.textContent = sector.whyImportant || '';

  // Motivation text
  const motivEl = document.getElementById('v2-motivation-text');
  if (motivEl) motivEl.textContent = sector.motivation || '';

  // Live wheel
  drawLiveWheel('v2-live-wheel', completedCount, sectorIdx, avgsSoFar);

  const captionEl = document.getElementById('v2-live-wheel-caption');
  if (captionEl) captionEl.textContent = `Заполнено ${completedCount} из 8 секторов`;

  // aria-live update
  const liveRegion = document.getElementById('v2-wheel-live-region');
  if (liveRegion) {
    liveRegion.textContent = `Сектор ${sectorIdx + 1} из 8: ${sector.name}. Завершено секторов: ${completedCount}`;
  }
}

/* --- NAV BUTTONS --- */
function updateNavButtons() {
  const btnBack = document.getElementById('v2-btn-back');
  const btnNext = document.getElementById('v2-btn-next');
  if (!btnBack || !btnNext) return;

  btnBack.hidden = state.currentSector === 0;

  const isLast = state.currentSector === 7;
  btnNext.textContent = isLast ? 'Получить результат' : 'Далее →';

  // Check if current question is answered
  const sector = SECTORS[state.currentSector];
  const questions = getQuestionsForSector(state.currentSector);
  const allAnswered = questions.every((_, qi) => !!state.answers[`${sector.id}-${qi}`]);
  btnNext.disabled = !allAnswered;
}

function checkCurrentQuestionAnswered() {
  const sector = SECTORS[state.currentSector];
  const questions = getQuestionsForSector(state.currentSector);
  const allAnswered = questions.every((_, qi) => !!state.answers[`${sector.id}-${qi}`]);
  const btnNext = document.getElementById('v2-btn-next');
  if (btnNext) btnNext.disabled = !allAnswered;
}

/* ===================================================================
   VIEW TRANSITIONS
   =================================================================== */

function showView(viewName) {
  // Hide all views
  document.querySelectorAll('.v2-view').forEach(el => {
    el.hidden = true;
    el.classList.remove('v2-view--active');
  });

  const next = document.getElementById(`v2-view-${viewName}`);
  if (!next) return;
  next.hidden = false;
  next.classList.add('v2-view--active');
  state.currentView = viewName;

  // Update body scroll and layout
  window.scrollTo(0, 0);

  // Focus management
  const heading = next.querySelector('h1, h2, [role="heading"]');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

/* ===================================================================
   SECTOR DONE NOTIFICATION (inline in right panel)
   =================================================================== */
function showSectorDoneNotification(sectorIdx, score) {
  const notif = document.getElementById('v2-sector-done-notif');
  const textEl = document.getElementById('v2-sector-done-text');
  if (!notif || !textEl) return;

  const sector = SECTORS[sectorIdx];
  const zone = getZone(score);
  const zoneLabel = zone === 'danger' ? 'слабо' : zone === 'warning' ? 'риск' : 'хорошо';
  textEl.textContent = `${sector.name}: ${score.toFixed(1)}/10 — ${zoneLabel}`;
  notif.classList.add('v2-sector-done--visible');

  setTimeout(() => {
    notif.classList.remove('v2-sector-done--visible');
  }, 2000);
}

/* ===================================================================
   QUIZ EVENTS
   =================================================================== */

// Scale button clicks (event delegation on document)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.v2-scale-btn');
  if (!btn) return;

  const sectorId = btn.dataset.sector;
  const qi = parseInt(btn.dataset.question, 10);
  const value = parseInt(btn.dataset.value, 10);
  const key = `${sectorId}-${qi}`;

  state.answers[key] = value;
  saveProgress();

  // Refresh question display (re-render colors)
  renderQuizLeft(state.currentSector);

  // Immediately check if all questions in sector answered → enable Next
  checkCurrentQuestionAnswered();
  // Attempt to auto-advance to next unanswered question after brief delay
  autoAdvanceQuestion(sectorId, qi, value);
});

// Keyboard on scale buttons
document.addEventListener('keydown', (e) => {
  const btn = e.target.closest('.v2-scale-btn');
  if (!btn) return;

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    btn.click();
    return;
  }

  const group = btn.closest('[role="radiogroup"]');
  if (!group) return;
  const buttons = Array.from(group.querySelectorAll('.v2-scale-btn'));
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

function autoAdvanceQuestion(sectorId, answeredQi, value) {
  const sector = SECTORS[state.currentSector];
  if (sector.id !== sectorId) return;

  const questions = getQuestionsForSector(state.currentSector);
  const nextUnanswered = questions.findIndex((_, qi) => !state.answers[`${sectorId}-${qi}`]);

  if (nextUnanswered !== -1) {
    // advance to next unanswered question after 300ms
    setTimeout(() => {
      renderQuizLeft(state.currentSector);
    }, 300);
  }
}

/* ===================================================================
   NEXT / BACK BUTTONS
   =================================================================== */

document.addEventListener('click', (e) => {
  // Next button
  if (e.target.id === 'v2-btn-next' || e.target.closest('#v2-btn-next')) {
    const btn = document.getElementById('v2-btn-next');
    if (btn && btn.disabled) return;
    handleNextSector();
    return;
  }

  // Back button
  if (e.target.id === 'v2-btn-back' || e.target.closest('#v2-btn-back')) {
    handleBackSector();
    return;
  }
});

function handleNextSector() {
  const avgs = calculateSectorAverages();
  const sectorScore = avgs[state.currentSector];

  if (state.currentSector === 1 && !state.businessType) {
    // After marketing, show business type choice
    showSectorDoneNotification(state.currentSector, sectorScore);
    setTimeout(() => {
      showView('choice');
      renderChoiceRight();
    }, 400);
    return;
  }

  if (state.currentSector < 7) {
    showSectorDoneNotification(state.currentSector, sectorScore);
    const fromSector = state.currentSector;
    state.currentSector++;
    // Small delay for notification visibility
    setTimeout(() => {
      renderQuizLeft(state.currentSector);
      renderQuizRight(state.currentSector);
      // Animate question block in
      const qBlock = document.getElementById('v2-question-block');
      if (qBlock) {
        qBlock.classList.remove('fading-in');
        void qBlock.offsetWidth;
        qBlock.classList.add('fading-in');
      }
    }, 350);
  } else {
    // Last sector — go to contact
    showSectorDoneNotification(state.currentSector, sectorScore);
    state.sectorAverages = calculateSectorAverages();
    setTimeout(() => {
      prepareBlurredWheel();
      showView('contact');
      reachGoal('quiz_complete');
    }, 400);
  }
}

function handleBackSector() {
  if (state.currentSector > 0) {
    state.currentSector--;
    renderQuizLeft(state.currentSector);
    renderQuizRight(state.currentSector);
  }
}

/* ===================================================================
   START TEST
   =================================================================== */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('#v2-btn-start');
  if (!btn) return;
  startTest();
});

function startTest() {
  state.currentSector = 0;
  state.answers = {};
  state.businessType = null;
  localStorage.removeItem('bw_v2_progress');

  showView('quiz');
  renderQuizLeft(0);
  renderQuizRight(0);
  reachGoal('quiz_start');
}

/* ===================================================================
   BUSINESS TYPE CHOICE
   =================================================================== */

function renderChoiceRight() {
  const avgs = calculateSectorAverages();
  drawLiveWheel('v2-choice-wheel', 2, 6, avgs);
  const cap = document.getElementById('v2-choice-wheel-caption');
  if (cap) cap.textContent = 'Заполнено 2 из 8 секторов';
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.v2-choice-card');
  if (!card) return;
  state.businessType = card.dataset.type;
  state.currentSector = 2;
  showView('quiz');
  renderQuizLeft(2);
  renderQuizRight(2);
});

/* ===================================================================
   CONTACT FORM — BLURRED WHEEL + DEBLUR
   =================================================================== */

function prepareBlurredWheel() {
  const avgs = state.sectorAverages.length ? state.sectorAverages : calculateSectorAverages();
  const labels = SECTORS.map(s => s.name);
  drawRadarChart('v2-blurred-wheel', avgs, labels, 130, 110, false, 85);
}

function updateBlurLevel(level) {
  const svgEl = document.getElementById('v2-blurred-wheel');
  if (svgEl) svgEl.style.filter = `blur(${level}px)`;
}

// Setup blur interactivity on the contact form
function setupContactBlur() {
  const nameInput = document.getElementById('v2-field-name');
  const phoneInput = document.getElementById('v2-field-phone');
  const emailInput = document.getElementById('v2-field-email');

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) updateBlurLevel(10);
    });
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (phoneInput.value.trim()) updateBlurLevel(7);
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.value.trim()) updateBlurLevel(4);
    });
  }
}

/* ===================================================================
   CONTACT FORM SUBMIT
   =================================================================== */

function validateContactField(field, errorEl) {
  const value = field.value.trim();
  let errorMsg = '';

  if (field.id === 'v2-field-name') {
    if (!value) errorMsg = 'Введите ваше имя';
  } else if (field.id === 'v2-field-phone') {
    if (!value) errorMsg = 'Введите номер телефона';
    else if (!/^[\d\s+\-()]{7,18}$/.test(value)) errorMsg = 'Введите корректный номер';
  } else if (field.id === 'v2-field-email') {
    if (!value) errorMsg = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = 'Введите корректный email';
  }

  if (errorEl) {
    errorEl.textContent = errorMsg;
  }
  if (errorMsg) {
    field.classList.add('form-input--error');
  } else {
    field.classList.remove('form-input--error');
  }
  return !errorMsg;
}

document.addEventListener('submit', (e) => {
  if (e.target.id !== 'v2-contact-form') return;
  e.preventDefault();

  const nameF  = document.getElementById('v2-field-name');
  const phoneF = document.getElementById('v2-field-phone');
  const emailF = document.getElementById('v2-field-email');

  const nameOk  = validateContactField(nameF,  document.getElementById('v2-error-name'));
  const phoneOk = validateContactField(phoneF, document.getElementById('v2-error-phone'));
  const emailOk = validateContactField(emailF, document.getElementById('v2-error-email'));

  if (nameOk && phoneOk && emailOk) {
    state.contactData = {
      name:  nameF.value.trim(),
      phone: phoneF.value.trim(),
      email: emailF.value.trim()
    };

    state.sectorAverages = calculateSectorAverages();
    sendLeadData();
    reachGoal('contact_submit');
    localStorage.removeItem('bw_v2_progress');

    // Deblur wheel
    updateBlurLevel(0);

    showView('results');
    renderResults();
    prefillDiagnosticPhone();
  }
});

// Blur-based validation
['v2-field-name', 'v2-field-phone', 'v2-field-email'].forEach(id => {
  const field = document.getElementById(id);
  if (!field) return;
  const errorId = 'v2-error-' + id.replace('v2-field-', '');
  field.addEventListener('blur', () => {
    if (field.value.trim()) {
      validateContactField(field, document.getElementById(errorId));
    }
  });
});

/* ===================================================================
   RESULTS
   =================================================================== */

function renderResults() {
  const averages = state.sectorAverages;
  const totalScore = averages.reduce((a, b) => a + b, 0);
  const percent = Math.round((totalScore / 80) * 100);

  // Score
  const scoreEl = document.getElementById('v2-result-score');
  const percentEl = document.getElementById('v2-result-percent');
  if (scoreEl) animateNumber(scoreEl, totalScore, 1);
  if (percentEl) percentEl.textContent = `${percent}%`;

  const zone = getZone(totalScore / 8);
  if (scoreEl)   scoreEl.className   = `v2-score-number score-color--${zone}`;
  if (percentEl) percentEl.className = `v2-score-percent score-color--${zone}`;

  // Status
  let statusTitle, statusDesc;
  if (totalScore >= 60) {
    statusTitle = 'Системный бизнес';
    statusDesc  = 'У вас крепкая основа — процессы выстроены, команда работает. Но даже здесь есть точки роста: устраните оставшиеся провалы, и бизнес выйдет на следующий уровень.';
  } else if (totalScore >= 35) {
    statusTitle = 'Бизнес на ручном управлении';
    statusDesc  = 'Бизнес работает, но держится на вас лично. Вы — и стратег, и операционный директор, и пожарный. Это потолок роста: без системы масштабирование приведёт к хаосу.';
  } else {
    statusTitle = 'Бизнес в режиме выживания';
    statusDesc  = 'Вы тушите пожары каждый день. Процессов нет, ответственность размыта, финансы непрозрачны. Без системного вмешательства ситуация не изменится — только усугубится.';
  }

  const sTitleEl = document.getElementById('v2-status-title');
  const sDescEl  = document.getElementById('v2-status-desc');
  if (sTitleEl) {
    sTitleEl.textContent = statusTitle;
    sTitleEl.className = `v2-status-title score-color--${zone}`;
  }
  if (sDescEl) sDescEl.textContent = statusDesc;

  // Right panel: full wheel
  const labels = SECTORS.map(s => s.name);
  setTimeout(() => {
    drawRadarChart('v2-result-wheel', averages, labels, 190, 155, true, 120);
  }, 0);

  // Scores table with animation delay per row
  renderScoresTable(averages);

  // Weak zones
  renderWeakZones(averages);
}

function renderScoresTable(averages) {
  const tableEl = document.getElementById('v2-scores-table');
  if (!tableEl) return;

  let html = '';
  SECTORS.forEach((sector, idx) => {
    const val = averages[idx];
    const color = getZoneColor(val);
    const barWidth = (val / 10) * 100;
    const delay = 1800 + idx * 150;
    html += `
      <div class="v2-scores-row" style="animation-delay: ${delay}ms">
        <span class="v2-scores-row__name">${sector.name}</span>
        <div class="v2-scores-row__bar-wrap">
          <div class="v2-scores-row__bar" style="width: ${barWidth}%; background: ${color};"></div>
        </div>
        <span class="v2-scores-row__score score-color--${getZone(val)}">${val.toFixed(1)}</span>
      </div>
    `;
  });
  tableEl.innerHTML = html;
}

function renderWeakZones(averages) {
  const weakEl = document.getElementById('v2-weak-cards');
  if (!weakEl) return;

  const indexed = averages.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const belowThreshold = indexed.filter(({ val }) => val < 7);
  const weakest = belowThreshold.length >= 2 ? belowThreshold.slice(0, 2) : indexed.slice(0, 2);

  let html = '';
  weakest.forEach(({ val, idx }) => {
    const sector = SECTORS[idx];
    const zone = getZone(val);
    let descKey = sector.id;
    if (idx === 2 && state.businessType === 'services') descKey = 'production-services';

    const desc = SECTOR_DESCRIPTIONS[descKey]?.[zone];
    if (!desc) return;

    html += `
      <div class="v2-weak-card v2-weak-card--${zone}">
        <div class="v2-weak-card__header">
          <span class="v2-weak-card__score score-color--${zone}">${val.toFixed(1)}</span>
          <span class="v2-weak-card__name">${sector.fullName}</span>
        </div>
        <p class="v2-weak-card__detail"><strong>Что это значит:</strong> ${desc.meaning}</p>
        <p class="v2-weak-card__detail"><strong>К чему приводит:</strong> ${desc.impact}</p>
        <p class="v2-weak-card__detail"><strong>Что делать:</strong> ${desc.action}</p>
      </div>
    `;
  });
  weakEl.innerHTML = html;
}

/* ===================================================================
   DIAGNOSTIC FORM (results)
   =================================================================== */

function prefillDiagnosticPhone() {
  const field = document.getElementById('v2-diag-phone');
  if (field && state.contactData.phone) {
    field.value = state.contactData.phone;
  }
}

// Communication method toggle
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn--method');
  if (!btn) return;
  if (btn.classList.contains('btn--method--selected')) {
    btn.classList.remove('btn--method--selected');
    return;
  }
  document.querySelectorAll('.btn--method').forEach(b => b.classList.remove('btn--method--selected'));
  btn.classList.add('btn--method--selected');
});

// Diagnostic submit
document.addEventListener('click', (e) => {
  if (!e.target.closest('#v2-btn-diagnostic')) return;
  reachGoal('diagnostic_click');

  const phoneField = document.getElementById('v2-diag-phone');
  const phone = phoneField ? phoneField.value.trim() : '';
  if (phone) state.contactData.phone = phone;

  const selectedMethod = document.querySelector('.btn--method--selected');
  const preferredContact = selectedMethod ? selectedMethod.dataset.method : '';

  sendDiagnosticData(preferredContact);

  const form = document.getElementById('v2-diagnostic-form');
  const success = document.getElementById('v2-diagnostic-success');
  if (form) form.hidden = true;
  if (success) success.hidden = false;
});

/* ===================================================================
   SHARE
   =================================================================== */

document.addEventListener('click', (e) => {
  if (!e.target.closest('#v2-btn-share')) return;
  const scores = state.sectorAverages.map(v => v.toFixed(1));
  const btype = state.businessType || 'services';
  const resultUrl = `${SITE_URL}result.html?n=${encodeURIComponent(state.contactData.name || 'Я')}&s=${scores.join(',')}&b=${btype}`;
  const totalScore = state.sectorAverages.reduce((a, b) => a + b, 0);
  const shareText = `Прошёл тест на системность бизнеса. Мой индекс — ${totalScore.toFixed(1)} из 80. А какой у тебя? → ${resultUrl}`;

  reachGoal('share_click');

  navigator.clipboard.writeText(shareText).then(() => {
    const btn = document.getElementById('v2-btn-share');
    const hint = document.getElementById('v2-share-hint');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Скопировано!';
      setTimeout(() => { btn.textContent = orig; }, 3000);
    }
    if (hint) hint.hidden = false;
  }).catch(() => {});
});

/* ===================================================================
   DATA SENDING
   =================================================================== */

function buildLeadPayload() {
  const averages = state.sectorAverages;
  const totalScore = averages.reduce((a, b) => a + b, 0);
  let status;
  if (totalScore >= 60) status = 'Системный бизнес';
  else if (totalScore >= 35) status = 'Бизнес на ручном управлении';
  else status = 'Бизнес в режиме выживания';

  const indexed = averages.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);

  return {
    name: state.contactData.name,
    phone: state.contactData.phone,
    email: state.contactData.email,
    businessType: state.businessType,
    scores: {
      sales:      +averages[0].toFixed(1),
      marketing:  +averages[1].toFixed(1),
      production: +averages[2].toFixed(1),
      finance:    +averages[3].toFixed(1),
      hr:         +averages[4].toFixed(1),
      quality:    +averages[5].toFixed(1),
      management: +averages[6].toFixed(1),
      strategy:   +averages[7].toFixed(1)
    },
    totalScore: +totalScore.toFixed(1),
    status,
    weakZone1: SECTORS[indexed[0].idx].fullName + ' (' + indexed[0].val.toFixed(1) + ')',
    weakZone2: SECTORS[indexed[1].idx].fullName + ' (' + indexed[1].val.toFixed(1) + ')',
    answers: Object.assign({}, state.answers),
    source: 'v2'
  };
}

function sendLeadData() {
  if (!WEBHOOK_URL) return;
  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(buildLeadPayload())
  }).catch(err => {
    console.error('Ошибка отправки лида:', err);
  });
}

function sendDiagnosticData(preferredContact) {
  if (!WEBHOOK_URL) return;
  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'diagnostic_request',
      email: state.contactData.email,
      phone: state.contactData.phone,
      name: state.contactData.name,
      preferredContact,
      source: 'v2'
    })
  }).catch(err => {
    console.error('Ошибка отправки диагностики:', err);
  });
}

/* ===================================================================
   SCORE ANIMATION
   =================================================================== */

function animateNumber(el, target, decimals) {
  const duration = 800;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (eased * target).toFixed(decimals);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }

  requestAnimationFrame(tick);
}

/* ===================================================================
   DEMO / HASH RESTORE
   =================================================================== */

function tryRestoreFromHash() {
  const hash = window.location.hash;
  if (!hash || hash.indexOf('#r=') !== 0) return false;
  try {
    const decoded = atob(hash.slice(3));
    const values = decoded.split(',').map(Number);
    if (values.length !== 8 || values.some(isNaN)) return false;
    state.sectorAverages = values;
    showView('results');
    renderResults();
    prefillDiagnosticPhone();
    return true;
  } catch (e) {
    return false;
  }
}

function tryDemoMode() {
  const params = new URLSearchParams(window.location.search);
  const demo = params.get('demo');
  if (!demo) return false;

  const demoScores = [7, 4, 8, 3, 6, 5, 5, 7];
  state.businessType = 'services';
  state.sectorAverages = demoScores;
  state.contactData = { name: 'Павел', phone: '+7 900 000-00-00', email: 'demo@example.com' };

  if (demo === 'contact') {
    state.sectorAverages = calculateSectorAverages.length ? state.sectorAverages : demoScores;
    prepareBlurredWheel();
    showView('contact');
    return true;
  }
  if (demo === 'results') {
    showView('results');
    renderResults();
    prefillDiagnosticPhone();
    return true;
  }
  return false;
}

/* ===================================================================
   MOBILE ACCORDION (sector description)
   =================================================================== */

function setupAccordion() {
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.v2-sector-accordion');
    if (!toggle) return;
    const body = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!body) return;
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

/* ===================================================================
   INIT
   =================================================================== */

function init() {
  tryRestoreProgress();
  setupAccordion();
  setupContactBlur();

  if (tryDemoMode()) return;
  if (tryRestoreFromHash()) return;

  showView('landing');
  renderLanding();
}

init();
