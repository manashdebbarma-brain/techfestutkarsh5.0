(function(){
  const cfg = window.CERTIFICATE_CONFIG || CERTIFICATE_CONFIG;
  const records = Array.isArray(cfg.records) ? cfg.records : [];
  const list = document.getElementById('certificateList');
  const empty = document.getElementById('certificateEmpty');
  const search = document.getElementById('certSearch');
  const clearSearch = document.getElementById('clearCertSearch');
  const verifyInput = document.getElementById('verifyInput');
  const verifyButton = document.getElementById('verifyButton');
  const verifyResult = document.getElementById('verifyResult');
  const modal = document.getElementById('certificateModal');
  const preview = document.getElementById('certificatePreview');
  const authorityPanel = document.getElementById('authorityPanel');
  const authorityList = document.getElementById('authorityList');
  const approvalClock = document.getElementById('approvalClock');
  const windowStatus = document.getElementById('windowStatus');
  const windowMessage = document.getElementById('windowMessage');
  const authorityWindowText = document.getElementById('authorityWindowText');
  const authorityWindowStatus = document.getElementById('authorityWindowStatus');

  let activeFilter = 'all';

  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const fmt = n => String(Math.max(0, Math.floor(n))).padStart(2,'0');

  function filteredRecords(){
    const q = String(search?.value || '').trim().toLowerCase();
    return records.filter(r => {
      const matchesFilter = activeFilter === 'all' || r.category === activeFilter;
      const hay = [r.id,r.name,r.team,r.event,r.role,r.certificateType,r.status].join(' ').toLowerCase();
      return matchesFilter && (!q || hay.includes(q));
    });
  }

  function renderList(){
    const rows = filteredRecords();
    if(!list) return;
    list.innerHTML = rows.map(r => `
      <article class="cert-record-card">
        <div class="cert-record-main">
          <div class="cert-record-tags"><span class="cert-id">${esc(r.id)}</span><span>${esc(r.certificateType)}</span><span class="status-${esc(r.status.toLowerCase())}">${esc(r.status)}</span></div>
          <h3>${esc(r.team)}</h3>
          <p><strong>${esc(r.name)}</strong> · ${esc(r.role)} · ${esc(r.event)}</p>
          <small>${esc(r.citation)}</small>
        </div>
        <div class="cert-record-actions"><button class="button cert-view" data-id="${esc(r.id)}" type="button">VIEW CERTIFICATE</button><button class="button cert-verify" data-verify="${esc(r.id)}" type="button">VERIFY</button></div>
      </article>`).join('');
    empty.hidden = rows.length !== 0;
    list.querySelectorAll('.cert-view').forEach(b=>b.addEventListener('click',()=>openCertificate(b.dataset.id)));
    list.querySelectorAll('.cert-verify').forEach(b=>b.addEventListener('click',()=>verify(b.dataset.verify)));
  }

  function openCertificate(id){
    const r = records.find(x=>x.id === id); if(!r || !modal || !preview) return;
    preview.innerHTML = `
      <div class="certificate-paper">
        <div class="certificate-paper-grid"></div>
        <div class="certificate-topline"><span>TRIPURA INSTITUTE OF TECHNOLOGY</span><b>UTKARSH 5.0 · 2026</b></div>
        <div class="certificate-mark">UTKARSH<br><strong>5.0</strong></div>
        <p class="certificate-kicker">OFFICIAL DIGITAL CREDENTIAL</p>
        <h2 id="certificateModalTitle">${esc(r.certificateType)}</h2>
        <p class="certificate-presented">This certificate is presented to</p>
        <div class="certificate-name">${esc(r.name)}</div>
        <p class="certificate-body">${esc(r.citation)}</p>
        <div class="certificate-meta-grid"><div><span>EVENT</span><strong>${esc(r.event)}</strong></div><div><span>CERTIFICATE ID</span><strong>${esc(r.id)}</strong></div><div><span>STATUS</span><strong>${esc(r.status)}</strong></div></div>
        <div class="certificate-sign-row"><div><div class="signature-line">Authorized Authority</div><small>${esc(r.approvedBy || cfg.authority)}</small></div><div class="certificate-qr"><div class="qr-faux"><span>QR</span><i></i><i></i><i></i><i></i></div><small>VERIFY ID</small></div></div>
        <div class="certificate-footer"><span>${esc(r.issueDate || 'Pending issue date')}</span><span>${esc(cfg.authority)}</span></div>
      </div>
      <div class="certificate-preview-actions"><button class="button primary" type="button" id="printCertificate">PRINT / SAVE PDF</button><button class="button" type="button" id="verifyFromPreview">VERIFY RECORD</button></div>`;
    modal.hidden=false; modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
    document.getElementById('printCertificate')?.addEventListener('click',printCertificate);
    document.getElementById('verifyFromPreview')?.addEventListener('click',()=>{closeModal();verify(id);});
  }

  function closeModal(){ if(!modal) return; modal.hidden=true; modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
  function printCertificate(){
    const paper = document.querySelector('.certificate-paper'); if(!paper) return;
    const w=window.open('','_blank','noopener,noreferrer'); if(!w) return;
    w.document.write(`<!doctype html><html><head><title>UTKARSH 5.0 Certificate</title><style>body{margin:0;background:#eee;font-family:Arial,sans-serif}.certificate-paper{width:1120px;min-height:790px;margin:30px auto;padding:60px;box-sizing:border-box;border:8px solid #172f45;background:#f8fbfd;color:#10243a;text-align:center;position:relative}.certificate-paper-grid{position:absolute;inset:20px;border:1px solid #9eb1c8}.certificate-topline{display:flex;justify-content:space-between;font-size:12px;letter-spacing:2px}.certificate-mark{font-size:26px;font-weight:800;margin-top:70px}.certificate-mark strong{font-size:44px}.certificate-kicker{letter-spacing:4px;font-size:12px}.certificate-paper h2{font-size:42px;margin:18px}.certificate-presented{font-size:17px}.certificate-name{font-size:50px;font-weight:800;border-bottom:2px solid #6d8aa4;display:inline-block;padding:8px 55px}.certificate-body{max-width:700px;margin:28px auto;font-size:17px}.certificate-meta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:35px 0}.certificate-meta-grid span{display:block;font-size:10px;letter-spacing:2px}.certificate-meta-grid strong{display:block;margin-top:7px}.certificate-sign-row{display:flex;justify-content:space-between;text-align:left;align-items:end;margin-top:45px}.signature-line{border-top:1px solid #172f45;padding-top:8px}.certificate-qr{width:100px;text-align:center}.qr-faux{width:70px;height:70px;border:3px solid #172f45;display:grid;grid-template-columns:repeat(4,1fr);gap:3px;padding:5px;box-sizing:border-box}.qr-faux i{background:#172f45}.certificate-footer{position:absolute;bottom:25px;left:60px;right:60px;display:flex;justify-content:space-between;font-size:10px;letter-spacing:1px}</style></head><body>${paper.outerHTML}</body></html>`); w.document.close(); w.focus(); setTimeout(()=>w.print(),250);
  }

  function verify(id){
    const normalized = String(id || '').trim().toUpperCase();
    if(verifyInput) verifyInput.value = normalized;
    const r = records.find(x=>x.id.toUpperCase()===normalized);
    if(!verifyResult) return;
    if(!normalized){ verifyResult.innerHTML='<span class="verify-icon">!</span><div><strong>Enter a certificate ID</strong><p>Example: UTKARSH5-26-WIN-001</p></div>'; return; }
    if(r){
      const valid = r.status !== 'REVOKED';
      verifyResult.className='verify-result '+(valid?'verified':'invalid');
      verifyResult.innerHTML=`<span class="verify-icon">${valid?'✓':'!'}</span><div><strong>${valid?'CERTIFICATE VERIFIED':'CERTIFICATE NOT VALID'}</strong><p><b>${esc(r.name)}</b> · ${esc(r.certificateType)} · ${esc(r.event)}<br>ID: ${esc(r.id)} · Status: ${esc(r.status)}</p></div>`;
    } else {
      verifyResult.className='verify-result invalid'; verifyResult.innerHTML='<span class="verify-icon">!</span><div><strong>NO PUBLIC RECORD FOUND</strong><p>Check the certificate ID and try again. If the document is genuine but not listed, contact the UTKARSH 5.0 certification authority.</p></div>';
    }
    document.getElementById('verify')?.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function updateApprovalWindow(){
    const start=new Date(cfg.approvalWindow.startsAt).getTime(); const end=new Date(cfg.approvalWindow.endsAt).getTime(); const now=Date.now();
    let label='CLOSED', msg='The authority approval window is closed.'; let diff=0;
    if(now<start){ label='NOT OPEN'; msg='Authority approval has not opened yet.'; diff=start-now; }
    else if(now<=end){ label='OPEN'; msg='Authorized reviewers may approve pending records during this window.'; diff=end-now; }
    else { label='CLOSED'; msg='The approval deadline has passed. Server-side enforcement is required for production.'; }
    const total=Math.floor(diff/1000), d=Math.floor(total/86400), h=Math.floor(total%86400/3600), m=Math.floor(total%3600/60);
    if(approvalClock) approvalClock.textContent=`${fmt(d)}D ${fmt(h)}H ${fmt(m)}M`;
    if(windowStatus){windowStatus.textContent=label;windowStatus.className='window-'+label.toLowerCase().replace(' ','-');}
    if(windowMessage) windowMessage.textContent=msg;
    if(authorityWindowText) authorityWindowText.textContent=`${new Date(cfg.approvalWindow.startsAt).toLocaleString('en-IN')} → ${new Date(cfg.approvalWindow.endsAt).toLocaleString('en-IN')}`;
    if(authorityWindowStatus) authorityWindowStatus.textContent=label;
  }

  function renderAuthority(){
    if(!authorityList) return;
    authorityList.innerHTML=records.filter(r=>r.status==='PENDING'||r.status==='APPROVED').map(r=>`<article class="authority-row"><div><span>${esc(r.id)}</span><h3>${esc(r.name)}</h3><p>${esc(r.certificateType)} · ${esc(r.event)}</p></div><div class="authority-row-status status-${esc(r.status.toLowerCase())}">${esc(r.status)}</div><div><button class="button authority-action" data-id="${esc(r.id)}" ${r.status!=='PENDING'?'disabled':''}>${r.status==='PENDING'?'APPROVE':'APPROVED'}</button></div></article>`).join('');
    authorityList.querySelectorAll('.authority-action:not([disabled])').forEach(b=>b.addEventListener('click',()=>approveDemo(b.dataset.id)));
  }
  function approveDemo(id){
    const end=new Date(cfg.approvalWindow.endsAt).getTime();
    if(Date.now()>end){alert('Approval window closed. Production must enforce this on the backend.');return;}
    const r=records.find(x=>x.id===id); if(!r) return; r.status='APPROVED'; r.approvedBy='Demo Authorized Reviewer'; renderAuthority(); renderList(); updateCounts();
  }
  function updateCounts(){
    const count=(s)=>records.filter(r=>r.status===s).length;
    document.getElementById('issuedCount').textContent=count('ISSUED'); document.getElementById('approvedCount').textContent=count('APPROVED'); document.getElementById('pendingCount').textContent=count('PENDING');
  }

  document.querySelectorAll('.cert-filter').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter;document.querySelectorAll('.cert-filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderList();}));
  search?.addEventListener('input',renderList); clearSearch?.addEventListener('click',()=>{search.value='';renderList();search.focus();});
  verifyButton?.addEventListener('click',()=>verify(verifyInput.value)); verifyInput?.addEventListener('keydown',e=>{if(e.key==='Enter')verify(verifyInput.value);});
  document.querySelectorAll('[data-close-cert]').forEach(x=>x.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && modal && !modal.hidden)closeModal();});
  document.getElementById('authorityToggle')?.addEventListener('click',()=>{authorityPanel.hidden=false;authorityPanel.scrollIntoView({behavior:'smooth',block:'start'});});
  document.getElementById('closeAuthority')?.addEventListener('click',()=>authorityPanel.hidden=true);

  renderList(); renderAuthority(); updateCounts(); updateApprovalWindow(); setInterval(updateApprovalWindow,1000);
  const queryId=new URLSearchParams(location.search).get('verify'); if(queryId) verify(queryId);
})();
