// roadmap.js — UC8: contextual mentor CTA on each step
window.renderRoadmapView = function renderRoadmapView() {
  if (!ensureResultsOrPrompt()) return '';
  const track     = getCurrentTrack();
  const steps     = ROADMAP[state.selectedTrack];
  const lang      = state.language;
  const isAr      = lang === 'ar';
  const isPremium = state.premiumUnlocked;

  const headerCTA = isPremium
    ? `<div style="display:flex;align-items:center;gap:.5rem;">
        <span class="badge badge-accent" style="display:inline-flex;align-items:center;gap:.3rem;">
          <i data-lucide="shield-check" style="width:.7rem;height:.7rem;"></i>
          ${isAr?'مفعّل':'Premium active'}
        </span>
        <button class="btn btn-secondary" onclick="navigateTo('session-booking')">${t('bookSession')}</button>
      </div>`
    : `<button class="btn btn-secondary" onclick="openPremiumLock('pricing')">${t('unlockFullAnalysis')}</button>`;

  const quickLinks = [
    {id:'platforms',       icon:'layout-grid',   labelEn:'Learning Platforms',labelAr:'منصات التعلم'},
    {id:'progress',        icon:'target',        labelEn:'My Progress',       labelAr:'تقدمي'},
    {id:'mentors',         icon:'users-round',   labelEn:'Mentors',           labelAr:'المرشدون'},
    {id:'session-booking', icon:'calendar-days', labelEn:'Book a Session',    labelAr:'احجز جلسة', lock:!isPremium},
    {id:'chat',            icon:'message-square',labelEn:'Mentor Chat',       labelAr:'شات المرشد', lock:!isPremium},
  ];

  // overall roadmap progress bar
  const totalSteps = steps.length;
  const doneSteps  = steps.filter(s => !!state.roadmapProgress[`${state.selectedTrack}_${s.step}`]).length;
  const pct        = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return `
    <div style="display:grid;gap:1.25rem;">

      <section class="surface-panel section-pad">
        <div class="page-header" data-aos="fade-up">
          <div>
            <div class="eyebrow">${t('roadmapTitle')}</div>
            <h2 class="section-title" style="margin-top:.6rem;">${track.title[lang]} — ${t('roadmapTitle')}</h2>
            <p class="text-muted" style="margin-top:.8rem;">${isPremium?(isAr?'جميع الخطوات مفتوحة.':'All steps unlocked.'):t('roadmapPreview')}</p>
          </div>
          ${headerCTA}
        </div>

        <!-- overall progress bar -->
        <div style="margin-top:1.1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem;">
            <span style="font-size:.78rem;color:var(--text-muted);font-weight:600;">
              ${isAr?`تقدمك: ${doneSteps}/${totalSteps} خطوة`:`Progress: ${doneSteps}/${totalSteps} steps`}
            </span>
            <span style="font-size:.78rem;font-weight:800;color:var(--accent);">${pct}%</span>
          </div>
          <div style="background:var(--border);border-radius:99px;height:6px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px;transition:width .5s ease;"></div>
          </div>
        </div>
      </section>

      <!-- steps grid -->
      <section style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
        ${steps.map((step, idx) => {
          const done   = !!state.roadmapProgress[`${state.selectedTrack}_${step.step}`];
          const locked = !isPremium && idx > 1;

          // UC8 — mentor CTA for unlocked steps
          const mentorCTA = !locked ? `
            <div style="margin-top:.85rem;padding-top:.85rem;border-top:1px solid var(--border);
              display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:.4rem;">
                <i data-lucide="message-circle" style="width:.82rem;height:.82rem;color:var(--text-muted);flex-shrink:0;"></i>
                <span style="font-size:.76rem;color:var(--text-muted);line-height:1.4;">
                  ${isAr
                    ? `عندك سؤال في «${step.title[lang]}»؟`
                    : `Stuck on “${step.title[lang]}”?`
                  }
                </span>
              </div>
              <button
                onclick="navigateTo('${isPremium?'chat':'mentors'}')" 
                style="background:none;border:1px solid var(--border);border-radius:8px;
                  padding:.28rem .65rem;cursor:pointer;font-size:.75rem;
                  color:var(--accent);font-weight:600;white-space:nowrap;
                  transition:border-color .15s,background .15s;"
                onmouseover="this.style.background='var(--accent-soft)';this.style.borderColor='var(--accent)';"
                onmouseout="this.style.background='none';this.style.borderColor='var(--border)';">
                <i data-lucide="users-round" style="width:.75rem;height:.75rem;vertical-align:-.1em;"></i>
                ${isAr
                  ? (isPremium?'شات المرشد':'تواصل مع مرشد')
                  : (isPremium?'Chat mentor':'Ask a mentor')
                }
              </button>
            </div>` : '';

          return `
            <div class="step-card ${locked?'locked':''}" data-aos="fade-up" data-aos-delay="${idx*70}">
              <div class="page-header">
                <div>
                  <div class="eyebrow">${isAr?`الخطوة ${step.step}`:`Step ${step.step}`}</div>
                  <div style="font-size:1.15rem;font-weight:800;margin-top:.45rem;">${step.title[lang]}</div>
                </div>
                <div class="badge ${done?'badge-success':locked?'badge-accent':''}">
                  ${done?t('completed'):locked?t('locked'):idx===0?t('current'):t('upcoming')}
                </div>
              </div>
              <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${step.note[lang]}</p>
              <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem;">
                ${locked
                  ? `<button class="btn btn-primary" onclick="openPremiumLock('roadmap')">${t('upgradeNow')}</button>`
                  : `<button class="btn ${done?'btn-secondary':'btn-primary'}" onclick="completeRoadmapStep('${state.selectedTrack}',${step.step})">${done?t('completed'):step.action[lang]}</button>`
                }
                <button class="btn btn-ghost" onclick="navigateTo('platforms')">${t('startLearning')}</button>
              </div>
              ${mentorCTA}
            </div>`;
        }).join('')}
      </section>

      ${renderQuickLinks(quickLinks)}
    </div>
  `;
};
