/**
 * Google Apps Script — Приём лидов из теста "Колесо Баланса"
 * Business Commandos
 *
 * ИНСТРУКЦИЯ:
 * 1. Создайте новую Google Таблицу
 * 2. Меню → Расширения → Apps Script
 * 3. Вставьте этот код вместо содержимого Code.gs
 * 4. Нажмите "Развернуть" → "Новое развёртывание"
 * 5. Тип: "Веб-приложение"
 * 6. Выполнять от: "Я" (ваш аккаунт)
 * 7. Доступ: "Все" (для приёма данных с сайта)
 * 8. Скопируйте URL и вставьте в WEBHOOK_URL на сайте
 */

// Название листа в таблице
var SHEET_NAME = 'Лиды';

// Обработка POST-запросов с сайта
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    var row = [
      new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.businessType === 'goods' ? 'Товары' : 'Услуги',
      data.scores.sales || 0,
      data.scores.marketing || 0,
      data.scores.production || 0,
      data.scores.finance || 0,
      data.scores.hr || 0,
      data.scores.quality || 0,
      data.scores.management || 0,
      data.scores.strategy || 0,
      data.totalScore || 0,
      data.status || '',
      data.weakZone1 || '',
      data.weakZone2 || ''
    ];

    // Добавляем все 32 ответа на вопросы (по 4 на сектор)
    var sectors = ['sales', 'marketing', 'production', 'finance', 'hr', 'quality', 'management', 'strategy'];
    var answers = data.answers || {};
    for (var s = 0; s < sectors.length; s++) {
      for (var q = 0; q < 4; q++) {
        var key = sectors[s] + '-' + q;
        row.push(answers[key] || 0);
      }
    }

    sheet.appendRow(row);

    // Автоформатирование последней строки
    var lastRow = sheet.getLastRow();
    formatRow(sheet, lastRow, data.totalScore / 8);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Создать лист с заголовками если его нет
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    var headers = [
      'Дата',
      'Имя',
      'Телефон',
      'Email',
      'Тип бизнеса',
      'Продажи',
      'Маркетинг',
      'Производство',
      'Финансы',
      'Кадры',
      'Качество',
      'Управление',
      'Стратегия',
      'Общий балл',
      'Статус',
      'Слабая зона 1',
      'Слабая зона 2',
      // Продажи (4 вопроса)
      'Продажи: Есть CRM, менеджеры вносят все данные',
      'Продажи: Конверсия на каждом этапе воронки измеряется',
      'Продажи: Есть скрипты и тренировки по возражениям',
      'Продажи: Выручка прогнозируемая',
      // Маркетинг (4 вопроса)
      'Маркетинг: Есть руководитель маркетинга',
      'Маркетинг: Разработана маркетинговая стратегия',
      'Маркетинг: Есть дашборд — CPL, конверсии, ROI',
      'Маркетинг: Стабильный поток лидов с известной стоимостью',
      // Производство (4 вопроса)
      'Производство: Сроки соблюдаются, себестоимость известна',
      'Производство: Складской учёт / контроль качества услуг',
      'Производство: Контроль качества / проектное управление',
      'Производство: Сильный начальник / довольные клиенты',
      // Финансы (4 вопроса)
      'Финансы: Знает чистую прибыль, разделяет личное и бизнес',
      'Финансы: Управленческая отчётность ДДС, P&L, баланс',
      'Финансы: Финансовое планирование на 2-3 месяца',
      'Финансы: Знает остатки, дебиторку, кредиторку',
      // Кадры (4 вопроса)
      'Кадры: Описаны воронки найма для ключевых должностей',
      'Кадры: Адаптация расписана, без участия собственника',
      'Кадры: Замена ключевого сотрудника за 2-3 недели',
      'Кадры: Есть должностные инструкции с метриками',
      // Качество (4 вопроса)
      'Качество: Есть ответственный за контроль качества',
      'Качество: Звонки прослушиваются, CRM проверяется',
      'Качество: Руководители получают отчёты о нарушениях',
      'Качество: Проактивный контроль до жалоб клиента',
      // Управление (4 вопроса)
      'Управление: Регулярные планёрки с задачами и цифрами',
      'Управление: Понятные зоны ответственности у каждого',
      'Управление: Задачи фиксируются в системе управления',
      'Управление: Бизнес работает без постоянного участия собственника',
      // Стратегия (4 вопроса)
      'Стратегия: Чёткие цели на год, квартальные планы',
      'Стратегия: Система целеполагания OKR/KPI',
      'Стратегия: Знает бизнес-модель и unit-экономику',
      'Стратегия: Регулярные стратегические сессии'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Стилизация заголовков
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1A1D23');
    headerRange.setFontColor('#F59E0B');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');

    // Ширина колонок
    sheet.setColumnWidth(1, 160);  // Дата
    sheet.setColumnWidth(2, 140);  // Имя
    sheet.setColumnWidth(3, 160);  // Телефон
    sheet.setColumnWidth(4, 220);  // Email
    sheet.setColumnWidth(5, 120);  // Тип бизнеса
    for (var i = 6; i <= 13; i++) {
      sheet.setColumnWidth(i, 100); // Секторы
    }
    sheet.setColumnWidth(14, 100); // Общий балл
    sheet.setColumnWidth(15, 200); // Статус
    sheet.setColumnWidth(16, 180); // Слабая зона 1
    sheet.setColumnWidth(17, 180); // Слабая зона 2
    for (var j = 18; j <= 49; j++) {
      sheet.setColumnWidth(j, 200); // Ответы на вопросы
    }

    // Закрепить заголовки
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// Цветовая индикация для строки
function formatRow(sheet, row, avgScore) {
  var scoreRange = sheet.getRange(row, 6, 1, 8); // Секторы
  var values = scoreRange.getValues()[0];

  // Раскраска каждого сектора
  for (var i = 0; i < values.length; i++) {
    var cell = sheet.getRange(row, 6 + i);
    var val = values[i];
    if (val <= 4) {
      cell.setBackground('#FEE2E2'); // Красный фон
      cell.setFontColor('#DC2626');
    } else if (val <= 7) {
      cell.setBackground('#FEF9C3'); // Жёлтый фон
      cell.setFontColor('#CA8A04');
    } else {
      cell.setBackground('#DCFCE7'); // Зелёный фон
      cell.setFontColor('#16A34A');
    }
  }

  // Общий балл
  var totalCell = sheet.getRange(row, 14);
  if (avgScore <= 4) {
    totalCell.setBackground('#FEE2E2');
    totalCell.setFontColor('#DC2626');
  } else if (avgScore <= 7) {
    totalCell.setBackground('#FEF9C3');
    totalCell.setFontColor('#CA8A04');
  } else {
    totalCell.setBackground('#DCFCE7');
    totalCell.setFontColor('#16A34A');
  }
  totalCell.setFontWeight('bold');
}

// Тестовый GET для проверки работоспособности
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Webhook Business Commandos активен' }))
    .setMimeType(ContentService.MimeType.JSON);
}
