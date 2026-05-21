function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('Scacchi con Stockfish - Web App')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ── SHEET HELPERS ──

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Partite');
  if (!sheet) {
    sheet = ss.insertSheet('Partite');
    sheet.appendRow(['ID', 'Nome', 'Data', 'PGN', 'Risultato', 'FEN_Iniziale']);
    sheet.getRange('1:1').setFontWeight('bold');
  }
  return sheet;
}

function generateId_() {
  return Utilities.getUuid().substring(0, 8);
}

// ── PUBLIC API (chiamate dal client) ──

function saveGame(name, pgn, result, startFen) {
  var sheet = getOrCreateSheet_();
  var id = generateId_();
  var data = new Date();
  var dataStr = Utilities.formatDate(data, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
  sheet.appendRow([id, name || 'Senza nome', dataStr, pgn, result || '*', startFen || 'startpos']);
  return { success: true, id: id, message: 'Partita salvata!' };
}

function listGames() {
  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var games = data.map(function(row) {
    return {
      id: row[0],
      name: row[1],
      date: row[2],
      pgn: row[3],
      result: row[4],
      startFen: row[5]
    };
  });
  // Più recenti prima
  games.reverse();
  return games;
}

function loadGame(id) {
  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === id) {
      return {
        id: data[i][0],
        name: data[i][1],
        date: data[i][2],
        pgn: data[i][3],
        result: data[i][4],
        startFen: data[i][5]
      };
    }
  }
  return null;
}

function deleteGame(id) {
  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return { success: false, message: 'Nessuna partita trovata.' };

  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 2);
      return { success: true, message: 'Partita eliminata.' };
    }
  }
  return { success: false, message: 'ID non trovato.' };
}
