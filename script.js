const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// =========================================================
// EVENT RULEBOOKS + REGISTRATION LINKS
// Replace the empty registration URLs below with the final official forms.
// =========================================================
function ruleList(title, items){
  return `<div class="rulebook-section"><h4>${title}</h4><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}

const rulebookModal = document.getElementById('rulebookModal');
const rulebookModalContent = document.getElementById('rulebookModalContent');
let lastRulebookTrigger = null;

function openRulebook(key, trigger){
  const e=EVENT_DATA[key];
  if(!e || !rulebookModal || !rulebookModalContent) return;
  lastRulebookTrigger = trigger || document.querySelector(`.rule-btn[data-event="${key}"]`);
  rulebookModalContent.innerHTML=`
    <div class="rulebook-head">
      <div><span class="eyebrow">${e.category.toUpperCase()}</span><h3 id="rulebookModalTitle">${e.title} — RULEBOOK</h3><p class="rulebook-subtitle">PUBLIC INFORMATION COPY · VERIFY FINAL DETAILS WITH THE ORGANISING COMMITTEE.</p></div>
      <span class="draft-badge">DEFAULT / DRAFT RULEBOOK</span>
    </div>
    <div class="rulebook-meta"><div><small>ENTRY</small><strong>${e.entry}</strong></div><div><small>DEFAULT TIME</small><strong>${e.time}</strong></div><div><small>STATUS</small><strong>PENDING FINAL APPROVAL</strong></div></div>
    <div class="rulebook-section"><h4>1. OBJECTIVE</h4><p>${e.objective}</p></div>
    ${ruleList('2. ELIGIBILITY',e.eligibility)}${ruleList('3. MATERIALS / RESOURCES',e.materials)}${ruleList('4. COMPETITION RULES',e.rules)}${ruleList('5. JUDGING CRITERIA',e.judging)}${ruleList('6. PENALTIES',e.penalties)}
    <div class="rulebook-section"><h4>7. FINAL AUTHORITY</h4><p>The organising committee may clarify or modify operational details before the competition. The final approved rulebook will override this default draft.</p></div>
    <div class="rulebook-footer-note"><strong>For participants:</strong> Please read the complete rulebook before registering. Official venue, reporting time, materials and final scoring details will be published once confirmed.</div>
    <div class="rulebook-modal-actions">
      <a class="button primary modal-register-btn" data-modal-registration="${key}" href="#">REGISTER TEAM FOR ${e.title.toUpperCase()} ↗</a>
      <button class="button modal-poster-btn" type="button" data-modal-poster="${key}">VIEW POSTER ↗</button>
      <button class="button modal-close-btn" type="button" data-close-rulebook>CLOSE</button>
    </div>`;
  rulebookModal.hidden=false;
  rulebookModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(()=>rulebookModal.classList.add('is-open'));
  rulebookModal.querySelector('.rulebook-close')?.focus();
}

function closeRulebook(){
  if(!rulebookModal) return;
  rulebookModal.classList.remove('is-open');
  rulebookModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  setTimeout(()=>{rulebookModal.hidden=true;},180);
  lastRulebookTrigger?.focus();
}

document.querySelectorAll('.rule-btn').forEach(el=>{
  el.addEventListener('click',()=>openRulebook(el.dataset.event,el));
});
document.querySelectorAll('[data-close-rulebook]').forEach(el=>el.addEventListener('click',closeRulebook));
document.addEventListener('click',e=>{
  const register=e.target.closest('[data-modal-registration]');
  if(register){
    e.preventDefault();
    const key=register.dataset.modalRegistration;
    const url=EVENT_DATA[key]?.url;
    if(url){ window.open(url,'_blank','noopener'); }
    else { alert(`Registration link for ${EVENT_DATA[key]?.title || 'this event'} is pending. Add the official form URL in event-config.js.`); }
  }
  const poster=e.target.closest('[data-modal-poster]');
  if(poster){
    const key=poster.dataset.modalPoster;
    const url=EVENT_DATA[key]?.poster;
    if(url){ window.open(url,'_blank','noopener'); }
    else { alert(`Poster for ${EVENT_DATA[key]?.title || 'this event'} is pending. Add the official poster URL in event-config.js.`); }
  }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && rulebookModal && !rulebookModal.hidden) closeRulebook(); });

document.querySelectorAll('[data-registration]').forEach(link=>{
  const key=link.dataset.registration;
  const url=EVENT_DATA[key]?.url;
  if(url){ link.href=url; link.target='_blank'; link.rel='noopener'; }
  else if(link.tagName==='A'){
    link.addEventListener('click',(ev)=>{
      ev.preventDefault();
      alert(`Registration link for ${EVENT_DATA[key]?.title || 'this event'} is pending. Add the official form URL in event-config.js.`);
    });
  }
});




// =========================================================
// EDITABLE SCHEDULE
// Data lives in schedule-config.js so the schedule can be changed
// without touching the HTML.
// =========================================================
function renderSchedule(){
  const grid = document.getElementById('scheduleGrid');
  const title = document.getElementById('scheduleTitle');
  const intro = document.getElementById('scheduleIntro');
  if(!grid || typeof SCHEDULE_DATA === 'undefined') return;
  if(title && SCHEDULE_DATA.title) title.textContent = SCHEDULE_DATA.title + '.';
  if(intro && SCHEDULE_DATA.intro) intro.textContent = SCHEDULE_DATA.intro;
  grid.innerHTML = (SCHEDULE_DATA.days || []).map(day => `
    <article class="schedule-day-card">
      <span>${escapeHtml(day.day || '')}</span>
      <strong>${escapeHtml(day.date || '')}</strong>
      <h3>${escapeHtml(day.month || '')}</h3>
      <p class="schedule-day-label">${escapeHtml(day.label || '')}</p>
      <div class="schedule-items">
        ${(day.items || []).map(item => `<div class="schedule-item"><time>${escapeHtml(item.time || '')}</time><div><b>${escapeHtml(item.event || '')}</b><small>${escapeHtml(item.venue || '')}</small></div></div>`).join('')}
      </div>
    </article>`).join('');
}
renderSchedule();

// =========================================================
// LIVE COMMITTEE DIRECTORY
// Google Sheet -> Apps Script -> approved public entries
// =========================================================
const committeeDirectory = document.getElementById('committeeDirectory');
const committeeStatus = document.getElementById('committeeStatus');
const committeeStatusDot = document.getElementById('committeeStatusDot');
const committeeUpdated = document.getElementById('committeeUpdated');
const committeeFormLink = document.getElementById('committeeFormLink');

if (committeeFormLink && typeof COMMITTEE_CONFIG !== 'undefined') committeeFormLink.href = COMMITTEE_CONFIG.formUrl;

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function initials(name){
  return String(name||'Coordinator').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'CO';
}
function normalizeApproval(v){ return String(v||'').trim().toLowerCase(); }

function committeeGroup(person){
  const role = String(person.role||'').toLowerCase();
  const type = String(person.type||'').toLowerCase();
  const event = String(person.event||'').trim();
  if (/faculty|teacher|professor|hod|head of department|lecturer|assistant professor|associate professor|principal|director/.test(type+' '+role)) {
    if (/principal|director|patron|chair|secretary/.test(role)) return {key:'leadership', title:'Faculty & Institute Leadership', icon:'♟'};
    return {key:'faculty', title:'Faculty Coordinators', icon:'♟'};
  }
  if (/student|event head|core|lead|coordinator/.test(type+' '+role)) {
    return {key:'student', title:'Technical & Organizing Leads', icon:'♟'};
  }
  if (event) return {key:'event-coordinators', title:'Event Coordinators', icon:'◆'};
  return {key:'other', title:'Organising Team', icon:'♟'};
}

function iconSvg(type){
  const common='aria-hidden="true" focusable="false" viewBox="0 0 24 24"';
  const paths={
    mail:`<svg ${common}><path d="M3 5.5h18v13H3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
    phone:`<svg ${common}><path d="M7.1 3.5 5 5.2c-.8.7-.9 1.8-.5 2.7 2 4.9 6.1 9 11 11 .9.4 2 .2 2.7-.5l1.7-2.1c.5-.6.3-1.5-.4-1.9l-3.3-1.9c-.6-.3-1.3-.2-1.7.3l-1.1 1.3a13.7 13.7 0 0 1-5.1-5.1l1.3-1.1c.5-.4.6-1.1.3-1.7L8.9 3.9c-.4-.7-1.3-.9-1.8-.4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    linkedin:`<svg ${common}><path d="M6.2 8.4v9.5M6.2 5.2v.1M10.5 17.9v-5.1c0-2 1.1-3.1 2.8-3.1 1.8 0 2.5 1.2 2.5 3.3v4.9M10.5 11.7V17.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
    github:`<svg ${common}><path d="M12 3.7a8.3 8.3 0 0 0-2.6 16.2c.4.1.6-.2.6-.4v-1.5c-2.4.5-2.9-1-2.9-1-.4-1-1-1.2-1-1.2-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2 1 2.5.8.1-.6.3-1 .5-1.2-1.9-.2-3.9-.9-3.9-4.1 0-.9.3-1.6.9-2.2-.1-.2-.4-1.1.1-2.2 0 0 .7-.2 2.3.8a7.7 7.7 0 0 1 4.2 0c1.6-1 2.3-.8 2.3-.8.5 1.1.2 2 .1 2.2.6.6.9 1.3.9 2.2 0 3.2-2 3.9-3.9 4.1.3.3.5.8.5 1.6v2.3c0 .2.2.5.6.4A8.3 8.3 0 0 0 12 3.7Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    instagram:`<svg ${common}><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor"/></svg>`
  };
  return paths[type] || '';
}

function normalizeUrl(value){
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^(mailto:|tel:|https?:\/\/)/i.test(raw)) return raw;
  if (/^(www\.)/i.test(raw)) return 'https://' + raw;
  if (/^(linkedin\.com|github\.com|instagram\.com)(\/|$)/i.test(raw)) return 'https://' + raw;
  if (/^@[a-z0-9._-]+$/i.test(raw)) return 'https://instagram.com/' + raw.slice(1);
  return 'https://' + raw;
}

function coordinatorContactLinks(person){
  const links = [];
  const add=(href,type,label)=>{
    const safeHref = normalizeUrl(href);
    if (!safeHref) return;
    links.push(`<a href="${escapeHtml(safeHref)}" ${/^https?:\/\//i.test(safeHref)?'target="_blank" rel="noopener noreferrer"':''} aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${iconSvg(type)}</a>`);
  };
  if (person.email) add(`mailto:${String(person.email).trim()}`,'mail',`Email ${person.name}`);
  if (person.phone) {
    const phone = String(person.phone).replace(/[^+\d]/g,'');
    if (phone) add(`tel:${phone}`,'phone',`Call ${person.name}`);
  }
  if (person.linkedin) add(String(person.linkedin).trim(),'linkedin',`LinkedIn profile for ${person.name}`);
  if (person.github) add(String(person.github).trim(),'github',`GitHub profile for ${person.name}`);
  if (person.instagram) add(String(person.instagram).trim(),'instagram',`Instagram profile for ${person.name}`);
  return links.join('');
}

function committeeDetails(person){
  const department = String(person.department || 'Department of Civil Engineering').trim();
  const year = String(person.year || '').trim();
  const academic = [department, year].filter(Boolean).map(escapeHtml).join(' · ');
  return `<p class="coordinator-details">${academic || 'Department of Civil Engineering'}</p>`;
}

function renderCommittee(people){
  if(!committeeDirectory) return;
  if(!people.length){
    committeeDirectory.innerHTML = `<div class="committee-empty"><strong>NO APPROVED COORDINATORS YET</strong><p>Submit a coordinator through the form, review the response in Google Sheets, then set <strong>Approved</strong> to <strong>YES</strong>.</p></div>`;
    return;
  }

  const groups = {};
  people.forEach(person => {
    const g = committeeGroup(person);
    (groups[g.key] ||= {title:g.title,icon:g.icon,people:[]}).people.push(person);
  });

  const order = ['leadership','faculty','student','event-coordinators','other'];

  committeeDirectory.innerHTML = order.filter(k=>groups[k]?.people.length).map(key => {
    const group = groups[key];
    const leadership = key === 'leadership';
    const eventGroup = key === 'event-coordinators';
    const groupClass = `${leadership?'leadership ':''}${eventGroup?'event-coordinators':''}`.trim();

    return `<section class="committee-group ${groupClass}">
      <div class="committee-group-title">
        <span class="group-icon" aria-hidden="true">${group.icon}</span>
        <span>${escapeHtml(group.title)}</span>
      </div>
      <div class="committee-group-grid ${group.people.length === 1 ? 'single-card' : 'multi-card'}">
        ${group.people.map(person => `<article class="coordinator-card">
          <div class="coordinator-photo-wrap">
            ${String(person.photo||'').trim() ? `<img class="coordinator-photo" src="${escapeHtml(String(person.photo).trim())}" alt="${escapeHtml(person.name)}" loading="eager" decoding="async">` : ''}
            <div class="coordinator-photo placeholder" aria-hidden="true"${String(person.photo||'').trim() ? ' style="display:none"' : ''}>${escapeHtml(initials(person.name))}</div>
          </div>
          <h4>${escapeHtml(person.name)}</h4>
          <span class="coord-role">${escapeHtml(person.role || 'COORDINATOR')}</span>
          ${committeeDetails(person)}
          <div class="coordinator-links">${coordinatorContactLinks(person)}</div>
        </article>`).join('')}
      </div>
    </section>`;
  }).join('');

  committeeDirectory.querySelectorAll('.coordinator-photo-wrap').forEach(wrap => {
    const img = wrap.querySelector('img.coordinator-photo');
    const fallback = wrap.querySelector('.coordinator-photo.placeholder');
    if (!img || !fallback || !img.getAttribute('src')) {
      if (img) img.style.display = 'none';
      if (fallback) fallback.style.display = 'grid';
      return;
    }
    fallback.style.display = 'none';
    img.addEventListener('error', () => {
      img.style.display = 'none';
      fallback.style.display = 'grid';
    }, {once:true});
  });
}

async function loadCommittee(){
  if(!committeeDirectory || typeof COMMITTEE_CONFIG === 'undefined') return;
  let api = String(COMMITTEE_CONFIG.apiUrl||'').trim();
  // Google Apps Script has separate testing (/dev) and deployed (/exec) URLs.
  // Always use the deployed endpoint from the public Vercel site.
  api = api.replace(/\/dev(?:\?.*)?$/i, '/exec');
  if(!api){
    if (committeeStatus) committeeStatus.textContent='DIRECTORY NOT CONNECTED';
    if (committeeUpdated) committeeUpdated.textContent='Add the deployed Apps Script /exec URL in committee-config.js.';
    committeeDirectory.innerHTML=`<div class="committee-empty"><strong>COORDINATOR DIRECTORY NOT CONNECTED</strong><p>The Committee page is ready. Paste your deployed Google Apps Script <strong>/exec</strong> URL into <strong>committee-config.js</strong> to load the Google Sheet automatically.</p></div>`;
    return;
  }
  try{
    const response = await fetch(api, {cache:'no-store', redirect:'follow'});
    if(response.status === 404){
      throw new Error('Apps Script endpoint returned HTTP 404. Redeploy the Apps Script as a Web app and use its current /exec URL.');
    }
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if(!payload.ok) throw new Error(payload.error || 'The committee feed returned an error.');
    renderCommittee((payload.data||[]).filter(p=>COMMITTEE_CONFIG.approvedValues.map(normalizeApproval).includes(normalizeApproval(p.approved)) || !p.approved));
    if (committeeStatus) committeeStatus.textContent='LIVE DIRECTORY';
    if (committeeStatusDot) committeeStatusDot.classList.add('ready');
    if (committeeUpdated) committeeUpdated.textContent = payload.updatedAt ? `Last checked ${new Date(payload.updatedAt).toLocaleString()}` : 'Approved coordinator data loaded.';
  }catch(error){
    if (committeeStatus) committeeStatus.textContent='CONNECTION ERROR';
    if (committeeUpdated) committeeUpdated.textContent='Could not load the approved coordinator feed. Check the Apps Script deployment URL.';
    committeeDirectory.innerHTML=`<div class="committee-empty"><strong>DIRECTORY TEMPORARILY UNAVAILABLE</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}
loadCommittee();
if(typeof COMMITTEE_CONFIG !== 'undefined' && COMMITTEE_CONFIG.refreshMs) setInterval(loadCommittee, COMMITTEE_CONFIG.refreshMs);

// Live countdown to UTKARSH 5.0 opening. The target is fixed to India Standard Time.
(function initCountdown(){
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');
  const statusEl = document.getElementById('countdown-status');
  if(!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // 22 September 2026, 00:00 IST (UTC+05:30).
  const target = new Date('2026-09-22T00:00:00+05:30').getTime();

  function pad(value){ return String(Math.max(0, value)).padStart(2, '0'); }

  function update(){
    const remaining = Math.max(0, target - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);

    if(remaining <= 0){
      statusEl.textContent = 'CONSTRUCTION CLOCK COMPLETE · UTKARSH 5.0 IS LIVE';
      clearInterval(timer);
    }
  }

  update();
  const timer = setInterval(update, 1000);
})();

// =========================================================
// REFERENCE-STYLE RIGHT PAGE RAIL
// Expands on hover/focus and tracks the section currently in view.
// =========================================================
(() => {
  const rail = document.querySelector('.section-rail');
  if (!rail) return;
  const items = [...rail.querySelectorAll('.rail-item')];
  const progress = rail.querySelector('.rail-progress span');
  const sections = items.map(item => document.getElementById(item.dataset.section)).filter(Boolean);

  const setActive = (id) => {
    items.forEach(item => item.classList.toggle('is-active', item.dataset.section === id));
    const index = Math.max(0, items.findIndex(item => item.dataset.section === id));
    if (progress) progress.style.width = `${Math.max(14, ((index + 1) / items.length) * 100)}%`;
  };

  items.forEach(item => item.addEventListener('click', (event) => {
    const target = document.getElementById(item.dataset.section);
    if (!target) return;
    event.preventDefault();
    setActive(item.dataset.section);
    target.scrollIntoView({behavior:'smooth', block:'start'});
    history.replaceState(null, '', `#${item.dataset.section}`);
  }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, {root:null, rootMargin:'-18% 0px -62% 0px', threshold:[0.05,0.15,0.35,0.6]});
    sections.forEach(section => observer.observe(section));
  }

  const initial = (location.hash || '#home').slice(1);
  setActive(items.some(i => i.dataset.section === initial) ? initial : 'home');
})();
