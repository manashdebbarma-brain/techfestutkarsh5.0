UTKARSH 5.0 — V30

CHANGES
- Rebalanced the realistic architectural floating-page navigation so the central building is unobstructed.
- Six page cards are arranged around the building: Foundation/Home, RCC Frame/Events, Slab/Schedule, Structural Frame/Committee, Finishing/FAQ, Site Office/Contact.
- Venue remains removed.
- Added notice-config.js so the Public Notice can be edited without touching the main HTML.

PUBLIC NOTICE EDITING
1. Open notice-config.js.
2. Edit label, title, and message.
3. Save.
4. Deploy/redeploy to Vercel.

Example:
const PUBLIC_NOTICE = {
  label: "PUBLIC NOTICE",
  title: "Registration opens 1 October.",
  message: "Register through the official registration form before the deadline."
};

No Google Form or Apps Script change is required for the notice.
