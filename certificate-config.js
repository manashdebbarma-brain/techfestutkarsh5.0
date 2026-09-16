/*
 * UTKARSH 5.0 DIGITAL CERTIFICATION — FRONTEND PROTOTYPE
 *
 * Replace this sample dataset with your Google Sheet / database API in the
 * production version. The approval window is enforced here for demonstration;
 * production enforcement must happen on the server/backend as well.
 */
const CERTIFICATE_CONFIG = {
  portalTitle: 'UTKARSH 5.0 DIGITAL CREDENTIALS',
  approvalWindow: {
    startsAt: '2026-09-17T09:00:00+05:30',
    endsAt: '2026-09-22T23:59:00+05:30'
  },
  authority: 'UTKARSH 5.0 Certification Authority',
  verificationBase: 'certificates.html?verify=',
  records: [
    {
      id: 'UTKARSH5-26-WIN-001', name: 'Sourav Pal', team: 'TriNetra', event: 'Bridge Busting',
      category: 'Winner', certificateType: 'Winner Certificate', status: 'ISSUED', members: 5,
      issueDate: '22 September 2026', approvedBy: 'Faculty Certification Authority', role: 'Team Leader',
      citation: 'For outstanding performance in Bridge Busting during UTKARSH 5.0.'
    },
    {
      id: 'UTKARSH5-26-WIN-002', name: 'Soubik Roy', team: 'Chill Tech', event: 'Bridge Busting',
      category: 'Winner', certificateType: 'Winner Certificate', status: 'ISSUED', members: 4,
      issueDate: '22 September 2026', approvedBy: 'Faculty Certification Authority', role: 'Team Leader',
      citation: 'For outstanding performance in the Hardware Edition of UTKARSH 5.0.'
    },
    {
      id: 'UTKARSH5-26-PAR-003', name: 'Demo Participant', team: 'TriNetra', event: 'AutoCAD',
      category: 'Participant', certificateType: 'Participant Certificate', status: 'APPROVED', members: 5,
      issueDate: '22 September 2026', approvedBy: 'Pending issue batch', role: 'Participant',
      citation: 'For active participation in UTKARSH 5.0.'
    },
    {
      id: 'UTKARSH5-26-APP-004', name: 'Demo Coordinator', team: 'Organising Team', event: 'UTKARSH 5.0',
      category: 'Appreciation', certificateType: 'Certificate of Appreciation', status: 'PENDING', members: 1,
      issueDate: '', approvedBy: '', role: 'Event Coordinator',
      citation: 'For valuable contribution to the planning and execution of UTKARSH 5.0.'
    }
  ]
};
