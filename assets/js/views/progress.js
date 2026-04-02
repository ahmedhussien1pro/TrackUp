window.renderProgressView = function renderProgressView() {
  const isAr = state.language === 'ar';
  const next = nextRecommendedStep();
  const sessionDone  = state.completedMilestones.sessionBooked;
  const premiumDone  = state.premiumUnlocked;
  const subtrackDone = state.subtestComplete;

  // Extended milestone list for display
  const displayMilestones = [
    { key:'profileCompleted', icon:'user-round',    labelEn:'Profile complete',          labelAr:'الملف الشخصي مكتمل' },
    { key:'testCompleted',    icon:'clipboard-list', labelEn:'Assessment done',            labelAr:'التقييم مكتمل' },
    { key:'resultsViewed',    icon:'bar-chart-3',   labelEn:'Results reviewed',           labelAr:'تمت مراجعة النتائج' },
    { key:'detailsOpened',    icon:'layers-3',      labelEn:'Track details explored',     labelAr:'تفاصيل المسار مفتوحة' },
    { key:'roadmapStarted',   icon:'route',         labelEn:'Roadmap started',            labelAr:'بدأت خارطة التطور' },
    { key:'courseStarted',    icon:'layout-grid',   labelEn:'Learning platforms explored', labelAr:'استكشفت منصات التعلم' },
    { key:'premiumUnlocked',  icon:'shield-check',  labelEn:'Premium unlocked',           labelAr:'اشتركت في البريميوم' },
    { key:'sessionBooked',    icon:'calendar-days', labelEn:'Mentor session booked',      labelAr:'جلسة المرشد محجوزة' },
    { key:'subtestComplete',  icon:'flask-conical', labelEn:'Sub-track test done',        labelAr:'اختبار التخصص الدقيق مكتمل',  custom: subtrackDone },
    { key:'subTrackResult',   icon:'target',        labelEn:'Exact specialization found', labelAr:'وجدت تخصصك الدقيق',            custom: !!(state.subTrackResult) }
  ];

  const totalMilestones = displayMilestones.length;
  const doneMilestones  = displayMilestones.filter(m =>
    m.custom !== undefined ? m.custom : !!state.completedMilestones[m.key]
  ).length;
  const pct = Math.round((doneMilestones / totalMilestones) * 100);

  return `
    <section style="display:grid;gap:1.25rem;">
      ${renderProgressStrip()}

      <div class="page-grid-2">
        <!-- Left: progress ring + next step -->
        <div class="surface-panel section-pad" data-aos="fade-up">
          <div class="page-header">
            <div>
              <div class="eyebrow">${t('progressTitle')}</div>
              <h2 class="section-title" style="margin-top:.6rem;">${t('progressTitle')}</h2>
              <p class="text-muted" style="margin-top:.8rem;">${t('progressDesc')}</p>
            </div>
            ${renderMetricRing(pct, t('progressTitle'))}
          </div>
          <div class="surface-soft section-pad" style="margin-top:1.25rem;">
            <div class="eyebrow">${t('topAction')}</div>
            <div style="font-size:1.15rem;font-weight:800;margin-top:.6rem;">${next.label}</div>
            <button class="btn btn-primary" style="margin-top:1rem;" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
          </div>
        </div>

        <!-- Right: profile snapshot -->
        <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="80">
          <div class="eyebrow">${t('profile')}</div>
          <div style="font-weight:800;font-size:1.15rem;margin-top:.7rem;">${state.profile.fullName ? safeProfileName() : t('noProfile')}</div>
          <div class="text-muted" style="margin-top:.45rem;">${state.profile.college || ''}</div>
          ${premiumDone
            ? `<div style="display:inline-flex;align-items:center;gap:.4rem;margin-top:.85rem;padding:.35rem .75rem;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);border-radius:8px;">
                <i data-lucide="shield-check" style="width:.85rem;height:.85rem;color:#22c55e;"></i>
                <span style="font-size:.82rem;font-weight:700;color:#22c55e;">${isAr ? 'عضو بريميوم' : 'Premium Member'}</span>
               </div>`
            : `<div class="text-muted" style="margin-top:.85rem;font-size:.85rem;">${isAr ? 'خطة مجانية' : 'Free plan'}</div>`
          }
          <div class="text-muted" style="margin-top:.85rem;">${isAr ? 'المرحلة الحالية' : 'Current stage'}: <strong>${next.label}</strong></div>
        </div>
      </div>

      <!-- Sub-track CTA — shown after session -->
      ${sessionDone && !subtrackDone ? `
        <div class="surface-panel section-pad" style="border:1.5px solid var(--accent);" data-aos="fade-up">
          <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;justify-content:space-between;">
            <div>
              <div class="eyebrow" style="color:var(--accent);margin-bottom:.4rem;">${isAr ? 'جاهز للخطوة التالية' : 'Ready for your next step'}</div>
              <div style="font-weight:800;font-size:1.05rem;">${isAr ? 'حضرت الجلسة — حدد تخصصك الدقيق الآن' : 'Session done — now find your exact sub-track'}</div>
              <p class="text-muted" style="font-size:.87rem;margin-top:.35rem;line-height:1.65;max-width:480px;">${isAr
                ? '20 سؤال سريع يوضحلك بالضبط التخصص الفرعي الأنسب لك.'
                : '20 focused questions will pinpoint your exact specialization automatically.'}</p>
            </div>
            <button class="btn btn-primary" onclick="navigateTo('subtrack-test')">
              ${isAr ? 'ابدأ الاختبار' : 'Start Sub-track Test'}
            </button>
          </div>
        </div>
      ` : ''}

      ${subtrackDone && state.subTrackResult ? `
        <div class="surface-panel section-pad" style="border:1.5px solid #22c55e;" data-aos="fade-up">
          <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;justify-content:space-between;">
            <div>
              <div class="eyebrow" style="color:#22c55e;margin-bottom:.4rem;">${isAr ? 'تخصصك الدقيق' : 'Your exact sub-track'}</div>
              <div style="font-weight:800;font-size:1.15rem;">${state.subTrackResult}</div>
              <p class="text-muted" style="font-size:.85rem;margin-top:.35rem;line-height:1.65;">${isAr ? 'هذا هو تخصصك الفرعي المحدد — ابدأ المسار الآن.' : 'This is your pinpointed specialization — start your focused path now.'}</p>
            </div>
            <button class="btn btn-secondary" onclick="navigateTo('sub-track-result')">
              ${isAr ? 'شوف تفاصيل التخصص' : 'View Sub-track Details'}
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Milestones list -->
      <div class="surface-panel section-pad">
        <div class="page-header" data-aos="fade-up">
          <div>
            <div class="eyebrow">${t('progressSnapshot')}</div>
            <div style="font-size:1.35rem;font-weight:800;margin-top:.55rem;">${t('continueJourney')}</div>
          </div>
          <button class="btn btn-secondary" onclick="navigateTo('${next.view}')">${t('startNow')}</button>
        </div>
        <div style="display:grid;gap:.75rem;margin-top:1rem;">
          ${displayMilestones.map(m => {
            const done = m.custom !== undefined ? m.custom : !!state.completedMilestones[m.key];
            return `
              <div style="display:flex;align-items:center;gap:.75rem;padding:.65rem .85rem;background:var(--surface-2);border-radius:12px;border:1px solid ${done ? 'rgba(34,197,94,.2)' : 'var(--border)'};">
                <div style="width:2rem;height:2rem;border-radius:8px;background:${done ? 'rgba(34,197,94,.12)' : 'var(--surface-3)'};border:1px solid ${done ? 'rgba(34,197,94,.25)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i data-lucide="${done ? 'check' : m.icon}" style="width:.85rem;height:.85rem;color:${done ? '#22c55e' : 'var(--text-muted)'};"></i>
                </div>
                <span style="font-size:.88rem;font-weight:${done ? '700' : '400'};color:${done ? 'var(--text-primary)' : 'var(--text-muted)'};">${
                  isAr ? m.labelAr : m.labelEn
                }</span>
                ${done ? `<i data-lucide="check-circle" style="width:.85rem;height:.85rem;color:#22c55e;margin-inline-start:auto;flex-shrink:0;"></i>` : ''}
              </div>`;
          }).join('')}
        </div>
      </div>
    </section>
  `;
};
