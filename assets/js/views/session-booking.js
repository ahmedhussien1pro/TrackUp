// session-booking.js — uses unified MENTORS from mentors.js
// PRD §6.7: Featured Session banner at top (expert + next slot + vote)

window._sessionUI = {
  selectedType:   null,
  selectedMentor: null,
  selectedSlot:   null,
  voted:          false,
};

window.selectSessionType = function(typeId) {
  window._sessionUI.selectedType   = typeId;
  window._sessionUI.selectedMentor = null;
  window._sessionUI.selectedSlot   = null;
  renderMainOnly();
};
window.selectMentor = function(mentorId) {
  window._sessionUI.selectedMentor = mentorId;
  window._sessionUI.selectedSlot   = null;
  renderMainOnly();
};
window.selectSlot = function(slotId) {
  const slot = (window.SESSION_SLOTS || []).find(s => s.id === slotId);
  if (slot && !slot.available) return;
  window._sessionUI.selectedSlot = slotId;
  renderMainOnly();
};

/** PRD §6.7 — vote for featured session */
window.voteFeaturedSession = function voteFeaturedSession() {
  if (window._sessionUI.voted) return;
  window._sessionUI.voted = true;
  const isAr = state.language === 'ar';
  showToast(isAr ? 'تم تسجيل تصويتك! سيتم إشعارك بالتفاصيل.' : 'Vote registered! We\'ll notify you with details.', '#2563eb');
  renderMainOnly();
};

// ── Featured session data (static demo content) ─────────────────
const FEATURED_SESSION = {
  expertName:  { en: 'Dr. Mohamed Saber',  ar: 'د. محمد صابر' },
  expertTitle: { en: 'Senior Embedded Systems Engineer — 10+ yrs', ar: 'مهندس أنظمة مدمجة أول — +10 سنوات' },
  expertColor: '#2563eb',
  expertInitials: 'MS',
  topic:       { en: 'How to Land Your First Embedded Job', ar: 'كيف تحصل على أول وظيفة Embedded' },
  date:        { en: 'Sat, Apr 12 — 8:00 PM', ar: 'السبت 12 أبريل — 8:00 مساءً' },
  seats:       24,
  seatsLeft:   9,
  voteCount:   41,
};

function renderFeaturedBanner(isAr) {
  const fs      = FEATURED_SESSION;
  const lang    = isAr ? 'ar' : 'en';
  const voted   = window._sessionUI.voted;
  const pctFull = Math.round(((fs.seats - fs.seatsLeft) / fs.seats) * 100);

  return `
    <div data-aos="fade-up" style="
      background: linear-gradient(135deg, rgba(37,99,235,.07) 0%, rgba(124,58,237,.07) 100%);
      border: 1.5px solid rgba(37,99,235,.22);
      border-radius: 18px;
      padding: 1.4rem 1.5rem;
      position: relative;
      overflow: hidden;
    ">

      <div style="position:absolute;top:-40px;${isAr ? 'left' : 'right'}:-40px;width:180px;height:180px;
        background:radial-gradient(circle,rgba(37,99,235,.12),transparent 70%);
        pointer-events:none;"></div>

      <div style="display:flex;align-items:center;gap:.55rem;margin-bottom:1rem;">
        <span style="display:inline-flex;align-items:center;gap:.35rem;background:var(--accent);color:#fff;
          font-size:.72rem;font-weight:800;padding:.28rem .65rem;border-radius:99px;letter-spacing:.03em;">
          <i data-lucide="star" style="width:.7rem;height:.7rem;"></i>
          ${isAr ? 'جلسة مميزة' : 'Featured Session'}
        </span>
        <span style="font-size:.75rem;color:var(--text-muted);display:inline-flex;align-items:center;gap:.3rem;">
          <i data-lucide="calendar-clock" style="width:.75rem;height:.75rem;"></i>
          ${fs.date[lang]}
        </span>
      </div>

      <div style="display:flex;align-items:flex-start;gap:1rem;margin-bottom:1rem;flex-wrap:wrap;">
        <div style="
          width:3rem;height:3rem;border-radius:50%;
          background:${fs.expertColor}22;
          border:2px solid ${fs.expertColor}55;
          color:${fs.expertColor};
          display:flex;align-items:center;justify-content:center;
          font-weight:900;font-size:.95rem;flex-shrink:0;
        ">${fs.expertInitials}</div>

        <div style="flex:1;min-width:160px;">
          <div style="font-weight:800;font-size:1rem;">${fs.expertName[lang]}</div>
          <div style="font-size:.8rem;color:var(--text-muted);margin-top:.18rem;">${fs.expertTitle[lang]}</div>
          <div style="
            margin-top:.55rem;
            font-size:.92rem;
            font-weight:700;
            color:var(--text);
            line-height:1.5;
          ">&ldquo;${fs.topic[lang]}&rdquo;</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:1rem;">
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:.6rem .8rem;">
          <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.2rem;">${isAr ? 'المقاعد المتبقية' : 'Seats left'}</div>
          <div style="font-weight:800;font-size:1.1rem;color:${fs.seatsLeft <= 5 ? '#dc2626' : 'var(--accent)'}">${fs.seatsLeft}</div>
          <div style="height:4px;background:var(--border);border-radius:99px;margin-top:.35rem;overflow:hidden;">
            <div style="height:100%;width:${pctFull}%;background:${fs.seatsLeft <= 5 ? '#dc2626' : 'var(--accent)'};border-radius:99px;"></div>
          </div>
        </div>
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:.6rem .8rem;">
          <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.2rem;">${isAr ? 'صوتوا عليها' : 'Voted for it'}</div>
          <div style="font-weight:800;font-size:1.1rem;color:var(--accent);">${fs.voteCount + (voted ? 1 : 0)}</div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:.1rem;">${isAr ? 'طالب هندسة' : 'engineering students'}</div>
        </div>
      </div>

      <div style="display:flex;gap:.65rem;flex-wrap:wrap;">
        <button
          class="btn btn-primary"
          style="font-size:.84rem;"
          onclick="${state.premiumUnlocked ? "selectSessionType('group')" : "navigateTo('pricing')"}"
        >
          <i data-lucide="calendar-check" style="width:.88rem;height:.88rem;"></i>
          ${isAr ? 'احجز مقعدك' : 'Book my seat'}
        </button>
        <button
          class="btn btn-secondary"
          style="font-size:.84rem;${voted ? 'opacity:.5;cursor:not-allowed;' : ''}"
          onclick="voteFeaturedSession()"
          ${voted ? 'disabled' : ''}
        >
          <i data-lucide="${voted ? 'check-circle' : 'thumbs-up'}" style="width:.88rem;height:.88rem;"></i>
          ${voted
            ? (isAr ? 'سجلت تصويتك' : 'Voted!')
            : (isAr ? 'أريد أحضرها' : 'I want this session')
          }
        </button>
      </div>

    </div>
  `;
}

// ── Track → fieldKey mapper ────────────────────────────────────
function trackToField(trackId) {
  const map = {
    power: 'electrical', embedded: 'electrical', communications: 'electrical',
    frontend: 'software', backend: 'software', data: 'software', cyber: 'software',
    'mechanical-design': 'mechanical', 'mechanical-mfg': 'mechanical', 'mechanical-thermal': 'mechanical',
    'civil-structural': 'civil', 'civil-water': 'civil', 'civil-geo': 'civil',
  };
  return map[trackId] || 'general';
}

function renderSessionTypeCards(isAr) {
  return (window.SESSION_TYPES || []).map(type => {
    const active = window._sessionUI.selectedType === type.id;
    const lang   = isAr ? 'ar' : 'en';
    return `
      <div class="step-card ${active ? 'step-card--active' : ''}"
        style="cursor:pointer;border:1.5px solid ${active ? 'var(--accent)' : 'var(--border)'};
          background:${active ? 'var(--accent-soft)' : 'var(--surface-2)'};
          transition:border .18s,background .18s;"
        onclick="selectSessionType('${type.id}')" data-aos="fade-up">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;">
          <div style="display:flex;align-items:center;gap:.6rem;">
            <span style="display:flex;align-items:center;justify-content:center;width:2.2rem;height:2.2rem;
              border-radius:.6rem;background:var(--surface-3);">
              <i data-lucide="${type.icon}" style="width:1.1rem;height:1.1rem;color:var(--accent);"></i>
            </span>
            <div>
              <div style="font-weight:700;font-size:.95rem;">${type.label[lang]}</div>
              <div style="font-size:.78rem;color:var(--text-muted);margin-top:.15rem;">${type.duration[lang]}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;">
            <div style="font-weight:800;font-size:.9rem;color:var(--accent);white-space:nowrap;">${type.price[lang]}</div>
            ${type.badge === 'recommended' ? `<span class="badge badge-accent" style="font-size:.68rem;">${isAr ? 'مقترح' : 'Recommended'}</span>` : ''}
          </div>
        </div>
        <p class="text-muted" style="margin-top:.75rem;font-size:.85rem;line-height:1.7;">${type.desc[lang]}</p>
        ${active ? `
          <div style="margin-top:.6rem;display:flex;align-items:center;gap:.4rem;color:var(--accent);font-size:.8rem;font-weight:600;">
            <i data-lucide="check-circle-2" style="width:.9rem;height:.9rem;"></i>
            ${isAr ? 'تم الاختيار' : 'Selected'}
          </div>` : ''}
      </div>
    `;
  }).join('');
}

function renderMentorCards(isAr, trackId) {
  const field   = trackToField(trackId);
  const mentors = (window.MENTORS || []).filter(m => m.fieldKey === field || m.fieldKey === 'general');
  if (!mentors.length) return `<p class="text-muted">${isAr ? 'لا يوجد مرشدون متاحون لهذا المسار حاليًا.' : 'No mentors available for this track yet.'}</p>`;
  return mentors.map(mentor => {
    const active = window._sessionUI.selectedMentor === mentor.id;
    return `
      <div class="step-card"
        style="cursor:pointer;border:1.5px solid ${active ? 'var(--accent)' : 'var(--border)'};
          background:${active ? 'var(--accent-soft)' : 'var(--surface-2)'};
          transition:border .18s,background .18s;"
        onclick="selectMentor('${mentor.id}')">
        <div style="display:flex;align-items:center;gap:.9rem;">
          <div class="mentor-avatar" style="background:${mentor.color}22;border-color:${mentor.color}44;color:${mentor.color};width:2.8rem;height:2.8rem;font-size:.9rem;">${mentor.avatar}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:.95rem;">${isAr ? mentor.nameAr : mentor.nameEn}</div>
            <div style="font-size:.8rem;color:var(--text-muted);margin-top:.1rem;">${isAr ? mentor.titleAr : mentor.titleEn}</div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-top:.1rem;">${isAr ? mentor.fieldAr : mentor.fieldEn}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.25rem;flex-shrink:0;">
            <div style="display:inline-flex;align-items:center;gap:.25rem;font-size:.8rem;font-weight:700;color:#f59e0b;">
              <i data-lucide="star" style="width:.75rem;height:.75rem;fill:#f59e0b;stroke:#f59e0b;"></i>
              ${mentor.rating}
            </div>
            <div style="font-size:.75rem;color:var(--text-muted);">${mentor.sessions} ${isAr ? 'جلسة' : 'sessions'}</div>
            <div style="font-size:.75rem;font-weight:700;color:var(--accent);">${mentor.price} ${isAr ? 'ج.م' : 'EGP'}</div>
          </div>
        </div>
        ${active ? `
          <div style="margin-top:.6rem;display:flex;align-items:center;gap:.4rem;color:var(--accent);font-size:.8rem;font-weight:600;">
            <i data-lucide="check-circle-2" style="width:.9rem;height:.9rem;"></i>
            ${isAr ? 'تم الاختيار' : 'Selected'}
          </div>` : ''}
      </div>
    `;
  }).join('');
}

function renderSlotGrid(isAr) {
  return (window.SESSION_SLOTS || []).map(slot => {
    const active = window._sessionUI.selectedSlot === slot.id;
    const off    = !slot.available;
    return `
      <button type="button" onclick="selectSlot('${slot.id}')" ${off ? 'disabled' : ''}
        style="padding:.55rem .9rem;border-radius:.6rem;
          border:1.5px solid ${active ? 'var(--accent)' : 'var(--border)'};
          background:${active ? 'var(--accent-soft)' : off ? 'var(--surface-3)' : 'var(--surface-2)'};
          color:${off ? 'var(--text-muted)' : active ? 'var(--accent)' : 'var(--text)'};
          font-size:.82rem;font-weight:${active ? '700' : '500'};
          cursor:${off ? 'not-allowed' : 'pointer'};opacity:${off ? '.4' : '1'};
          transition:border .15s,background .15s;text-align:center;">
        <div style="font-weight:700;">${slot.day[isAr ? 'ar' : 'en']}</div>
        <div style="font-size:.76rem;margin-top:.1rem;">${slot.time}</div>
        ${off ? `<div style="font-size:.7rem;margin-top:.1rem;color:var(--text-muted);">${isAr ? 'محجوز' : 'Booked'}</div>` : ''}
      </button>
    `;
  }).join('');
}

function buildCollegeSelect(isAr, currentValue) {
  const opts = (window.COLLEGE_OPTIONS || []).map(opt => {
    const sel = currentValue === opt.value ? 'selected' : '';
    return `<option value="${opt.value}" ${sel}>${opt.label[isAr ? 'ar' : 'en']}</option>`;
  }).join('');
  return `<select name="specialization"><option value="">${isAr ? 'اختر التخصص' : 'Select specialization'}</option>${opts}</select>`;
}

// ── Step number bubble helper ─────────────────────────────────
function stepBubble(num, done) {
  if (done) {
    return `
      <div style="width:1.6rem;height:1.6rem;border-radius:50%;
        background:var(--accent);border:2px solid var(--accent);
        display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i data-lucide="check" style="width:.7rem;height:.7rem;color:#fff;"></i>
      </div>`;
  }
  return `
    <div style="width:1.6rem;height:1.6rem;border-radius:50%;
      background:var(--surface-3);border:2px solid var(--border);
      display:flex;align-items:center;justify-content:center;flex-shrink:0;
      font-size:.75rem;font-weight:700;color:var(--text-muted);">
      ${num}
    </div>`;
}

// ── Main view ─────────────────────────────────────────────────
window.renderSessionBookingView = function renderSessionBookingView() {
  const isAr    = state.language === 'ar';
  const track   = getCurrentTrack();
  const ui      = window._sessionUI;
  const selType = (window.SESSION_TYPES || []).find(tp => tp.id === ui.selectedType);

  const step1Done = !!ui.selectedType;
  const step2Done = !!ui.selectedMentor;
  const step3Done = !!ui.selectedSlot;

  const stepBarItems = [
    { label: isAr ? 'نوع الجلسة'    : 'Session type',    done: step1Done },
    { label: isAr ? 'المرشد'        : 'Mentor',          done: step2Done },
    { label: isAr ? 'الموعد'        : 'Time slot',       done: step3Done },
    { label: isAr ? 'تفاصيل الحجز' : 'Your details',    done: false     },
  ];

  const stepBar = `
    <div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;margin-top:1.2rem;">
      ${stepBarItems.map((item, i) => `
        <div style="display:flex;align-items:center;gap:.3rem;">
          <div style="width:1.5rem;height:1.5rem;border-radius:50%;
            background:${item.done ? 'var(--accent)' : 'var(--surface-3)'};
            border:2px solid ${item.done ? 'var(--accent)' : 'var(--border)'};
            display:flex;align-items:center;justify-content:center;">
            ${item.done
              ? `<i data-lucide="check" style="width:.6rem;height:.6rem;color:#fff;"></i>`
              : `<span style="font-size:.7rem;font-weight:700;color:var(--text-muted);">${i + 1}</span>`
            }
          </div>
          <span style="font-size:.78rem;color:${item.done ? 'var(--text)' : 'var(--text-muted)'};
            font-weight:${item.done ? '600' : '400'};">${item.label}</span>
          ${i < 3 ? `<i data-lucide="chevron-${isAr ? 'left' : 'right'}" style="width:.7rem;height:.7rem;color:var(--border);"></i>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  return `
    <div style="display:grid;gap:1.4rem;">

      ${renderFeaturedBanner(isAr)}

      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="page-header">
          <div>
            <div class="eyebrow">${t('sessionTitle')}</div>
            <h2 class="section-title" style="margin-top:.5rem;">${t('sessionTitle')}</h2>
            <p class="text-muted" style="margin-top:.6rem;">${t('sessionDesc')}</p>
          </div>
          <div class="surface-soft section-pad" style="max-width:240px;">
            <div class="eyebrow" style="margin-bottom:.35rem;">${isAr ? 'المسار المختار' : 'Selected track'}</div>
            <div style="font-weight:800;">${track.title[isAr ? 'ar' : 'en']}</div>
          </div>
        </div>
        ${!state.premiumUnlocked ? `
          <div class="fit-rail-card" style="margin-top:1rem;border-color:rgba(59,130,246,.3);">
            <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
              <i data-lucide="lock" style="width:1rem;height:1rem;color:var(--accent);"></i>
              <span style="font-weight:700;">${t('sessionsPaid')}</span>
            </div>
            <p class="text-muted" style="font-size:.88rem;line-height:1.75;margin-bottom:.8rem;">${t('premiumReason')}</p>
            <div style="display:flex;gap:.6rem;flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="navigateTo('pricing')">${t('upgradeNow')}</button>
              <button class="btn btn-secondary" onclick="navigateTo('mentors')">${isAr ? 'تصفح المرشدين' : 'Browse Mentors'}</button>
            </div>
          </div>
        ` : stepBar}
      </div>

      ${state.premiumUnlocked ? `

        <!-- Step 1: Session Type -->
        <div class="surface-panel section-pad" data-aos="fade-up">
          <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
            ${stepBubble(1, step1Done)}
            <span style="font-weight:700;">${isAr ? 'اختر نوع الجلسة' : 'Choose session type'}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:.85rem;">
            ${renderSessionTypeCards(isAr)}
          </div>
        </div>

        <!-- Step 2: Mentor (appears after step 1) -->
        ${ui.selectedType ? `
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              ${stepBubble(2, step2Done)}
              <span style="font-weight:700;">${isAr ? 'اختر المرشد' : 'Choose your mentor'}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.85rem;">
              ${renderMentorCards(isAr, state.selectedTrack)}
            </div>
          </div>
        ` : ''}

        <!-- Step 3: Time Slot (appears after step 2) -->
        ${ui.selectedMentor ? `
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              ${stepBubble(3, step3Done)}
              <span style="font-weight:700;">${isAr ? 'اختر الموعد' : 'Select a time slot'}</span>
            </div>
            <p class="text-muted" style="font-size:.85rem;margin-bottom:1rem;">${isAr ? 'المواعيد المتاحة للأسبوع القادم' : 'Available slots for the upcoming week'}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:.55rem;">
              ${renderSlotGrid(isAr)}
            </div>
          </div>
        ` : ''}

        <!-- Step 4: Booking Details Form (appears after step 3) -->
        ${ui.selectedSlot ? `
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              ${stepBubble(4, false)}
              <span style="font-weight:700;">${isAr ? 'تفاصيل الحجز' : 'Your booking details'}</span>
            </div>

            <!-- Summary chips -->
            <div class="surface-soft section-pad" style="margin-bottom:1.2rem;
              display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.6rem;">
              ${[
                [isAr ? 'نوع الجلسة' : 'Session type',  selType ? selType.label[isAr ? 'ar' : 'en'] : '-'],
                [isAr ? 'المسار'     : 'Track',          track.title[isAr ? 'ar' : 'en']],
                [isAr ? 'الموعد'     : 'Slot',           (() => { const s = (window.SESSION_SLOTS || []).find(x => x.id === ui.selectedSlot); return s ? s.day[isAr ? 'ar' : 'en'] + ' ' + s.time : '-'; })()],
                [isAr ? 'السعر'      : 'Price',          selType ? selType.price[isAr ? 'ar' : 'en'] : '-'],
              ].map(([k, v]) => `
                <div>
                  <div style="font-size:.75rem;color:var(--text-muted);">${k}</div>
                  <div style="font-weight:700;font-size:.88rem;margin-top:.15rem;">${v}</div>
                </div>
              `).join('')}
            </div>

            <!-- Booking form — no password fields -->
            <form id="sessionForm" style="display:grid;gap:1rem;">
              <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('fullName')}</label>
                  <input name="fullName" value="${escapeHtml(state.profile.fullName || '')}" placeholder="${isAr ? 'الاسم الكامل' : 'Full name'}">
                </div>
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">Email</label>
                  <input name="email" type="email" value="${escapeHtml(state.profile.email || '')}" placeholder="example@mail.com">
                </div>
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('specialization')}</label>
                  ${buildCollegeSelect(isAr, state.profile.college || '')}
                </div>
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('topic')}</label>
                  <select name="topic">
                    <option value="">${isAr ? 'اختر الموضوع' : 'Choose topic'}</option>
                    ${(window.SESSION_TYPES || []).map(tp => `<option value="${tp.id}" ${tp.id === ui.selectedType ? 'selected' : ''}>${tp.label[isAr ? 'ar' : 'en']}</option>`).join('')}
                  </select>
                </div>
              </div>
              <input type="hidden" name="sessionType" value="${ui.selectedType || ''}">
              <input type="hidden" name="mentorId"    value="${ui.selectedMentor || ''}">
              <input type="hidden" name="slotId"      value="${ui.selectedSlot || ''}">
              <input type="hidden" name="trackId"     value="${state.selectedTrack}">
              <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
                <button class="btn btn-primary" type="submit">${t('submitBooking')}</button>
                <button class="btn btn-secondary" type="button" onclick="navigateTo('mentors')">${isAr ? 'رجوع للمرشدين' : 'Back to Mentors'}</button>
              </div>
            </form>
          </div>
        ` : ''}

      ` : ''}
    </div>
  `;
};
