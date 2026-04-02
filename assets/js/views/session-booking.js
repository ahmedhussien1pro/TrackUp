// session-booking.js — uses unified MENTORS from mentors.js
window._sessionUI = {
  selectedType: null,
  selectedMentor: null,
  selectedSlot: null,
};

window.selectSessionType = function(typeId) {
  window._sessionUI.selectedType = typeId;
  window._sessionUI.selectedMentor = null;
  window._sessionUI.selectedSlot = null;
  renderApp();
};
window.selectMentor = function(mentorId) {
  window._sessionUI.selectedMentor = mentorId;
  window._sessionUI.selectedSlot = null;
  renderApp();
};
window.selectSlot = function(slotId) {
  const slot = (window.SESSION_SLOTS || []).find(s => s.id === slotId);
  if (slot && !slot.available) return;
  window._sessionUI.selectedSlot = slotId;
  renderApp();
};

// Helper: map track id -> fieldKey used in MENTORS
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
    const lang = isAr ? 'ar' : 'en';
    return `
      <div class="step-card ${active ? 'step-card--active' : ''}"
        style="cursor:pointer;border:1.5px solid ${active ? 'var(--accent)' : 'var(--border)'};background:${active ? 'var(--accent-soft)' : 'var(--surface-2)'};transition:border .18s,background .18s;"
        onclick="selectSessionType('${type.id}')" data-aos="fade-up">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;">
          <div style="display:flex;align-items:center;gap:.6rem;">
            <span style="display:flex;align-items:center;justify-content:center;width:2.2rem;height:2.2rem;border-radius:.6rem;background:var(--surface-3);">
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
        ${active ? `<div style="margin-top:.6rem;display:flex;align-items:center;gap:.4rem;color:var(--accent);font-size:.8rem;font-weight:600;"><i data-lucide="check-circle-2" style="width:.9rem;height:.9rem;"></i>${isAr ? 'تم الاختيار' : 'Selected'}</div>` : ''}
      </div>
    `;
  }).join('');
}

function renderMentorCards(isAr, trackId) {
  // Use unified MENTORS from mentors.js, filter by fieldKey
  const field = trackToField(trackId);
  const mentors = (window.MENTORS || []).filter(m => m.fieldKey === field || m.fieldKey === 'general');
  if (!mentors.length) return `<p class="text-muted">${isAr ? 'لا يوجد مرشدون متاحون لهذا المسار حاليًا.' : 'No mentors available for this track yet.'}</p>`;
  return mentors.map(mentor => {
    const active = window._sessionUI.selectedMentor === mentor.id;
    return `
      <div class="step-card"
        style="cursor:pointer;border:1.5px solid ${active ? 'var(--accent)' : 'var(--border)'};background:${active ? 'var(--accent-soft)' : 'var(--surface-2)'};transition:border .18s,background .18s;"
        onclick="selectMentor('${mentor.id}')">
        <div style="display:flex;align-items:center;gap:.9rem;">
          <div class="mentor-avatar" style="background:${mentor.color}22;border-color:${mentor.color}44;color:${mentor.color};width:2.8rem;height:2.8rem;font-size:.9rem;">${mentor.avatar}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:.95rem;">${isAr ? mentor.nameAr : mentor.nameEn}</div>
            <div style="font-size:.8rem;color:var(--text-muted);margin-top:.1rem;">${isAr ? mentor.titleAr : mentor.titleEn}</div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-top:.1rem;">${isAr ? mentor.fieldAr : mentor.fieldEn}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.25rem;flex-shrink:0;">
            <div style="display:flex;align-items:center;gap:.25rem;font-size:.8rem;font-weight:700;color:#f59e0b;">★ ${mentor.rating}</div>
            <div style="font-size:.75rem;color:var(--text-muted);">${mentor.sessions} ${isAr ? 'جلسة' : 'sessions'}</div>
            <div style="font-size:.75rem;font-weight:700;color:var(--accent);">${mentor.price} ${isAr ? 'ج.م' : 'EGP'}</div>
          </div>
        </div>
        ${active ? `<div style="margin-top:.6rem;display:flex;align-items:center;gap:.4rem;color:var(--accent);font-size:.8rem;font-weight:600;"><i data-lucide="check-circle-2" style="width:.9rem;height:.9rem;"></i>${isAr ? 'تم الاختيار' : 'Selected'}</div>` : ''}
      </div>
    `;
  }).join('');
}

function renderSlotGrid(isAr) {
  return (window.SESSION_SLOTS || []).map(slot => {
    const active = window._sessionUI.selectedSlot === slot.id;
    const off = !slot.available;
    return `
      <button type="button" onclick="selectSlot('${slot.id}')" ${off ? 'disabled' : ''}
        style="padding:.55rem .9rem;border-radius:.6rem;border:1.5px solid ${active ? 'var(--accent)' : 'var(--border)'};
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

window.renderSessionBookingView = function renderSessionBookingView() {
  const isAr   = state.language === 'ar';
  const track  = getCurrentTrack();
  const ui     = window._sessionUI;
  const selType = (window.SESSION_TYPES || []).find(tp => tp.id === ui.selectedType);

  const step1Done = !!ui.selectedType;
  const step2Done = !!ui.selectedMentor;
  const step3Done = !!ui.selectedSlot;

  const stepBar = `
    <div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;margin-top:1.2rem;">
      ${[
        [isAr ? 'نوع الجلسة' : 'Session type', step1Done],
        [isAr ? 'المرشد' : 'Mentor', step2Done],
        [isAr ? 'الموعد' : 'Time slot', step3Done],
        [isAr ? 'تفاصيل الحجز' : 'Your details', false],
      ].map(([label, done], i) => `
        <div style="display:flex;align-items:center;gap:.3rem;">
          <div style="width:1.5rem;height:1.5rem;border-radius:50%;background:${done ? 'var(--accent)' : 'var(--surface-3)'};
            border:2px solid ${done ? 'var(--accent)' : 'var(--border)'};
            display:flex;align-items:center;justify-content:center;
            font-size:.7rem;font-weight:700;color:${done ? '#fff' : 'var(--text-muted)'};"
          >${done ? '✓' : i + 1}</div>
          <span style="font-size:.78rem;color:${done ? 'var(--text)' : 'var(--text-muted)'};font-weight:${done ? '600' : '400'};">${label}</span>
          ${i < 3 ? `<span style="color:var(--border);font-size:.8rem;">${isAr ? '‹' : '›'}</span>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  return `
    <div style="display:grid;gap:1.4rem;">

      <!-- Header -->
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
              <button class="btn btn-secondary" onclick="navigateTo('mentors')">${isAr ? 'براوز المرشدين' : 'Browse Mentors'}</button>
            </div>
          </div>
        ` : stepBar}
      </div>

      ${state.premiumUnlocked ? `

        <!-- Step 1: Session type -->
        <div class="surface-panel section-pad" data-aos="fade-up">
          <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
            <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:${step1Done ? 'var(--accent)' : 'var(--surface-3)'};border:2px solid ${step1Done ? 'var(--accent)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:${step1Done ? '#fff' : 'var(--text-muted)'};">1</div>
            <span style="font-weight:700;">${isAr ? 'اختر نوع الجلسة' : 'Choose session type'}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:.85rem;">
            ${renderSessionTypeCards(isAr)}
          </div>
        </div>

        ${ui.selectedType ? `
          <!-- Step 2: Mentor -->
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:${step2Done ? 'var(--accent)' : 'var(--surface-3)'};border:2px solid ${step2Done ? 'var(--accent)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:${step2Done ? '#fff' : 'var(--text-muted)'};">2</div>
              <span style="font-weight:700;">${isAr ? 'اختر المرشد' : 'Choose your mentor'}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.85rem;">
              ${renderMentorCards(isAr, state.selectedTrack)}
            </div>
          </div>
        ` : ''}

        ${ui.selectedMentor ? `
          <!-- Step 3: Time slot -->
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:${step3Done ? 'var(--accent)' : 'var(--surface-3)'};border:2px solid ${step3Done ? 'var(--accent)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:${step3Done ? '#fff' : 'var(--text-muted)'};">3</div>
              <span style="font-weight:700;">${isAr ? 'اختر الموعد' : 'Select a time slot'}</span>
            </div>
            <p class="text-muted" style="font-size:.85rem;margin-bottom:1rem;">${isAr ? 'المواعيد المتاحة للأسبوع القادم' : 'Available slots for the upcoming week'}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:.55rem;">
              ${renderSlotGrid(isAr)}
            </div>
          </div>
        ` : ''}

        ${ui.selectedSlot ? `
          <!-- Step 4: Booking form -->
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:var(--surface-3);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:var(--text-muted);">4</div>
              <span style="font-weight:700;">${isAr ? 'تفاصيل الحجز' : 'Your booking details'}</span>
            </div>

            <!-- Summary strip -->
            <div class="surface-soft section-pad" style="margin-bottom:1.2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.6rem;">
              ${[[
                isAr ? 'نوع الجلسة' : 'Session type',
                selType ? selType.label[isAr ? 'ar' : 'en'] : '-'
              ],[
                isAr ? 'المسار' : 'Track',
                track.title[isAr ? 'ar' : 'en']
              ],[
                isAr ? 'الموعد' : 'Slot',
                (() => { const s = (window.SESSION_SLOTS||[]).find(x => x.id === ui.selectedSlot); return s ? s.day[isAr?'ar':'en'] + ' ' + s.time : '-'; })()
              ],[
                isAr ? 'السعر' : 'Price',
                selType ? selType.price[isAr ? 'ar' : 'en'] : '-'
              ]].map(([k, v]) => `
                <div>
                  <div style="font-size:.75rem;color:var(--text-muted);">${k}</div>
                  <div style="font-weight:700;font-size:.88rem;margin-top:.15rem;">${v}</div>
                </div>
              `).join('')}
            </div>

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
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('password')}</label>
                  <input name="password" type="password">
                </div>
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('confirmPassword')}</label>
                  <input name="confirmPassword" type="password">
                </div>
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('specialization')}</label>
                  ${buildCollegeSelect(isAr, state.profile.college || '')}
                </div>
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('topic')}</label>
                  <select name="topic">
                    <option value="">${isAr ? 'اختر الموضوع' : 'Choose topic'}</option>
                    ${(window.SESSION_TYPES||[]).map(tp => `<option value="${tp.id}" ${tp.id === ui.selectedType ? 'selected' : ''}>${tp.label[isAr?'ar':'en']}</option>`).join('')}
                  </select>
                </div>
              </div>
              <input type="hidden" name="sessionType" value="${ui.selectedType || ''}">
              <input type="hidden" name="mentorId"    value="${ui.selectedMentor || ''}">
              <input type="hidden" name="slotId"     value="${ui.selectedSlot || ''}">
              <input type="hidden" name="trackId"    value="${state.selectedTrack}">
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
