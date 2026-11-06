const SPREADSHEET_TITLE = 'Work with Deb | Client Inquiries';
const SHEET_TAB_NAME = 'Inquiries';
const NOTIFICATION_EMAIL = 'ezinneifegwu@gmail.com';
const HEADERS = [
  'Submitted At',
  'Full Name',
  'Email',
  'Company',
  'Website',
  'Role',
  'Business Description',
  'Support Areas',
  'Main Challenge',
  'Desired Outcome',
  'Timeline',
  'Attachment Name',
  'Attachment Size'
];

/**
 * Run setup() once from the Apps Script editor.
 * It creates the spreadsheet, saves its ID, and emails you the link.
 */
function setup() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty('INQUIRIES_SPREADSHEET_ID');
  let spreadsheet;

  if (spreadsheetId) {
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      spreadsheet = null;
    }
  }

  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.create(SPREADSHEET_TITLE);
    properties.setProperty('INQUIRIES_SPREADSHEET_ID', spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName(SHEET_TAB_NAME);
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
    sheet.setName(SHEET_TAB_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: 'Your Work with Deb inquiry sheet is ready',
    body: 'Your inquiry spreadsheet has been created. Open it here: ' + spreadsheet.getUrl()
  });

  return spreadsheet.getUrl();
}

/** Health check: opening the deployed URL should return this message. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'Work with Deb inquiry form' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Receives website form submissions and writes them to the spreadsheet. */
function doPost(event) {
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 50000) {
      return jsonResponse({ ok: false, error: 'Invalid request' });
    }

    const data = JSON.parse(raw);
    const name = String(data.fullName || '').trim();
    const email = String(data.email || '').trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, error: 'A name and valid email are required' });
    }

    const spreadsheetId = PropertiesService.getScriptProperties()
      .getProperty('INQUIRIES_SPREADSHEET_ID');
    if (!spreadsheetId) {
      throw new Error('Run setup() in Apps Script before receiving submissions.');
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(SHEET_TAB_NAME);
    if (!sheet) {
      throw new Error('The Inquiries tab is missing. Run setup() again.');
    }

    const submittedAt = data.submittedAt || new Date().toISOString();
    const supportAreas = Array.isArray(data.supportAreas)
      ? data.supportAreas.join(', ')
      : String(data.supportAreas || '');

    sheet.appendRow([
      submittedAt,
      name,
      email,
      data.companyName || '',
      data.website || '',
      data.role || '',
      data.businessDescription || '',
      supportAreas,
      data.mainChallenge || '',
      data.desiredOutcome || '',
      data.timeline || '',
      data.fileName || '',
      data.fileSize || ''
    ]);

    const plainBody = [
      'A new Work with Deb inquiry has arrived.',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Company: ' + (data.companyName || ''),
      'Website: ' + (data.website || ''),
      'Role: ' + (data.role || ''),
      'Support areas: ' + supportAreas,
      'Business description: ' + (data.businessDescription || ''),
      'Main challenge: ' + (data.mainChallenge || ''),
      'Desired outcome: ' + (data.desiredOutcome || ''),
      'Timeline: ' + (data.timeline || ''),
      'Submitted: ' + submittedAt,
      '',
      'Open the inquiry sheet: ' + spreadsheet.getUrl()
    ].join('\n');

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: 'New Work with Deb inquiry from ' + name,
      body: plainBody,
      replyTo: email
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
