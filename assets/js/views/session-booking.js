// ============================================================
// session-booking.js — TrackUp session booking view
// Includes: session type selector, mentor cards, time slots, form
// ============================================================

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

function renderSessionTypeCards(lang) {
  return (window.SESSION_TYPES || []).map(type => {
    const active = window._sessionUI.selectedType === type.id;
    return `
      <div
        class="step-card ${active ? 'step-card--active' : ''}"
        style="cursor:pointer;border:1.5px solid ${active ? 'var(--brand)' : 'var(--border)'};background:${active ? 'rgba(21,150,242,.08)' : 'var(--surface-2)'};transition:border .18s,background .18s;"
        onclick="selectSessionType('${type.id}')"
        data-aos="fade-up"
      >
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;">
          <div style="display:flex;align-items:center;gap:.6rem;">
            <span style="display:flex;align-items:center;justify-content:center;width:2.2rem;height:2.2rem;border-radius:.6rem;background:var(--surface-3);">
              <i data-lucide="${type.icon}" style="width:1.1rem;height:1.1rem;color:var(--brand);"></i>
            </span>
            <div>
              <div style="font-weight:700;font-size:.95rem;">${type.label[lang]}</div>
              <div style="font-size:.78rem;color:var(--muted);margin-top:.15rem;">${type.duration[lang]}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;">
            <div style="font-weight:800;font-size:.9rem;color:var(--brand);white-space:nowrap;">${type.price[lang]}</div>
            ${type.badge === 'recommended' ? `<span class="badge badge-primary" style="font-size:.68rem;">${lang === 'ar' ? 'مقترح' : 'Recommended'}</span>` : ''}
          </div>
        </div>
        <p class="text-muted" style="margin-top:.75rem;font-size:.85rem;line-height:1.7;">${type.desc[lang]}</p>
        ${active ? `<div style="margin-top:.6rem;display:flex;align-items:center;gap:.4rem;color:var(--brand);font-size:.8rem;font-weight:600;"><i data-lucide="check-circle-2" style="width:.9rem;height:.9rem;"></i>${lang === 'ar' ? 'تم الاختيار' : 'Selected'}</div>` : ''}
      </div>
    `;
  }).join('');
}

function renderMentorCards(lang, trackId) {
  const mentors = (window.MENTORS || []).filter(m => m.tracks.includes(trackId));
  if (!mentors.length) return `<p class="text-muted">${lang === 'ar' ? 'لا يوجد مرشدون متاحون لهذا المسار حاليا.' : 'No mentors available for this track yet.'}</p>`;
  return mentors.map(mentor => {
    const active = window._sessionUI.selectedMentor === mentor.id;
    return `
      <div
        class="step-card"
        style="cursor:pointer;border:1.5px solid ${active ? 'var(--brand)' : 'var(--border)'};background:${active ? 'rgba(21,150,242,.08)' : 'var(--surface-2)'};transition:border .18s,background .18s;"
        onclick="selectMentor('${mentor.id}')"
      >
        <div style="display:flex;align-items:center;gap:.9rem;">
          <div style="width:2.8rem;height:2.8rem;border-radius:50%;background:${mentor.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:#fff;flex-shrink:0;">${mentor.avatar}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:.95rem;">${mentor.name[lang]}</div>
            <div style="font-size:.8rem;color:var(--muted);margin-top:.15rem;">${mentor.role[lang]}</div>
            <div style="font-size:.78rem;color:var(--muted);margin-top:.1rem;">${mentor.lang[lang]}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;flex-shrink:0;">
            <div style="display:flex;align-items:center;gap:.25rem;font-size:.8rem;font-weight:700;color:#f59e0b;">
              <i data-lucide="star" style="width:.85rem;height:.85rem;fill:#f59e0b;color:#f59e0b;"></i>
              ${mentor.rating}
            </div>
            <div style="font-size:.75rem;color:var(--muted);">${mentor.sessions} ${lang === 'ar' ? 'جلسة' : 'sessions'}</div>
          </div>
        </div>
        ${active ? `<div style="margin-top:.6rem;display:flex;align-items:center;gap:.4rem;color:var(--brand);font-size:.8rem;font-weight:600;"><i data-lucide="check-circle-2" style="width:.9rem;height:.9rem;"></i>${lang === 'ar' ? 'تم الاختيار' : 'Selected'}</div>` : ''}
      </div>
    `;
  }).join('');
}

function renderSlotGrid(lang) {
  return (window.SESSION_SLOTS || []).map(slot => {
    const active = window._sessionUI.selectedSlot === slot.id;
    const unavailable = !slot.available;
    return `
      <button
        type="button"
        onclick="selectSlot('${slot.id}')"
        ${unavailable ? 'disabled' : ''}
        style="
          padding:.55rem .9rem;
          border-radius:.6rem;
          border:1.5px solid ${active ? 'var(--brand)' : unavailable ? 'var(--border)' : 'var(--border)'};
          background:${active ? 'rgba(21,150,242,.12)' : unavailable ? 'var(--surface-3)' : 'var(--surface-2)'};
          color:${unavailable ? 'var(--muted)' : active ? 'var(--brand)' : 'var(--text)'};
          font-size:.82rem;font-weight:${active ? '700' : '500'};
          cursor:${unavailable ? 'not-allowed' : 'pointer'};
          opacity:${unavailable ? '.45' : '1'};
          transition:border .15s,background .15s;
          text-align:center;
        "
      >
        <div style="font-weight:700;">${slot.day[lang]}</div>
        <div style="font-size:.76rem;margin-top:.1rem;">${slot.time}</div>
        ${unavailable ? `<div style="font-size:.7rem;margin-top:.1rem;color:var(--muted);">${lang === 'ar' ? 'محجوز' : 'Booked'}</div>` : ''}
      </button>
    `;
  }).join('');
}

function buildCollegeSelect(lang, currentValue) {
  const opts = (window.COLLEGE_OPTIONS || []).map(opt => {
    const sel = currentValue === opt.value ? 'selected' : '';
    return `<option value="${opt.value}" ${sel}>${opt.label[lang]}</option>`;
  }).join('');
  return `
    <select name="specialization">
      <option value="">${lang === 'ar' ? 'اختر التخصص' : 'Select specialization'}</option>
      ${opts}
    </select>
  `;
}

window.renderSessionBookingView = function renderSessionBookingView() {
  const track  = getCurrentTrack();
  const lang   = state.language;
  const ui     = window._sessionUI;
  const selType = (window.SESSION_TYPES || []).find(t => t.id === ui.selectedType);

  const gateBlock = !state.premiumUnlocked ? `
    <div class="fit-rail-card" style="margin-top:1.2rem;border-color:rgba(21,150,242,.3);">
      <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem;">
        <i data-lucide="lock" style="width:1rem;height:1rem;color:var(--brand);"></i>
        <span style="font-weight:700;">${t('sessionsPaid')}</span>
      </div>
      <p class="text-muted" style="font-size:.88rem;line-height:1.75;">${t('premiumReason')}</p>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem;">
        <button class="btn btn-primary" onclick="openPremiumLock('session-booking')">${t('upgradeNow')}</button>
        <button class="btn btn-ghost" onclick="navigateTo('pricing')">${t('viewPricing')}</button>
      </div>
    </div>
  ` : '';

  const introCard = `
    <div class="fit-rail-card" style="margin-top:1rem;">
      <div class="eyebrow" style="margin-bottom:.5rem;">
        ${lang === 'ar' ? 'لماذا جلسة Intro مهمة؟' : 'Why an Intro Session matters'}
      </div>
      <p class="text-muted" style="font-size:.88rem;line-height:1.75;">
        ${lang === 'ar'
          ? 'بعد التقييم، كثير من الطلاب عندهم أسئلة لا تجيب عليها النتائج وحدها. جلسة Intro تعطيك وضوحًا مباشرًا حول المسار وتساعدك على تجنب إضاعة الوقت.'
          : 'After the assessment, many students still have questions the results alone cannot answer. An Intro Session gives you direct clarity on your track and saves time by avoiding wrong directions.'}
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:.6rem;margin-top:.9rem;">
        ${[
          { icon: 'target', en: 'Track clarity', ar: 'وضوح المسار' },
          { icon: 'clock', en: 'Save time', ar: 'توفير الوقت' },
          { icon: 'user-round-check', en: 'Real engineer', ar: 'مهندس حقيقي' },
          { icon: 'message-circle', en: 'Ask anything', ar: 'اسأل ما تريد' },
        ].map(item => `
          <div style="display:flex;align-items:center;gap:.5rem;font-size:.82rem;color:var(--muted);">
            <i data-lucide="${item.icon}" style="width:.9rem;height:.9rem;color:var(--brand);flex-shrink:0;"></i>
            ${item[lang]}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const step1Done = !!ui.selectedType;
  const step2Done = !!ui.selectedMentor;
  const step3Done = !!ui.selectedSlot;

  const stepBar = `
    <div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;margin-top:1.2rem;margin-bottom:.2rem;">
      ${[[
        lang === 'ar' ? 'نوع الجلسة' : 'Session type', step1Done
      ],[
        lang === 'ar' ? 'المرشد' : 'Mentor', step2Done
      ],[
        lang === 'ar' ? 'الموعد' : 'Time slot', step3Done
      ],[
        lang === 'ar' ? 'تفاصيل الحجز' : 'Your details', false
      ]].map(([label, done], i) => `
        <div style="display:flex;align-items:center;gap:.35rem;">
          <div style="
            width:1.5rem;height:1.5rem;border-radius:50%;
            background:${done ? 'var(--brand)' : 'var(--surface-3)'};
            border:2px solid ${done ? 'var(--brand)' : 'var(--border)'};
            display:flex;align-items:center;justify-content:center;
            font-size:.7rem;font-weight:700;color:${done ? '#fff' : 'var(--muted)'};
          ">${done ? '<i data-lucide="check" style="width:.8rem;height:.8rem;"></i>' : i+1}</div>
          <span style="font-size:.78rem;color:${done ? 'var(--text)' : 'var(--muted)'};font-weight:${done ? '600' : '400'};">${label}</span>
          ${i < 3 ? `<i data-lucide="chevron-${state.direction === 'rtl' ? 'left' : 'right'}" style="width:.75rem;height:.75rem;color:var(--border);"></i>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  return `
    <section style="display:grid;gap:1.4rem;">

      <!-- Header -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="page-header">
          <div>
            <div class="eyebrow">${t('sessionTitle')}</div>
            <h2 class="section-title" style="margin-top:.6rem;">${t('sessionTitle')}</h2>
            <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${t('sessionDesc')}</p>
          </div>
          <div class="surface-soft section-pad" style="max-width:260px;">
            <div class="eyebrow" style="margin-bottom:.4rem;">${lang === 'ar' ? 'المسار المختار' : 'Selected track'}</div>
            <div style="font-weight:800;font-size:1.05rem;">${track.title[lang]}</div>
            <div style="font-size:.8rem;color:var(--muted);margin-top:.3rem;">
              ${lang === 'ar' ? 'يمكنك تغيير المسار من صفحة النتائج.' : 'You can change the track from the results screen.'}
            </div>
          </div>
        </div>
        ${introCard}
        ${gateBlock}
        ${stepBar}
      </div>

      ${state.premiumUnlocked ? `

        <!-- Step 1: Session type -->
        <div class="surface-panel section-pad" data-aos="fade-up">
          <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
            <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:${step1Done ? 'var(--brand)' : 'var(--surface-3)'};border:2px solid ${step1Done ? 'var(--brand)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:${step1Done ? '#fff' : 'var(--muted)'};">1</div>
            <span style="font-weight:700;">${lang === 'ar' ? 'اختر نوع الجلسة' : 'Choose session type'}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.85rem;">
            ${renderSessionTypeCards(lang)}
          </div>
        </div>

        <!-- Step 2: Mentor (visible after type selected) -->
        ${ui.selectedType ? `
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:${step2Done ? 'var(--brand)' : 'var(--surface-3)'};border:2px solid ${step2Done ? 'var(--brand)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:${step2Done ? '#fff' : 'var(--muted)'};">2</div>
              <span style="font-weight:700;">${lang === 'ar' ? 'اختر المرشد' : 'Choose your mentor'}</span>
            </div>
            <p class="text-muted" style="font-size:.85rem;margin-bottom:1rem;">${lang === 'ar' ? 'المرشدون المتاحون لمسار ' + track.title[lang] : 'Available mentors for the ' + track.title[lang] + ' track'}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.85rem;">
              ${renderMentorCards(lang, state.selectedTrack)}
            </div>
          </div>
        ` : ''}

        <!-- Step 3: Time slot (visible after mentor selected) -->
        ${ui.selectedMentor ? `
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:${step3Done ? 'var(--brand)' : 'var(--surface-3)'};border:2px solid ${step3Done ? 'var(--brand)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:${step3Done ? '#fff' : 'var(--muted)'};">3</div>
              <span style="font-weight:700;">${lang === 'ar' ? 'اختر الموعد' : 'Select a time slot'}</span>
            </div>
            <p class="text-muted" style="font-size:.85rem;margin-bottom:1rem;">${lang === 'ar' ? 'المواعيد المتاحة للأسبوع القادم' : 'Available slots for the upcoming week'}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:.55rem;">
              ${renderSlotGrid(lang)}
            </div>
          </div>
        ` : ''}

        <!-- Step 4: Booking form (visible after slot selected) -->
        ${ui.selectedSlot ? `
          <div class="surface-panel section-pad" data-aos="fade-up">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
              <div style="width:1.6rem;height:1.6rem;border-radius:50%;background:var(--surface-3);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:var(--muted);">4</div>
              <span style="font-weight:700;">${lang === 'ar' ? 'تفاصيل الحجز' : 'Your booking details'}</span>
            </div>

            <!-- Summary strip -->
            <div class="surface-soft section-pad" style="margin-bottom:1.2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.6rem;">
              ${[[
                lang === 'ar' ? 'نوع الجلسة' : 'Session type',
                selType ? selType.label[lang] : '-'
              ],[
                lang === 'ar' ? 'المسار' : 'Track',
                track.title[lang]
              ],[
                lang === 'ar' ? 'الموعد' : 'Slot',
                (() => { const s = (window.SESSION_SLOTS||[]).find(x=>x.id===ui.selectedSlot); return s ? s.day[lang]+' '+s.time : '-'; })()
              ],[
                lang === 'ar' ? 'السعر' : 'Price',
                selType ? selType.price[lang] : '-'
              ]].map(([k,v]) => `
                <div>
                  <div style="font-size:.75rem;color:var(--muted);">${k}</div>
                  <div style="font-weight:700;font-size:.88rem;margin-top:.15rem;">${v}</div>
                </div>
              `).join('')}
            </div>

            <form id="sessionForm" style="display:grid;gap:1rem;">
              <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('fullName')}</label>
                  <input name="fullName" value="${escapeHtml(state.profile.fullName || '')}" placeholder="${lang === 'ar' ? 'الاسم الكامل' : 'Full name'}">
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
                  ${buildCollegeSelect(lang, state.profile.college || '')}
                </div>
                <div>
                  <label style="display:block;margin-bottom:.5rem;font-weight:600;">${t('topic')}</label>
                  <select name="topic">
                    <option value="">${lang === 'ar' ? 'اختر الموضوع' : 'Choose topic'}</option>
                    ${selType ? `<option value="${selType.id}" selected>${selType.label[lang]}</option>` : ''}
                    ${(window.SESSION_TYPES||[]).filter(t=>t.id!==ui.selectedType).map(t=>`<option value="${t.id}">${t.label[lang]}</option>`).join('')}
                  </select>
                </div>
              </div>

              <!-- Hidden fields carry session context -->
              <input type="hidden" name="sessionType" value="${ui.selectedType || ''}">
              <input type="hidden" name="mentorId" value="${ui.selectedMentor || ''}">
              <input type="hidden" name="slotId" value="${ui.selectedSlot || ''}">
              <input type="hidden" name="trackId" value="${state.selectedTrack}">

              <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
                <button class="btn btn-primary" type="submit">${t('submitBooking')}</button>
                <button class="btn btn-secondary" type="button" onclick="navigateTo('pricing')">${t('viewPricing')}</button>
              </div>
            </form>
          </div>
        ` : ''}

      ` : ''}
    </section>
  `;
};
