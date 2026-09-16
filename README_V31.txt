UTKARSH 5.0 — V31

WHAT'S NEW
1. Added editable schedule-config.js. Change schedule dates, times, activities and venues there.
2. Added docs/SCHEDULE_EDIT_GUIDE.md.
3. Reworked Committee Apps Script for BOTH student and faculty coordinators.
4. New responses publish automatically unless Approved/Status explicitly says NO, DRAFT, PRIVATE or REJECTED.
5. Added Coordinator Type / Member Type support.
6. Improved Google Forms photo-upload parsing and Drive thumbnail delivery.
7. LinkedIn, GitHub and Instagram remain independent optional fields.
8. Updated Committee grouping so Event Head/Core go to Technical & Organizing Leads and Faculty Coordinator goes to Faculty Coordinators.
9. Committee cards now use the site's dark amber Civil Engineering theme.
10. Committee form link now uses the responder /viewform URL rather than the editor/publisher URL.

DEPLOY CHECKLIST
A. Google Form: publish the form and copy the responder URL ending in /viewform.
B. Form fields: Coordinator Name, Coordinator Type, Role, Department, Year, Phone, Email Address, Photo (File upload), LinkedIn, GitHub, Instagram, Event, Approved/Status (optional).
C. Apps Script: paste committee-apps-script.gs, save, run testCommitteeConnection once, authorize Drive/Sheets access, then Deploy > New deployment > Web app.
D. Web app: Execute as the deploying owner (Me). For a public Vercel site, allow anonymous/public access as appropriate to your Google account/domain policy.
E. Paste the /exec URL into committee-config.js apiUrl.
F. Schedule: edit schedule-config.js; commit/push to GitHub; Vercel redeploys.
