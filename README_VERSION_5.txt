UTKARSH 5.0 — VERSION 5

Committee is a separate page. This version fixes the Google Forms photo problem by reading Form responses directly with FormApp and retrieving File Upload IDs with DriveApp.

1. Open committee-apps-script.gs.
2. Paste it into Apps Script.
3. Run testCommitteeConnection() once and authorize Forms + Drive access.
4. Deploy as Web app, Execute as Me, access appropriate public/anonymous setting.
5. Copy the /exec URL into committee-config.js apiUrl.
6. Deploy the website to Vercel.

The form is: https://docs.google.com/forms/d/15uMtV-OKJ5gdSWv1kqZvIdmpG7nh0VcLXu4wG4DzHTg/viewform
