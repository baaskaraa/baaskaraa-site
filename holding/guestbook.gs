/* baaskaraa guest book · Google Apps Script
   Paste into the Sheet's Extensions → Apps Script, then Deploy → New deployment → Web app
   (Execute as: Me · Who has access: Anyone). Copy the /exec URL into holding.js (ENDPOINT).
   b with me */
var NOTIFY = 'studio@baaskaraa.com';

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p._gotcha) return ContentService.createTextOutput('ok');          // spam trap
  var name = String(p.name || '').slice(0, 200);
  var email = String(p.email || '').slice(0, 200);
  var word = String(p.message || '').slice(0, 2000);
  if (!name || !email) return ContentService.createTextOutput('missing');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(['Signed', 'Name', 'Email', 'A word for the studio', 'Language']);
  sheet.appendRow([new Date(), name, email, word, p.lang || 'en']);
  MailApp.sendEmail({
    to: NOTIFY,
    replyTo: email,
    subject: 'Guest book · ' + name + ' signed',
    body: name + ' (' + email + ') signed the baaskaraa guest book.\n\n' + (word || '(no word)') + '\n\nLanguage: ' + (p.lang || 'en')
  });
  return ContentService.createTextOutput('ok');
}

function doGet() { return ContentService.createTextOutput('baaskaraa guest book is listening. b with me'); }
