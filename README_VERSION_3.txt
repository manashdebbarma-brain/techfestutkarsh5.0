UTKARSH 5.0 — VERSION 3

Committee photo fix + clean standalone Committee page.

CHANGES
- Committee remains a separate committee.html page.
- Removed the Committee Management section and its bottom management buttons.
- Improved Google Forms photo handling.
- Apps Script now reads Google Sheets rich-text hyperlinks in the photo cell, not only displayed filenames.
- It also extracts Drive file IDs from the hyperlink and converts accessible Drive images into browser-safe data URLs.
- Existing filename/Drive-ID fallbacks remain.
- Committee photo images load eagerly for more reliable display.

IMPORTANT
Replace the deployed Apps Script code with committee-apps-script-V3.gs, save it, authorize Drive access if prompted, then create a new Web App deployment or update the existing deployment and use its /exec URL in committee-config.js.

If your Google Form uses a File upload question, keep the uploaded files accessible to the Google account that owns/runs the Apps Script.
