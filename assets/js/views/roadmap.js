window.renderRoadmapView = function renderRoadmapView() {
  if (!ensureResultsOrPrompt()) return '';
  const track     = getCurrentTrack();
  const steps     = ROADMAP[state.selectedTrack];
  const lang      = state.language;
  const isAr      = lang === 'ar';
  const isPremium = state.premiumUnlocked;
  const hasSubtrack = !!(state.subtestComplete && state.subTrackResult);

  const totalSteps = steps.length;
  const doneSteps  = steps.filter(s => !!state.roadmapProgress[`${state.selectedTrack}_${s.step}`]).length;
  const pct        = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  const trackColors = { power: '#2563eb', embedded: '#7c3aed', communications: '#059669' };
  const accentColor = trackColors[state.selectedTrack] || 'var(--accent)';

  // Subtrack label for header
  let subtrackLabel = '';
  if (hasSubtrack && window.SUBTRACK_PLATFORMS) {
    const pf = window.SUBTRACK_PLATFORMS[state.subTrackResult];
    if (pf) subtrackLabel = isAr ? pf.nameAr : pf.nameEn;
  }

  return `
    <div style="display:grid;gap:1.25rem;">

      <!-- Header card -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="page-header">
          <div>
            <div class="eyebrow">${isAr ? 'مسار التطور' : 'Roadmap'}</div>
            <h2 class="section-title" style="margin-top:.5rem;">${track.title[lang]}</h2>
            ${hasSubtrack && subtrackLabel ? `
              <div style="display:inline-flex;align-items:center;gap:.4rem;margin-top:.45rem;
                padding:.28rem .7rem;border-radius:99px;
                background:${accentColor}18;border:1px solid ${accentColor}44;">
                <i data-lucide="target" style="width:.7rem;height:.7rem;color:${accentColor};"></i>
                <span style="font-size:.78rem;font-weight:700;color:${accentColor};">${isAr ? 'تخصصك: ' : 'Sub-track: '}${subtrackLabel}</span>
              </div>` : ''}
            <p class="text-muted" style="margin-top:.5rem;font-size:.88rem;line-height:1.7;">
              ${isPremium
                ? (isAr ? 'جميع الخطوات مفتوحة — تابع تقدمك خطوة بخطوة.' : 'All steps unlocked — work through them one by one.')
                : (isAr ? 'أول خطوتين مجانيتين. فعّل Premium للوصول الكامل.' : 'First 2 steps are free. Upgrade to unlock the full roadmap.')}
            </p>
          </div>
          <div style="display:flex;flex-direction:column;gap:.6rem;align-items:flex-end;">
            ${isPremium
              ? `<span class="badge badge-accent" style="display:inline-flex;align-items:center;gap:.35rem;">
                  <i data-lucide="shield-check" style="width:.75rem;height:.75rem;"></i>
                  ${isAr ? 'Premium مفعّل' : 'Premium active'}
                </span>
                <button class="btn btn-secondary" onclick="navigateTo('session-booking')">
                  <i data-lucide="calendar-days" style="width:.8rem;height:.8rem;"></i>
                  ${isAr ? 'احجز جلسة' : 'Book a Session'}
                </button>`
              : `<button class="btn btn-primary" onclick="openPremiumLock('roadmap')">
                  <i data-lucide="crown" style="width:.8rem;height:.8rem;"></i>
                  ${isAr ? 'افتح المسار كاملاً' : 'Unlock Full Roadmap'}
                </button>`
            }
          </div>
        </div>

        <!-- Subtrack recommendation banner -->
        ${!hasSubtrack && isPremium ? `
          <div style="margin-top:1rem;display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;
            background:${accentColor}0d;border:1px solid ${accentColor}33;border-radius:10px;flex-wrap:wrap;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:.5rem;">
              <i data-lucide="flask-conical" style="width:.9rem;height:.9rem;color:${accentColor};"></i>
              <span style="font-size:.84rem;font-weight:600;">${isAr ? 'حدد تخصصك الدقيق لمسار أكثر دقة' : 'Take the sub-track test for a more focused roadmap'}</span>
            </div>
            <button class="btn btn-secondary" style="font-size:.8rem;" onclick="navigateTo('subtrack-test')">
              ${isAr ? 'ابدأ الاختبار' : 'Start Test'}
            </button>
          </div>
        ` : ''}

        <!-- Progress bar -->
        <div style="margin-top:1.2rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;">
            <span style="font-size:.78rem;color:var(--text-muted);font-weight:600;">
              ${isAr ? `${doneSteps} من ${totalSteps} خطوة مكتملة` : `${doneSteps} of ${totalSteps} steps done`}
            </span>
            <span style="font-size:.82rem;font-weight:800;color:${accentColor};">${pct}%</span>
          </div>
          <div style="background:var(--border);border-radius:99px;height:7px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${accentColor};border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1);"></div>
          </div>
        </div>
      </div>

      <!-- Steps -->
      <div style="display:grid;gap:.85rem;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));">
        ${steps.map((step, idx) => {
          const done   = !!state.roadmapProgress[`${state.selectedTrack}_${step.step}`];
          const locked = !isPremium && idx > 1;
          const isCurrent = !done && !locked && idx === steps.findIndex(s => !state.roadmapProgress[`${state.selectedTrack}_${s.step}`]);

          const statusBadge = done
            ? `<span class="badge badge-success" style="display:inline-flex;align-items:center;gap:.3rem;">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                ${isAr ? 'مكتملة' : 'Done'}
               </span>`
            : locked
            ? `<span class="badge" style="background:rgba(100,116,139,.12);color:var(--text-muted);display:inline-flex;align-items:center;gap:.3rem;">
                <i data-lucide="lock" style="width:.65rem;height:.65rem;"></i>
                ${isAr ? 'مقفولة' : 'Locked'}
               </span>`
            : isCurrent
            ? `<span class="badge badge-accent" style="display:inline-flex;align-items:center;gap:.3rem;">
                <i data-lucide="navigation" style="width:.65rem;height:.65rem;"></i>
                ${isAr ? 'الحالية' : 'Current'}
               </span>`
            : `<span class="badge" style="background:rgba(100,116,139,.08);color:var(--text-muted);">${isAr ? 'قادمة' : 'Up next'}</span>`;

          return `
            <div
              class="surface-panel"
              style="overflow:hidden;${locked ? 'opacity:.55;' : ''}border-${isAr ? 'right' : 'left'}:3px solid ${done ? '#22c55e' : locked ? 'var(--border)' : accentColor};"
              data-aos="fade-up"
              data-aos-delay="${idx * 60}">
              <div class="section-pad" style="padding-bottom:.75rem;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem;">
                  <span style="font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${accentColor};">
                    ${isAr ? `الخطوة ${step.step}` : `Step ${step.step}`}
                  </span>
                  ${statusBadge}
                </div>
                <div style="font-size:1rem;font-weight:800;line-height:1.45;margin-bottom:.55rem;">
                  ${locked
                    ? `<span style="display:inline-flex;align-items:center;gap:.4rem;">
                        <i data-lucide="lock" style="width:.8rem;height:.8rem;color:var(--text-muted);"></i>
                        ${isAr ? 'خطوة Premium' : 'Premium step'}
                       </span>`
                    : step.title[lang]
                  }
                </div>
                ${!locked ? `<p class="text-muted" style="font-size:.85rem;line-height:1.7;">${step.note[lang]}</p>` : `<p class="text-muted" style="font-size:.85rem;">${isAr ? 'فعّل Premium لرؤية هذه الخطوة.' : 'Upgrade to Premium to unlock this step.'}</p>`}
              </div>
              <div style="padding:.75rem 1rem;border-top:1px solid var(--border);display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;">
                ${locked
                  ? `<button class="btn btn-primary" style="font-size:.82rem;" onclick="openPremiumLock('roadmap')">
                      <i data-lucide="crown" style="width:.8rem;height:.8rem;"></i>
                      ${isAr ? 'افتح Premium' : 'Unlock Premium'}
                     </button>`
                  : `<button
                      class="btn ${done ? 'btn-secondary' : 'btn-primary'}"
                      style="font-size:.82rem;"
                      onclick="completeRoadmapStep('${state.selectedTrack}',${step.step})">
                      ${done
                        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${isAr ? 'مكتملة' : 'Completed'}`
                        : `<i data-lucide="check" style="width:.8rem;height:.8rem;"></i>${step.action[lang]}`
                      }
                     </button>
                     <button class="btn btn-ghost" style="font-size:.82rem;" onclick="navigateTo('platforms')">
                      ${isAr ? 'ابدأ التعلم' : 'Start Learning'}
                     </button>`
                }
                ${!locked ? `
                  <button
                    class="btn btn-ghost"
                    style="font-size:.78rem;margin-${isAr ? 'right' : 'left'}:auto;color:var(--accent);"
                    onclick="navigateTo('${isPremium ? 'chat' : 'mentors'}')">
                    <i data-lucide="message-circle" style="width:.75rem;height:.75rem;"></i>
                    ${isAr ? (isPremium ? 'شات المرشد' : 'اسأل مرشداً') : (isPremium ? 'Ask mentor' : 'Find mentor')}
                  </button>
                ` : ''}
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Bottom CTA -->
      <div class="surface-soft section-pad" style="border:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;" data-aos="fade-up">
        <div style="display:flex;gap:.75rem;align-items:center;">
          <div style="width:2.4rem;height:2.4rem;border-radius:10px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i data-lucide="target" style="width:1rem;height:1rem;color:var(--accent);"></i>
          </div>
          <div>
            <div style="font-weight:700;font-size:.93rem;">${isAr ? 'تابع تقدمك' : 'Track your progress'}</div>
            <p class="text-muted" style="font-size:.82rem;margin-top:.1rem;">${isAr ? 'كل خطوة تكملها تُسجَّل في صفحة تقدمك.' : 'Every completed step is logged in your progress page.'}</p>
          </div>
        </div>
        <button class="btn btn-secondary" onclick="navigateTo('progress')">
          ${isAr ? 'شوف تقدمي' : 'View Progress'}
        </button>
      </div>

    </div>
  `;
};
