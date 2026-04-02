window.renderMentorsView = function renderMentorsView() {
  const isAr = state.language === 'ar';
  const filterField = state.mentorFilter || 'all';
  const isPremium = state.premiumUnlocked;

  const fields = [
    { key: 'all',       labelEn: 'All Mentors',     labelAr: 'كل المرشدين' },
    { key: 'electrical',labelEn: 'Electrical',      labelAr: 'كهربائية' },
    { key: 'software',  labelEn: 'Software',        labelAr: 'برمجيات' },
    { key: 'mechanical',labelEn: 'Mechanical',      labelAr: 'ميكانيكا' },
    { key: 'civil',     labelEn: 'Civil',           labelAr: 'مدنية' },
    { key: 'general',   labelEn: 'Career Guidance', labelAr: 'إرشاد مهني' }
  ];

  const filtered = filterField === 'all' ? MENTORS : MENTORS.filter(m => m.fieldKey === filterField);

  function stars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let s = '';
    for (let i = 0; i < full; i++) s += '<span style="color:#f59e0b">★</span>';
    if (half) s += '<span style="color:#f59e0b">½</span>';
    return s;
  }

  function availBadge(m) {
    const label = isAr ? m.availabilityAr : m.availability;
    const color = m.availability === 'both' ? '#059669' : '#2563eb';
    return `<span style="font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:6px;background:${color}22;color:${color};border:1px solid ${color}44;">${label}</span>`;
  }

  const cards = filtered.map(m => `
    <div class="surface-panel mentor-card" data-aos="fade-up">
      <div class="mentor-card-top">
        <div class="mentor-avatar" style="background:${m.color}22;border-color:${m.color}44;color:${m.color};">
          ${m.avatar}
        </div>
        <div class="mentor-card-info">
          <div style="font-weight:800;font-size:1rem;">${isAr ? m.nameAr : m.nameEn}</div>
          <div style="color:var(--text-muted);font-size:.85rem;margin-top:.15rem;">${isAr ? m.titleAr : m.titleEn}</div>
          <div style="margin-top:.35rem;">
            <span class="eyebrow" style="font-size:.7rem;">${isAr ? m.fieldAr : m.fieldEn}</span>
          </div>
        </div>
        ${availBadge(m)}
      </div>
      <p style="font-size:.86rem;color:var(--text-muted);line-height:1.75;margin:.85rem 0;">${isAr ? m.bioAr : m.bioEn}</p>
      <div class="mentor-tags">
        ${(isAr ? m.specializationsAr : m.specializations).map(s => `<span class="mentor-tag">${s}</span>`).join('')}
      </div>
      <div class="mentor-card-footer">
        <div class="mentor-stats">
          <div class="mentor-stat">
            <span style="font-weight:800;color:var(--accent);">${m.sessions}</span>
            <span class="text-muted" style="font-size:.75rem;">${isAr ? 'جلسة' : 'sessions'}</span>
          </div>
          <div class="mentor-stat">
            <div style="display:flex;align-items:center;gap:.25rem;">
              ${stars(m.rating)}
              <span style="font-weight:700;font-size:.88rem;">${m.rating}</span>
            </div>
            <span class="text-muted" style="font-size:.75rem;">(${m.reviews} ${isAr ? 'تقييم' : 'reviews'})</span>
          </div>
          <div class="mentor-stat">
            <span style="font-weight:800;color:var(--accent);">${m.price} ${isAr ? 'ج.م' : m.currency}</span>
            <span class="text-muted" style="font-size:.75rem;">${isAr ? '/ جلسة' : '/ session'}</span>
          </div>
        </div>
        <button class="btn btn-primary" style="min-width:130px;" onclick="bookMentor('${m.id}')">
          ${isAr ? 'احجز جلسة' : 'Book Session'}
        </button>
      </div>
    </div>
  `).join('');

  const quickLinks = [
    { id:'session-booking', icon:'calendar-days', labelEn:'Book a Session',   labelAr:'احجز جلسة',     lock: !isPremium },
    { id:'roadmap',         icon:'route',         labelEn:'My Roadmap',       labelAr:'خارطتي' },
    { id:'progress',        icon:'target',        labelEn:'My Progress',      labelAr:'تقدمي' },
    { id:'pricing',         icon:'credit-card',   labelEn:'Pricing',          labelAr:'الأسعار' },
    { id:'chat',            icon:'message-square',labelEn:'Mentor Chat',      labelAr:'شات المرشد',    lock: !isPremium },
  ];

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <h1 class="section-title">${t('mentorsTitle')}</h1>
        <p class="text-muted" style="margin-top:.4rem;">${t('mentorsDesc')}</p>
      </div>
    </div>

    <div class="mentor-filters" data-aos="fade-up">
      ${fields.map(f => `
        <button
          class="mentor-filter-pill ${filterField === f.key ? 'is-active' : ''}"
          onclick="setMentorFilter('${f.key}')">
          ${isAr ? f.labelAr : f.labelEn}
        </button>
      `).join('')}
    </div>

    <div class="mentor-stats-bar surface-panel" data-aos="fade-up">
      <div class="mentor-kpi">
        <span class="mentor-kpi-num">5</span>
        <span class="text-muted" style="font-size:.8rem;">${isAr ? 'مرشد متاح' : 'Active Mentors'}</span>
      </div>
      <div class="mentor-kpi">
        <span class="mentor-kpi-num">1,384</span>
        <span class="text-muted" style="font-size:.8rem;">${isAr ? 'جلسة منجزة' : 'Sessions Done'}</span>
      </div>
      <div class="mentor-kpi">
        <span class="mentor-kpi-num">4.9 ★</span>
        <span class="text-muted" style="font-size:.8rem;">${isAr ? 'متوسط التقييم' : 'Avg. Rating'}</span>
      </div>
      <div class="mentor-kpi">
        <span class="mentor-kpi-num">550+</span>
        <span class="text-muted" style="font-size:.8rem;">${isAr ? 'طالب استفاد' : 'Students Helped'}</span>
      </div>
    </div>

    <div class="mentors-grid">
      ${filtered.length ? cards : `<div class="surface-panel section-pad" style="text-align:center;color:var(--text-muted);">No mentors found for this filter.</div>`}
    </div>

    <div class="surface-panel section-pad" style="text-align:center;" data-aos="fade-up">
      <div style="font-weight:700;font-size:1.05rem;margin-bottom:.5rem;">${isAr ? 'مش لاقي المرشد المناسب؟' : "Can't find the right mentor?"}</div>
      <p class="text-muted" style="margin-bottom:1rem;font-size:.9rem;">${isAr ? 'ابدأ التقييم وهنرشحلك المرشد الأنسب بناءً على تخصصك.' : 'Complete the assessment and we will match you with the best mentor for your field.'}</p>
      <button class="btn btn-primary" onclick="guardedNavigate('profile')">${t('startAssessment')}</button>
    </div>

    ${renderQuickLinks(quickLinks)}
  `;
};

window.setMentorFilter = function setMentorFilter(field) {
  state.mentorFilter = field;
  renderApp();
};

window.bookMentor = function bookMentor(mentorId) {
  const mentor = MENTORS.find(m => m.id === mentorId);
  if (!mentor) return;
  const isAr = state.language === 'ar';
  if (!state.premiumUnlocked) {
    Swal.fire({
      title: isAr ? 'مطلوب الباقة المدفوعة' : 'Premium Required',
      text: isAr
        ? `حجز جلسة مع ${mentor.nameAr} متاح للأعضاء المدفوعين فقط.`
        : `Booking a session with ${mentor.nameEn} requires a Premium plan.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: isAr ? 'اشترك دلوقتي' : 'Upgrade Now',
      cancelButtonText: isAr ? 'مش دلوقتي' : 'Maybe Later',
      confirmButtonColor: '#2563eb',
      background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
      color: state.theme === 'dark' ? '#fafafa' : '#09090b'
    }).then(r => { if (r.isConfirmed) navigateTo('pricing'); });
    return;
  }
  state.selectedMentor = mentorId;
  navigateTo('session-booking');
};
