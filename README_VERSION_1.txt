UTKARSH 5.0 — VERSION 1

Changes from V32:
- Committee is now a completely separate page: committee.html
- Home, Events, Schedule, FAQ and Contact remain on index.html
- All Committee navigation links now open the dedicated Committee page.
- Committee directory still uses committee-config.js + Google Apps Script.
- Student Coordinator / Event Head / Core entries are grouped under Technical & Organizing Leads.
- Faculty Coordinator / HOD / faculty roles are grouped under Faculty Coordinators.
- Google Form button appears at the top and bottom of the dedicated page.

Deployment:
1. Replace the current website files with this version.
2. Keep committee-config.js and paste your deployed Apps Script /exec URL into apiUrl.
3. Push to GitHub; Vercel will deploy automatically.
4. Open /committee.html directly and test the directory.


VERSION 2 UPDATE: Committee is a standalone page and the Committee Management panel has been removed. If the directory shows HTTP 404, the frontend is working but the Google Apps Script deployment URL in committee-config.js must be replaced with the current deployed /exec URL.
