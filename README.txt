UTKARSH 5.0 — Committee Page
================================

This committee.html is ready for the Vercel site and uses the Committee Apps
Script endpoint supplied in the project.

IMPORTANT: the Apps Script endpoint must support JSONP for cross-origin loading
from Vercel. In doGet(e), replace the committee API branch with:

if (params.api === "committee") {
  const members = getCommitteeMembers();
  const payload = {
    ok: true,
    count: members.length,
    members: members
  };

  if (params.callback) {
    return ContentService
      .createTextOutput(
        params.callback + "(" + JSON.stringify(payload) + ");"
      )
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

The page supports:
- Approved members only
- Role/event filters
- Google Drive photo URLs
- Responsive cards
- Initials fallback when a photo fails
- Automatic updates from the Google Form without editing committee.html

After adding the JSONP branch, create a new Web App deployment/version and keep
the same /exec URL if possible.
