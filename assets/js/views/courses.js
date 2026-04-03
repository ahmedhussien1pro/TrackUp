window.renderCoursesView = function renderCoursesView() {
  if (!ensureResultsOrPrompt()) return '';
  const isAr     = state.language === 'ar';
  const track    = getCurrentTrack();
  const list     = COURSES[state.selectedTrack] || [];
  const isPremium = state.premiumUnlocked;

  // Career insights data (simulated per track)
  const careerInsights = {
    embedded: {
      salaryEn: 'EGP 15,000 – 45,000 / month', salaryAr: '15,000 – 45,000 جنيه / شهر',
      demandEn: 'Very High', demandAr: 'مرتفع جداً',
      timeEn: '6 – 12 months to job-ready', timeAr: '6 – 12 شهر للوصول لسوق العمل',
      rolesEn: ['Firmware Engineer', 'RTOS Developer', 'BSP Engineer'],
      rolesAr: ['مهندس Firmware', 'مطور RTOS', 'مهندس BSP']
    },
    power: {
      salaryEn: 'EGP 12,000 – 40,000 / month', salaryAr: '12,000 – 40,000 جنيه / شهر',
      demandEn: 'High', demandAr: 'مرتفع',
      timeEn: '8 – 14 months to job-ready', timeAr: '8 – 14 شهر للوصول لسوق العمل',
      rolesEn: ['Power Systems Engineer', 'Protection Engineer', 'Substation Designer'],
      rolesAr: ['مهندس شبكات قوى', 'مهندس حماية', 'مصمم محطات']
    },
    communications: {
      salaryEn: 'EGP 14,000 – 42,000 / month', salaryAr: '14,000 – 42,000 جنيه / شهر',
      demandEn: 'High', demandAr: 'مرتفع',
      timeEn: '7 – 13 months to job-ready', timeAr: '7 – 13 شهر للوصول لسوق العمل',
      rolesEn: ['RF Engineer', 'Telecom Engineer', 'Network Planner'],
      rolesAr: ['مهندس RF', 'مهندس اتصالات', 'مخطط شبكات']
    }
  };
  const ci = careerInsights[state.selectedTrack] || careerInsights.embedded;

  const freeCourses  = list.filter(c => c.badge === 'Free');
  const paidCourses  = list.filter(c => c.badge !== 'Free');
  const totalStarted = list.filter((_, idx) => state.startedCourseIds.includes(`${state.selectedTrack}_${idx}`)).length;
  const pct          = list.length ? Math.round((totalStarted / list.length) * 100) : 0;

  function renderCourseCard(course, idx, locked) {
    const cid     = `${state.selectedTrack}_${idx}`;
    const started = state.startedCourseIds.includes(cid);
    return `
      <div class="surface-soft section-pad" data-aos="fade-up" data-aos-delay="${idx * 60}"
        style="border:1px solid ${started ? 'rgba(34,197,94,.25)' : 'var(--border)'};
          border-radius:14px;opacity:${locked ? '.55' : '1'};position:relative;overflow:hidden;">
        ${locked ? `
          <div style="position:absolute;inset:0;background:var(--surface-2);opacity:.45;z-index:1;border-radius:14px;"></div>
          <div style="position:absolute;top:.7rem;${isAr ? 'left' : 'right'}:.7rem;z-index:2;">
            <span class="badge" style="display:inline-flex;align-items:center;gap:.3rem;background:rgba(100,116,139,.15);color:var(--text-muted);">
              <i data-lucide="lock" style="width:.65rem;height:.65rem;"></i>
              ${isAr ? 'Premium' : 'Premium'}
            </span>
          </div>` : ''}
        <div style="position:relative;z-index:1;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;margin-bottom:.6rem;">
            <div>
              <div class="eyebrow" style="margin-bottom:.3rem;">${course.level}</div>
              <div style="font-weight:800;font-size:1rem;line-height:1.4;">${course.name[isAr ? 'ar' : 'en']}</div>
            </div>
            <span class="badge ${course.badge === 'Free' ? 'badge-success' : 'badge-accent'}" style="flex-shrink:0;">
              ${course.badge === 'Free' ? (isAr ? 'مجاني' : 'Free') : (isAr ? 'بريميوم' : 'Premium')}
            </span>
          </div>
          <p class="text-muted" style="font-size:.84rem;line-height:1.75;margin-bottom:.9rem;">${course.note[isAr ? 'ar' : 'en']}</p>
          ${started ? `
            <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.7rem;font-size:.8rem;color:#16a34a;font-weight:600;">
              <i data-lucide="check-circle" style="width:.85rem;height:.85rem;color:#16a34a;"></i>
              ${isAr ? 'بدأت الدراسة' : 'Learning started'}
            </div>` : ''}
          ${locked
            ? `<button class="btn btn-primary" style="width:100%;font-size:.85rem;" onclick="navigateTo('pricing')">
                <i data-lucide="crown" style="width:.8rem;height:.8rem;"></i>
                ${isAr ? 'افتح بالبريميوم' : 'Unlock with Premium'}
               </button>`
            : `<button class="btn ${started ? 'btn-secondary' : 'btn-primary'}" style="width:100%;font-size:.85rem;"
                onclick="startCourse('${cid}')">
                <i data-lucide="${started ? 'check' : 'play-circle'}" style="width:.8rem;height:.8rem;"></i>
                ${started ? (isAr ? 'مكتملة' : 'Completed') : (isAr ? 'ابدأ الكورس' : 'Start Course')}
               </button>`
          }
        </div>
      </div>
    `;
  }

  return `
    <div style="display:grid;gap:1.4rem;">

      <!-- Header -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="page-header">
          <div>
            <div class="eyebrow">${t('coursesTitle')}</div>
            <h2 class="section-title" style="margin-top:.5rem;">${track.title[isAr ? 'ar' : 'en']} — ${t('coursesTitle')}</h2>
            <p class="text-muted" style="margin-top:.6rem;">${isAr ? 'ابدأ مسارك من الصفر وتعلم خطوة بخطوة.' : 'Start your track from scratch and learn step by step.'}</p>
          </div>
          <button class="btn btn-secondary" onclick="navigateTo('progress')">${t('viewProgress')}</button>
        </div>

        <!-- Progress bar -->
        <div style="margin-top:1.2rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;">
            <span style="font-size:.78rem;color:var(--text-muted);font-weight:600;">${isAr ? `${totalStarted} من ${list.length} كورس بدأت` : `${totalStarted} of ${list.length} courses started`}</span>
            <span style="font-size:.82rem;font-weight:800;color:var(--accent);">${pct}%</span>
          </div>
          <div style="background:var(--border);border-radius:99px;height:7px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px;transition:width .5s ease;"></div>
          </div>
        </div>
      </div>

      <!-- Career Insights (Premium gate) -->
      <div class="surface-panel section-pad" data-aos="fade-up" style="border:1.5px solid ${isPremium ? 'rgba(34,197,94,.25)' : 'var(--border)'}">
        <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;">
          <i data-lucide="${isPremium ? 'trending-up' : 'lock'}" style="width:1rem;height:1rem;color:${isPremium ? '#16a34a' : 'var(--accent)'};"></i>
          <span style="font-weight:700;">${isAr ? 'مستقبل المجال' : 'Career Insights'}</span>
          ${isPremium ? `<span class="badge badge-success" style="font-size:.7rem;">${isAr ? 'بريميوم' : 'Premium'}</span>` : ''}
        </div>
        ${isPremium ? `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:.75rem;">
            <div style="background:var(--surface-2);border-radius:10px;padding:.75rem;">
              <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.3rem;">${isAr ? 'الراتب المتوقع' : 'Expected Salary'}</div>
              <div style="font-weight:800;font-size:.88rem;color:var(--accent);">${ci[isAr ? 'salaryAr' : 'salaryEn']}</div>
            </div>
            <div style="background:var(--surface-2);border-radius:10px;padding:.75rem;">
              <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.3rem;">${isAr ? 'الطلب في السوق' : 'Market Demand'}</div>
              <div style="font-weight:800;font-size:.88rem;color:#16a34a;">${ci[isAr ? 'demandAr' : 'demandEn']}</div>
            </div>
            <div style="background:var(--surface-2);border-radius:10px;padding:.75rem;">
              <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.3rem;">${isAr ? 'وقت التحضير' : 'Time to Ready'}</div>
              <div style="font-weight:800;font-size:.88rem;">${ci[isAr ? 'timeAr' : 'timeEn']}</div>
            </div>
          </div>
          <div style="margin-top:.9rem;">
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:.45rem;">${isAr ? 'وظائف شائعة' : 'Common Roles'}</div>
            <div style="display:flex;flex-wrap:wrap;gap:.4rem;">
              ${(ci[isAr ? 'rolesAr' : 'rolesEn']).map(r => `<span class="mentor-tag" style="font-size:.78rem;">${r}</span>`).join('')}
            </div>
          </div>
        ` : `
          <p class="text-muted" style="font-size:.86rem;line-height:1.7;margin-bottom:.85rem;">${isAr ? 'فعّل بريميوم لتشوف الرواتب المتوقعة، الطلب في السوق، والوظائف الأكثر شيوعاً في مسارك.' : 'Upgrade to Premium to see expected salaries, market demand, and the most common roles in your track.'}</p>
          <button class="btn btn-primary" style="font-size:.85rem;" onclick="navigateTo('pricing')">
            <i data-lucide="crown" style="width:.8rem;height:.8rem;"></i>
            ${isAr ? 'افتح Insights' : 'Unlock Insights'}
          </button>
        `}
      </div>

      <!-- Free Courses -->
      ${freeCourses.length ? `
        <div data-aos="fade-up">
          <div class="eyebrow" style="margin-bottom:.75rem;display:flex;align-items:center;gap:.5rem;">
            <i data-lucide="gift" style="width:.8rem;height:.8rem;color:#16a34a;"></i>
            ${isAr ? 'كورسات مجانية' : 'Free Courses'}
          </div>
          <div style="display:grid;gap:.85rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
            ${freeCourses.map((c, i) => renderCourseCard(c, list.indexOf(c), false)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Premium Courses -->
      ${paidCourses.length ? `
        <div data-aos="fade-up">
          <div class="eyebrow" style="margin-bottom:.75rem;display:flex;align-items:center;gap:.5rem;">
            <i data-lucide="crown" style="width:.8rem;height:.8rem;color:var(--accent);"></i>
            ${isAr ? 'كورسات بريميوم' : 'Premium Courses'}
          </div>
          <div style="display:grid;gap:.85rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
            ${paidCourses.map((c, i) => renderCourseCard(c, list.indexOf(c), !isPremium)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Upgrade CTA (non-premium) -->
      ${!isPremium ? `
        <div class="surface-soft section-pad" style="text-align:center;border:1.5px solid var(--border);" data-aos="fade-up">
          <i data-lucide="sparkles" style="width:1.4rem;height:1.4rem;color:var(--accent);margin-bottom:.6rem;"></i>
          <div style="font-weight:800;font-size:1rem;margin-bottom:.45rem;">${isAr ? 'افتح كل الكورسات + Career Insights' : 'Unlock All Courses + Career Insights'}</div>
          <p class="text-muted" style="font-size:.85rem;line-height:1.7;max-width:420px;margin:0 auto .9rem;">${isAr ? 'بريميوم بيفتحلك كل الكورسات، رواتب السوق، ومكتبة الجلسات المسجلة.' : 'Premium unlocks all courses, market salary data, and the recorded sessions library.'}</p>
          <button class="btn btn-primary" onclick="navigateTo('pricing')">
            <i data-lucide="crown" style="width:.85rem;height:.85rem;"></i>
            ${isAr ? 'اشترك الآن' : 'Upgrade Now'}
          </button>
        </div>
      ` : ''}

    </div>
  `;
};
