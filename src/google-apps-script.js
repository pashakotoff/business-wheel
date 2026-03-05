/**
 * Google Apps Script — Приём лидов из теста "Колесо Баланса"
 * Business Commandos
 *
 * ШАГ 1 — ПОДКЛЮЧЕНИЕ К GOOGLE ТАБЛИЦЕ:
 * 1. Создайте новую Google Таблицу
 * 2. Меню → Расширения → Apps Script
 * 3. Вставьте этот код вместо содержимого Code.gs
 * 4. Нажмите "Сохранить" (Ctrl+S)
 * 5. Нажмите "Развернуть" → "Новое развёртывание"
 * 6. Тип: "Веб-приложение"
 * 7. Выполнять от: "Я" (ваш аккаунт)
 * 8. Доступ: "Все" (для приёма данных с сайта)
 * 9. Скопируйте URL развёртывания и вставьте в WEBHOOK_URL в файле main.js на сайте
 *
 * ШАГ 2 — НАСТРОЙКА TELEGRAM-ОПОВЕЩЕНИЙ:
 * 1. Создайте нового бота через @BotFather в Telegram (команда /newbot)
 * 2. Скопируйте полученный токен и вставьте ниже в TELEGRAM_BOT_TOKEN
 * 3. Добавьте бота в нужные группы / чаты, куда хотите получать уведомления
 * 4. Напишите боту любое сообщение (или отправьте что-нибудь в группу с ботом)
 * 5. В редакторе Apps Script выберите функцию discoverAndSaveChats и нажмите "Выполнить"
 *    → Бот найдёт все чаты и запомнит их. Смотрите результат в "Журнале выполнения"
 * 6. Готово — при каждом новом лиде уведомление придёт во все эти чаты
 *
 * Если добавили бота в новый чат — повторите пункты 4–5.
 */

// Название листа в таблице
var SHEET_NAME = 'Лиды';

// Telegram Bot Token — вставьте свой токен
var TELEGRAM_BOT_TOKEN = 'ВСТАВЬТЕ_ТОКЕН_СЮДА';

// Обработка POST-запросов с сайта
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    // Запрос на диагностику — обновляем существующую строку
    if (data.action === 'diagnostic_request') {
      return handleDiagnosticRequest(sheet, data);
    }

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
      data.weakZone2 || '',
      '', // Хочет диагностику (заполняется позже)
      ''  // Способ связи (заполняется позже)
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

    // Telegram-уведомление о новом лиде
    try {
      var totalScore = data.totalScore || 0;
      var maxScore = 80;
      var percent = Math.round(totalScore / maxScore * 100);
      var businessTypeLabel = data.businessType === 'goods' ? 'Товары' : 'Услуги';

      var weakZones = [];
      if (data.weakZone1) weakZones.push(data.weakZone1);
      if (data.weakZone2) weakZones.push(data.weakZone2);

      var msg = '🔔 *Новый лид — Колесо Баланса*\n\n'
        + '👤 *' + (data.name || 'Без имени') + '*\n'
        + '📞 ' + (data.phone || '—') + '\n'
        + '📧 ' + (data.email || '—') + '\n'
        + '🏢 ' + businessTypeLabel + '\n\n'
        + '📊 Результат: *' + totalScore + '/' + maxScore + '* (' + percent + '%)\n'
        + '📋 Статус: ' + (data.status || '—') + '\n';

      if (weakZones.length > 0) {
        msg += '⚠️ Слабые зоны: ' + weakZones.join(', ') + '\n';
      }

      sendTelegramToAll(msg);
    } catch (tgError) {
      // Не прерываем основной поток если Telegram недоступен
      Logger.log('Telegram error: ' + tgError.toString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Обработка заявки на диагностику — находим строку по email и обновляем
function handleDiagnosticRequest(sheet, data) {
  var contactMethods = { telegram: 'Telegram', whatsapp: 'WhatsApp', phone: 'Телефон' };
  var email = data.email || '';
  var phone = data.phone || '';
  var method = contactMethods[data.preferredContact] || data.preferredContact || '';

  // Ищем строку по email (колонка D = индекс 4, 1-based)
  var allData = sheet.getDataRange().getValues();
  var targetRow = -1;

  // Ищем с конца — берём самую свежую запись
  for (var i = allData.length - 1; i >= 1; i--) {
    if (allData[i][3] === email) {
      targetRow = i + 1; // Переводим в 1-based
      break;
    }
  }

  if (targetRow > 0) {
    // Обновляем колонки: Хочет диагностику (18), Способ связи (19)
    sheet.getRange(targetRow, 18).setValue('Да');
    sheet.getRange(targetRow, 19).setValue(method);

    // Обновляем телефон если изменился
    if (phone && phone !== allData[targetRow - 1][2]) {
      sheet.getRange(targetRow, 3).setValue(phone);
    }

    // Подсветка — зелёный фон для диагностики
    sheet.getRange(targetRow, 18).setBackground('#DCFCE7').setFontColor('#16A34A').setFontWeight('bold');
    sheet.getRange(targetRow, 19).setBackground('#DBEAFE').setFontColor('#2563EB');
  }

  // Telegram-уведомление о заявке на диагностику
  try {
    var name = targetRow > 0 ? allData[targetRow - 1][1] : (data.name || '—');
    var msg = '🎯 *Заявка на диагностику!*\n\n'
      + '👤 *' + name + '*\n'
      + '📞 ' + (phone || '—') + '\n'
      + '📧 ' + (email || '—') + '\n'
      + '💬 Способ связи: *' + (method || '—') + '*';

    sendTelegramToAll(msg);
  } catch (tgError) {
    Logger.log('Telegram error: ' + tgError.toString());
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Удалить личный чат из списка рассылки — запусти один раз
function removePersonalChat() {
  var props = PropertiesService.getScriptProperties();
  var stored = props.getProperty('tg_chat_ids');
  if (!stored) return;
  var knownIds = JSON.parse(stored);
  delete knownIds['38502817'];
  props.setProperty('tg_chat_ids', JSON.stringify(knownIds));
  Logger.log('Остались чаты: ' + JSON.stringify(knownIds));
}

// ДИАГНОСТИКА — запусти один раз, потом удали
function debugTelegram() {
  var webhookUrl = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/getWebhookInfo';
  var updatesUrl = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/getUpdates?limit=5';

  var webhook = JSON.parse(UrlFetchApp.fetch(webhookUrl, { muteHttpExceptions: true }).getContentText());
  var updates = JSON.parse(UrlFetchApp.fetch(updatesUrl, { muteHttpExceptions: true }).getContentText());

  Logger.log('Webhook: ' + JSON.stringify(webhook));
  Logger.log('Updates: ' + JSON.stringify(updates));
}

/**
 * Находит все чаты/группы где есть бот через getUpdates,
 * сохраняет chat_id в PropertiesService (персистентно между запусками).
 * Запускайте вручную из редактора Apps Script после добавления бота в новый чат.
 */
function discoverAndSaveChats() {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'ВСТАВЬТЕ_ТОКЕН_СЮДА') return;

  var props = PropertiesService.getScriptProperties();
  var stored = props.getProperty('tg_chat_ids');
  var knownIds = stored ? JSON.parse(stored) : {};

  // getUpdates — последние 100 обновлений
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/getUpdates?limit=100';
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var result = JSON.parse(response.getContentText());

  if (!result.ok) return;

  result.result.forEach(function(update) {
    var chatId = null;
    var chatTitle = '';

    if (update.message && update.message.chat) {
      chatId = update.message.chat.id;
      chatTitle = update.message.chat.title || update.message.chat.first_name || String(chatId);
    } else if (update.my_chat_member && update.my_chat_member.chat) {
      chatId = update.my_chat_member.chat.id;
      chatTitle = update.my_chat_member.chat.title || String(chatId);
    }

    if (chatId) {
      knownIds[String(chatId)] = chatTitle;
    }
  });

  props.setProperty('tg_chat_ids', JSON.stringify(knownIds));
  Logger.log('Telegram chats saved: ' + JSON.stringify(knownIds));
}

/**
 * Отправляет сообщение во все сохранённые чаты/группы.
 */
function sendTelegramToAll(text) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'ВСТАВЬТЕ_ТОКЕН_СЮДА') return;

  var props = PropertiesService.getScriptProperties();
  var stored = props.getProperty('tg_chat_ids');
  if (!stored) return;

  var knownIds = JSON.parse(stored);
  var chatIds = Object.keys(knownIds);
  if (chatIds.length === 0) return;

  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';

  chatIds.forEach(function(chatId) {
    var payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    };
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  });
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
      'Хочет диагностику',
      'Способ связи',
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
    sheet.setColumnWidth(18, 140); // Хочет диагностику
    sheet.setColumnWidth(19, 140); // Способ связи
    for (var j = 20; j <= 51; j++) {
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
