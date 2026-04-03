// session-booking.js — PRD §6.7 | with skeleton, confirmation screen, premium inline gate

window._sessionUI = {
  selectedType:   null,
  selectedMentor: null,
  selectedSlot:   null,
  voted:          false,
  booked:         false,
  bookedData:     null,
  loading:        true,
};

// Initialise loading skeleton then render real content
window._initSessionBooking = function() {
  window._sessionUI.loading = true;
  renderMainOnly();
  setTimeout(() => {
    window._sessionUI.loading = false;
    renderMainOnly();
  }, 600);
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

/** Vote for featured session */
window.voteFeaturedSession = function() {
  if (window._sessionUI.voted) return;
  window._sessionUI.voted = true;
  const isAr = state.language === 'ar';
  showToast(isAr ? 'تم تسجيل تصويتك! سيتم إشعارك بالتفاصيل.' : "Vote registered! We'll notify you.", 'var(--accent)');
  renderMainOnly();
};

/** Confirm booking */
window.confirmBooking = function() {
  const isAr    = state.language === 'ar';
  const typeId  = window._sessionUI.selectedType;
  const mentorId= window._sessionUI.selectedMentor;
  const slotId  = window._sessionUI.selectedSlot;
  if (!typeId || !mentorId || !slotId) {
    showToast(isAr ? 'اختر نوع الجلسة والمرشد والموعد.' : 'Select type, mentor and slot.', '#dc2626');
    return;
  }
  const type   = (window.SESSION_TYPES  || []).find(t => t.id  === typeId);
  const mentor = (window.MENTORS        || []).find(m => m.id  === mentorId);
  const slot   = (window.SESSION_SLOTS  || []).find(s => s.id  === slotId);
  window._sessionUI.booked     = true;
  window._sessionUI.bookedData = { type, mentor, slot };
  // Mark milestone
  if (!state.completedMilestones) state.completedMilestones = {};
  state.completedMilestones.sessionBooked = true;
  renderMainOnly();
};

/** Back to booking form */
window.resetBooking = function() {
  window._sessionUI = { selectedType:null, selectedMentor:null, selectedSlot:null, voted:false, booked:false, bookedData:null, loading:false };
  renderMainOnly();
};

// ── Featured session data ────────────────────────────────────
const FEATURED_SESSION = {
  expertName:  { en: 'Dr. Mohamed Saber',  ar: 'د. محمد صابر' },
  expertTitle: { en: 'Senior Embedded Systems Engineer — 10+ yrs', ar: 'مهندس أنظمة مدمجة أول — +10 سنوات' },
  expertColor: '#2563eb', expertInitials: 'MS',
  topic: { en: 'How to Land Your First Embedded Job', ar: 'كيف تحصل على أول وظيفة Embedded' },
  date:  { en: 'Sat, Apr 12 — 8:00 PM', ar: 'السبت 12 أبريل — 8:00 مساءً' },
  seats: 24, seatsLeft: 9, voteCount: 41,
};

function renderSkeleton() {
  const bar = (w) => `<div class="skeleton" style="height:1em;width:${w};border-radius:6px;margin-bottom:.5rem;"></div>`;
  const block = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.2rem;">
      ${bar('60%')}${bar('80%')}${bar('40%')}
    </div>`;
  return `
    <style>
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .skeleton{background:linear-gradient(90deg,var(--surface-2,#eee) 25%,var(--surface-3,#ddd) 50%,var(--surface-2,#eee) 75%);background-size:200% 100%;animation:shimmer 1.4s ease-in-out infinite;}
    </style>
    <div style="display:grid;gap:1rem;">${block}${block}${block}</div>`;
}

function renderPremiumGate(isAr) {
  return `
    <div style="text-align:center;padding:3rem 1rem;">
      <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:var(--accent-soft);display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem;">
        <i data-lucide="crown" style="width:1.4rem;height:1.4rem;color:var(--accent);"></i>
      </div>
      <h3 style="font-size:1.1rem;font-weight:800;margin-bottom:.5rem;">${isAr ? 'الجلسات متاحة لمشتركي Premium فقط' : 'Sessions Available for Premium Members'}</h3>
      <p class="text-muted" style="font-size:.88rem;line-height:1.8;max-width:380px;margin:0 auto .5rem;">
        ${isAr
          ? 'اشترك في خطة Premium أو Bundle لحجز جلسة مباشرة مع مرشد متخصص في مسارك.'
          : 'Subscribe to Premium or Bundle to book a live 1-on-1 session with a mentor in your track.'}
      </p>
      <button class="btn btn-primary" style="margin-top:.8rem;" onclick="navigateTo('pricing')">
        <i data-lucide="arrow-up-right" style="width:.9rem;height:.9rem;"></i>
        ${isAr ? 'عرض الباقات' : 'View Plans'}
      </button>
    </div>`;
}

function renderConfirmation(isAr) {
  const d = window._sessionUI.bookedData;
  if (!d) return '';
  const lang = isAr ? 'ar' : 'en';
  const typeLabel   = d.type   ? (isAr ? d.type.label.ar   : d.type.label.en)   : '';
  const mentorName  = d.mentor ? (isAr ? d.mentor.nameAr   : d.mentor.nameEn)   : '';
  const slotLabel   = d.slot   ? (isAr ? d.slot.labelAr    : d.slot.labelEn)    : '';

  return `
    <div style="text-align:center;padding:2.5rem 1rem;" data-aos="fade-up">
      <div style="width:4rem;height:4rem;border-radius:50%;background:var(--accent-soft);display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem;">
        <i data-lucide="calendar-check-2" style="width:1.8rem;height:1.8rem;color:var(--accent);"></i>
      </div>
      <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:.5rem;">${isAr ? 'تم تأكيد الحجز ✔' : 'Booking Confirmed ✔'}</h2>
      <p class="text-muted" style="font-size:.88rem;line-height:1.8;max-width:400px;margin:0 auto 1.5rem;">
        ${isAr ? 'سيصلك تأكيد عبر الإيميل مع رابط الجلسة.' : "A confirmation email with the session link will be sent to you."}
      </p>
      <div class="surface-panel" style="display:inline-grid;gap:.6rem;text-align:${isAr?'right':'left'};padding:1rem 1.5rem;border-radius:14px;min-width:260px;">
        <div style="display:flex;gap:.5rem;align-items:center;font-size:.88rem;">
          <i data-lucide="layers-3" style="width:.9rem;height:.9rem;color:var(--accent);"></i>
          <span class="text-muted">${isAr?'نوع الجلسة:':'Type:'}</span>
          <span style="font-weight:700;">${typeLabel}</span>
        </div>
        <div style="display:flex;gap:.5rem;align-items:center;font-size:.88rem;">
          <i data-lucide="user-round" style="width:.9rem;height:.9rem;color:var(--accent);"></i>
          <span class="text-muted">${isAr?'المرشد:':'Mentor:'}</span>
          <span style="font-weight:700;">${mentorName}</span>
        </div>
        <div style="display:flex;gap:.5rem;align-items:center;font-size:.88rem;">
          <i data-lucide="calendar-clock" style="width:.9rem;height:.9rem;color:var(--accent);"></i>
          <span class="text-muted">${isAr?'الموعد:':'Slot:'}</span>
          <span style="font-weight:700;">${slotLabel}</span>
        </div>
      </div>
      <div style="margin-top:1.5rem;display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="navigateTo('progress')">
          <i data-lucide="target" style="width:.9rem;height:.9rem;"></i>
          ${isAr ? 'متابعة تقدمي' : 'My Progress'}
        </button>
        <button class="btn btn-ghost" onclick="resetBooking()">
          ${isAr ? 'حجز جلسة أخرى' : 'Book Another'}
        </button>
      </div>
    </div>`;
}

function renderFeaturedBanner(isAr) {
  const fs    = FEATURED_SESSION;
  const lang  = isAr ? 'ar' : 'en';
  const voted = window._sessionUI.voted;
  const pctFull = Math.round(((fs.seats - fs.seatsLeft) / fs.seats) * 100);
  return `
    <div style="background:color-mix(in oklch,var(--accent) 6%,var(--surface));border:1.5px solid color-mix(in oklch,var(--accent) 25%,var(--border));border-radius:16px;padding:1.25rem 1.4rem;position:relative;overflow:hidden;">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.9rem;">
        <span style="display:inline-flex;align-items:center;gap:.3rem;background:var(--accent);color:#fff;font-size:.7rem;font-weight:800;padding:.25rem .6rem;border-radius:99px;">
          <i data-lucide="star" style="width:.65rem;height:.65rem;"></i>
          ${isAr ? 'جلسة مميزة' : 'Featured Session'}
        </span>
        <span style="font-size:.75rem;color:var(--text-muted);">
          <i data-lucide="calendar-clock" style="width:.72rem;height:.72rem;vertical-align:-.1em;"></i>
          ${fs.date[lang]}
        </span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.9rem;margin-bottom:.9rem;flex-wrap:wrap;">
        <div style="width:2.8rem;height:2.8rem;border-radius:50%;background:${fs.expertColor}22;border:2px solid ${fs.expertColor}55;color:${fs.expertColor};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.9rem;flex-shrink:0;">${fs.expertInitials}</div>
        <div style="flex:1;min-width:140px;">
          <div style="font-weight:800;">${fs.expertName[lang]}</div>
          <div style="font-size:.78rem;color:var(--text-muted);margin-top:.1rem;">${fs.expertTitle[lang]}</div>
          <div style="margin-top:.4rem;font-size:.9rem;font-weight:700;">&ldquo;${fs.topic[lang]}&rdquo;</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:.9rem;">
        <div style="background:var(--surface-2,var(--surface));border:1px solid var(--border);border-radius:10px;padding:.55rem .75rem;">
          <div style="font-size:.7rem;color:var(--text-muted);">${isAr?'مقاعد متبقية':'Seats left'}</div>
          <div style="font-weight:800;font-size:1.05rem;color:${fs.seatsLeft<=5?'var(--danger,#dc2626)':'var(--accent)'}">${fs.seatsLeft}</div>
          <div style="height:3px;background:var(--border);border-radius:99px;margin-top:.3rem;overflow:hidden;"><div style="height:100%;width:${pctFull}%;background:var(--accent);border-radius:99px;"></div></div>
        </div>
        <div style="background:var(--surface-2,var(--surface));border:1px solid var(--border);border-radius:10px;padding:.55rem .75rem;">
          <div style="font-size:.7rem;color:var(--text-muted);">${isAr?'صوتوا عليها':'Voted for it'}</div>
          <div style="font-weight:800;font-size:1.05rem;color:var(--accent);">${fs.voteCount+(voted?1:0)}</div>
          <div style="font-size:.7rem;color:var(--text-muted);">${isAr?'طالب هندسة':'students'}</div>
        </div>
      </div>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;">
        <button class="btn btn-primary" style="font-size:.82rem;" onclick="${state.premiumUnlocked?"selectSessionType('group')":"navigateTo('pricing')"}">
          <i data-lucide="calendar-check" style="width:.85rem;height:.85rem;"></i>
          ${isAr?'احجز مقعدك':'Book my seat'}
        </button>
        <button class="btn btn-secondary" style="font-size:.82rem;${voted?'opacity:.5;cursor:not-allowed;':''}" onclick="voteFeaturedSession()" ${voted?'disabled':''}>
          <i data-lucide="${voted?'check-circle':'thumbs-up'}" style="width:.85rem;height:.85rem;"></i>
          ${voted?(isAr?'سجلت تصويتك':'Voted!'):(isAr?'أريد أحضرها':'I want this')}
        </button>
      </div>
    </div>`;
}

function trackToField(trackId) {
  const map = {
    power:'electrical',embedded:'electrical',communications:'electrical',
    frontend:'software',backend:'software',data:'software',cyber:'software',
    'mechanical-design':'mechanical','mechanical-mfg':'mechanical','mechanical-thermal':'mechanical',
    'civil-structural':'civil','civil-water':'civil','civil-geo':'civil',
  };
  return map[trackId] || 'general';
}

function renderSessionTypeCards(isAr) {
  return (window.SESSION_TYPES || []).map(type => {
    const active = window._sessionUI.selectedType === type.id;
    const lang   = isAr ? 'ar' : 'en';
    return `
      <div class="step-card ${active?'step-card--active':''}" style="cursor:pointer;border:1.5px solid ${active?'var(--accent)':'var(--border)'};background:${active?'var(--accent-soft)':'var(--surface-2)'};transition:border .18s,background .18s;" onclick="selectSessionType('${type.id}')">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;">
          <div style="display:flex;align-items:center;gap:.6rem;">
            <span style="display:flex;align-items:center;justify-content:center;width:2.1rem;height:2.1rem;border-radius:.5rem;background:var(--surface-3,var(--surface));">
              <i data-lucide="${type.icon}" style="width:1rem;height:1rem;color:var(--accent);"></i>
            </span>
            <div>
              <div style="font-weight:700;font-size:.93rem;">${type.label[lang]}</div>
              <div style="font-size:.76rem;color:var(--text-muted);margin-top:.12rem;">${type.duration[lang]}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;">
            <div style="font-weight:800;font-size:.88rem;color:var(--accent);white-space:nowrap;">${type.price[lang]}</div>
            ${type.badge==='recommended'?`<span class="badge badge-accent" style="font-size:.66rem;">${isAr?'مقترح':'Recommended'}</span>`:''}
          </div>
        </div>
        <p class="text-muted" style="margin-top:.65rem;font-size:.83rem;line-height:1.7;">${type.desc[lang]}</p>
        ${active?`<div style="margin-top:.5rem;display:flex;align-items:center;gap:.35rem;color:var(--accent);font-size:.78rem;font-weight:600;"><i data-lucide="check-circle-2" style="width:.85rem;height:.85rem;"></i>${isAr?'تم الاختيار':'Selected'}</div>`:''}
      </div>`;
  }).join('');
}

function renderMentorCards(isAr, trackId) {
  const field   = trackToField(trackId);
  const mentors = (window.MENTORS || []).filter(m => m.fieldKey === field || m.fieldKey === 'general');
  if (!mentors.length) return `<p class="text-muted">${isAr?'لا يوجد مرشدون لهذا المسار حاليًا.':'No mentors available for this track yet.'}</p>`;
  return mentors.map(mentor => {
    const active = window._sessionUI.selectedMentor === mentor.id;
    return `
      <div class="step-card" style="cursor:pointer;border:1.5px solid ${active?'var(--accent)':'var(--border)'};background:${active?'var(--accent-soft)':'var(--surface-2)'};transition:border .18s,background .18s;" onclick="selectMentor('${mentor.id}')">
        <div style="display:flex;align-items:center;gap:.85rem;">
          <div class="mentor-avatar" style="background:${mentor.color}22;border-color:${mentor.color}44;color:${mentor.color};width:2.7rem;height:2.7rem;font-size:.88rem;">${mentor.avatar}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:.93rem;">${isAr?mentor.nameAr:mentor.nameEn}</div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-top:.1rem;">${isAr?mentor.titleAr:mentor.titleEn}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.2rem;flex-shrink:0;">
            <div style="display:flex;align-items:center;gap:.2rem;font-size:.78rem;font-weight:700;color:#f59e0b;">&#9733; ${mentor.rating}</div>
            <div style="font-size:.73rem;color:var(--text-muted);">${mentor.sessions} ${isAr?'جلسة':'sessions'}</div>
            <div style="font-size:.73rem;font-weight:700;color:var(--accent);">${mentor.price} ${isAr?'ج.م':'EGP'}</div>
          </div>
        </div>
        ${active?`<div style="margin-top:.5rem;display:flex;align-items:center;gap:.35rem;color:var(--accent);font-size:.78rem;font-weight:600;"><i data-lucide="check-circle-2" style="width:.85rem;height:.85rem;"></i>${isAr?'تم الاختيار':'Selected'}</div>`:''}
      </div>`;
  }).join('');
}

function renderSlotCards(isAr) {
  return (window.SESSION_SLOTS || []).map(slot => {
    const active    = window._sessionUI.selectedSlot === slot.id;
    const lang      = isAr ? 'ar' : 'en';
    const disabled  = !slot.available;
    return `
      <div class="step-card" style="cursor:${disabled?'not-allowed':'pointer'};opacity:${disabled?.45:1};border:1.5px solid ${active?'var(--accent)':'var(--border)'};background:${active?'var(--accent-soft)':'var(--surface-2)'};transition:border .18s,background .18s;" ${!disabled?`onclick="selectSlot('${slot.id}')"` : ''}>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:700;font-size:.92rem;">${slot.labelEn ? (isAr ? slot.labelAr : slot.labelEn) : slot.id}</div>
            ${disabled?`<div style="font-size:.75rem;color:var(--danger,#dc2626);margin-top:.15rem;">${isAr?'محجوز':'Unavailable'}</div>`:''}
          </div>
          ${active?`<i data-lucide="check-circle-2" style="width:1.1rem;height:1.1rem;color:var(--accent);"></i>`:''}
        </div>
      </div>`;
  }).join('');
}

window.renderSessionBookingView = function renderSessionBookingView() {
  const isAr  = state.language === 'ar';
  const isPro = state.premiumUnlocked;
  const ui    = window._sessionUI;

  // Skeleton while loading
  if (ui.loading) {
    return `
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${isAr?'حجز جلسة':'Book a Session'}</div>
          <h2 class="section-title" style="margin-top:.5rem;">${isAr?'احجز جلسة مع خبير':'Book a Session with an Expert'}</h2>
        </div>
      </div>
      ${renderSkeleton()}`;
  }

  // Premium gate
  if (!isPro) {
    return `
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${isAr?'حجز جلسة':'Book a Session'}</div>
          <h2 class="section-title" style="margin-top:.5rem;">${isAr?'جلسات فردية مع خبراء':'1-on-1 Sessions with Experts'}</h2>
        </div>
      </div>
      ${renderPremiumGate(isAr)}`;
  }

  // Confirmation screen
  if (ui.booked) {
    return `
      <div class="page-header">
        <div>
          <div class="eyebrow">${isAr?'حجز جلسة':'Book a Session'}</div>
        </div>
      </div>
      ${renderConfirmation(isAr)}`;
  }

  const trackId = state.topTracks?.[0]?.id || '';
  const hasType   = !!ui.selectedType;
  const hasMentor = !!ui.selectedMentor;
  const hasSlot   = !!ui.selectedSlot;

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr?'حجز جلسة':'Book a Session'}</div>
        <h2 class="section-title" style="margin-top:.5rem;">${isAr?'احجز جلسة مع خبير':'Book a Session with an Expert'}</h2>
        <p class="text-muted" style="margin-top:.5rem;line-height:1.8;">
          ${isAr?'اختر نوع الجلسة، ثم المرشد، ثم الموعد.':'Choose the session type, then your mentor, then a time slot.'}
        </p>
      </div>
    </div>

    <!-- Featured Banner -->
    <div style="margin-bottom:1.5rem;">${renderFeaturedBanner(isAr)}</div>

    <!-- Step 1 -->
    <div class="section-label" style="margin-bottom:.65rem;">
      <span class="step-badge">1</span>
      <span style="font-weight:700;">${isAr?'نوع الجلسة':'Session Type'}</span>
    </div>
    <div style="display:grid;gap:.75rem;margin-bottom:1.5rem;">${renderSessionTypeCards(isAr)}</div>

    <!-- Step 2 -->
    <div class="section-label" style="margin-bottom:.65rem;opacity:${hasType?1:.4};">
      <span class="step-badge">2</span>
      <span style="font-weight:700;">${isAr?'اختر مرشدك':'Choose Your Mentor'}</span>
    </div>
    <div style="display:grid;gap:.75rem;margin-bottom:1.5rem;opacity:${hasType?1:.4};pointer-events:${hasType?'auto':'none'};"
      >${renderMentorCards(isAr, trackId)}</div>

    <!-- Step 3 -->
    <div class="section-label" style="margin-bottom:.65rem;opacity:${hasMentor?1:.4};">
      <span class="step-badge">3</span>
      <span style="font-weight:700;">${isAr?'اختر موعدك':'Choose a Time Slot'}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.65rem;margin-bottom:1.5rem;opacity:${hasMentor?1:.4};pointer-events:${hasMentor?'auto':'none'};"
      >${renderSlotCards(isAr)}</div>

    <!-- Confirm CTA -->
    <div style="margin-top:1rem;">
      <button
        class="btn btn-primary"
        style="width:100%;font-size:1rem;padding:.85rem;${(!hasType||!hasMentor||!hasSlot)?'opacity:.45;cursor:not-allowed;':''}"
        onclick="confirmBooking()"
        ${(!hasType||!hasMentor||!hasSlot)?'disabled':''}>
        <i data-lucide="calendar-check-2" style="width:1rem;height:1rem;"></i>
        ${isAr?'تأكيد الحجز':'Confirm Booking'}
      </button>
      ${(!hasType||!hasMentor||!hasSlot)?`<p style="text-align:center;font-size:.78rem;color:var(--text-muted);margin-top:.5rem;">${isAr?'أكمل الخطوات الثلاث أعلاه':'Complete all 3 steps above'}</p>`:''}
    </div>
  `;
};
