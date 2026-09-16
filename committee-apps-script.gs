/*
 * UTKARSH 5.0 — COMMITTEE DIRECTORY API V5
 * Google Form -> Form responses -> Drive photo -> Vercel Committee page.
 *
 * This version intentionally reads the FORM RESPONSES directly instead of
 * trying to guess the photo URL stored in the response Sheet. Google Forms
 * File Upload answers provide real Drive file IDs to Apps Script, so photos
 * can be read with DriveApp and returned as small data URLs.
 */

const FORM_ID = '15uMtV-OKJ5gdSWv1kqZvIdmpG7nh0VcLXu4wG4DzHTg';

function doGet() {
  try {
    const form = FormApp.openById(FORM_ID);
    const responses = form.getResponses();
    const data = responses.map(buildPerson_).filter(p => p.name && isPublic_(p.approved));
    data.sort((a,b) => String(a.name).localeCompare(String(b.name)));
    return json_({
      ok: true,
      updatedAt: new Date().toISOString(),
      data: data,
      diagnostics: {formId: FORM_ID, responseCount: responses.length}
    });
  } catch (error) {
    return json_({ok:false, error:String(error && error.message || error), data:[]});
  }
}

function buildPerson_(formResponse) {
  const answers = {};
  const photoIds = [];
  const itemResponses = formResponse.getItemResponses();

  itemResponses.forEach(ir => {
    const item = ir.getItem();
    const title = normalize_(item.getTitle());
    let value = ir.getResponse();

    if (item.getType() === FormApp.ItemType.FILE_UPLOAD) {
      const ids = Array.isArray(value) ? value : [value];
      ids.filter(Boolean).forEach(id => photoIds.push(String(id)));
      answers[title] = ids.filter(Boolean).join(', ');
    } else if (Array.isArray(value)) {
      answers[title] = value.join(', ');
    } else {
      answers[title] = String(value == null ? '' : value).trim();
    }
  });

  const get = (...titles) => {
    for (const title of titles) {
      const key = normalize_(title);
      if (answers[key]) return answers[key];
    }
    return '';
  };

  let photo = '';
  for (const id of [...new Set(photoIds)]) {
    photo = driveImageAsDataUrl_(id);
    if (photo) break;
  }

  return {
    name: get('Coordinator Name', 'Name'),
    type: get('Coordinator Type', 'Member Type', 'Category', 'Type'),
    role: get('Role'),
    event: get('Event'),
    department: get('Department', 'Department / Branch', 'Branch') || 'Department of Civil Engineering',
    year: get('Year', 'Academic Year', 'Year of Study'),
    phone: get('Phone Number', 'Phone', 'Mobile', 'Mobile Number'),
    email: get('Email Address', 'Email', 'Email ID'),
    photo: photo,
    approved: get('Approved', 'Approval', 'Publish', 'Published', 'Status', 'Visibility'),
    linkedin: get('LinkedIn', 'LinkedIn URL'),
    github: get('GitHub', 'GitHub URL'),
    instagram: get('Instagram', 'Instagram URL'),
    responseTime: formResponse.getTimestamp().toISOString()
  };
}

function isPublic_(value) {
  const v = normalize_(value);
  if (!v) return true;
  return !['no','false','rejected','draft','private','hidden','do not publish','do not display'].includes(v);
}

function normalize_(value) {
  return String(value || '').trim().toLowerCase()
    .replace(/[\u2013\u2014]/g,'-')
    .replace(/\s+/g,' ');
}

function driveImageAsDataUrl_(id) {
  try {
    const file = DriveApp.getFileById(String(id));
    const mime = String(file.getMimeType() || '').toLowerCase();
    if (!/^image\//.test(mime)) return '';

    // Small thumbnail keeps the public JSON response fast.
    const thumb = file.getThumbnail();
    if (thumb) {
      const thumbMime = String(thumb.getContentType() || 'image/png');
      return 'data:' + thumbMime + ';base64,' + Utilities.base64Encode(thumb.getBytes());
    }

    const blob = file.getBlob();
    return 'data:' + mime + ';base64,' + Utilities.base64Encode(blob.getBytes());
  } catch (err) {
    return '';
  }
}

function testCommitteeConnection() {
  const result = doGet().getContent();
  Logger.log(result);
  return result;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
