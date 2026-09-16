// =====================================================
// PUBLIC NOTICE — EDIT THIS FILE TO UPDATE THE NOTICE
// =====================================================
// Change the text below, save, and redeploy to Vercel.
// No Google Form or Apps Script change is required.

const PUBLIC_NOTICE = {
  label: "PUBLIC NOTICE",
  title: "The portal is preparing for launch.",
  message: "Official rulebooks, venue allocations, registration instructions, and committee names will be published only after confirmation."
};

document.addEventListener("DOMContentLoaded", () => {
  const label = document.getElementById("notice-label");
  const title = document.getElementById("notice-title");
  const message = document.getElementById("notice-message");
  if (label) label.textContent = PUBLIC_NOTICE.label;
  if (title) title.textContent = PUBLIC_NOTICE.title;
  if (message) message.textContent = PUBLIC_NOTICE.message;
});
