UTKARSH 5.0 — VERSION 10: DIGITAL CERTIFICATION PORTAL

Added a separate certificates.html page with:
- Public certificate registry
- Search by name/team/event/certificate ID/role
- Winner / Participant / Appreciation filters
- Certificate preview modal
- Print / Save as PDF workflow
- Certificate ID verification
- URL-based verification: certificates.html?verify=CERTIFICATE_ID
- Time-bound authority approval prototype
- Authority console prototype
- Issued / Approved / Pending counters
- Production roadmap for backend, audit, QR and digital signing

Important:
This version is a FRONTEND PROTOTYPE. The approval deadline is demonstrated in JavaScript only.
For production, authentication, authorization, server-side deadline enforcement, database records,
audit logs and actual digital signing/eSign must be implemented on a secure backend.

Data file:
certificate-config.js
Replace sample records with a Google Sheet/API/database source when ready.

Navigation:
Home → Certificates
Committee → Certificates

No existing event, schedule or committee functionality was intentionally removed.
