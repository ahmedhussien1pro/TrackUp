import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';

// Work style indicators per track
const WORK_STYLE = {
  frontend: {
    en: ['Visual & Output-Driven', 'Iterative Builder', 'Detail-Oriented', 'Loves Fast Feedback'],
    ar: ['مدفوع بالمخرجات البصرية', 'مبني بشكل تكراري', 'يهتم بالتفاصيل', 'يحب التغذية الراجعة السريعة'],
  },
  backend: {
    en: ['Systems Thinker', 'Logic-First', 'Reliability Focused', 'Thrives at Scale'],
    ar: ['مفكر منظومي', 'المنطق أولاً', 'مركّز على الاطمئنان', 'يزدهر على النطاق الواسع'],
  },
  data: {
    en: ['Evidence-Based', 'Pattern Seeker', 'Curious & Rigorous', 'Story-Driven Insight'],
    ar: ['مبني على الأدلة', 'باحث عن الأنماط', 'فضولي ومنهجي', 'رؤى مدفوعة بالسرد'],
  },
  ux: {
    en: ['Empathy-Led', 'User-Obsessed', 'Visual & Intuitive', 'Research-Driven'],
    ar: ['قائد بالتعاطف', 'مهووس بالمستخدم', 'بصري وبديهي', 'مدفوع بالبحث'],
  },
  devops: {
    en: ['Automation-First', 'Systems Architect', 'Reliability Engineer', 'Process Optimizer'],
    ar: ['الأتمتة أولاً', 'مهندس أنظمة', 'مهندس اطمئنان', 'محسّن العمليات'],
  },
};

// Preference signals to show what user cares about
const PREFERENCES = {
  frontend: {
    en: { builds: 'Visual interfaces & animations', avoids: 'Database design & DevOps', thrives: 'Creative & fast-moving teams' },
    ar: { builds: 'الواجهات المرئية والحركات', avoids: 'تصميم قواعد البيانات وDevOps', thrives: 'الفرق الإبداعية سريعة الإيقاع' },
  },
  backend: {
    en: { builds: 'APIs, databases & infrastructure', avoids: 'UI design & pixel work', thrives: 'Complex technical challenges' },
    ar: { builds: 'الواجهات البرمجية وقواعد البيانات', avoids: 'تصميم الواجهة البصرية', thrives: 'التحديات التقنية المعقدة' },
  },
  data: {
    en: { builds: 'Dashboards, models & analysis', avoids: 'Front-end styling & DevOps', thrives: 'Data-heavy, insight-focused work' },
    ar: { builds: 'لوحات التحكم والنماذج والتحليل', avoids: 'تنسيق الواجهة وDevOps', thrives: 'العمل المكثف بالبيانات' },
  },
  ux: {
    en: { builds: 'Prototypes, flows & research', avoids: 'Backend architecture & data models', thrives: 'User-centric, design-forward teams' },
    ar: { builds: 'النماذج والتدفقات والبحث', avoids: 'البنية الخلفية ونماذج البيانات', thrives: 'الفرق المتمحورة حول المستخدم' },
  },
  devops: {
    en: { builds: 'Pipelines, automation & monitoring', avoids: 'Product design & UX research', thrives: 'High-reliability, infrastructure teams' },
    ar: { builds: 'المسارات والأتمتة والمراقبة', avoids: 'تصميم المنتج وبحث UX', thrives: 'فرق البنية التحتية عالية الاطمئنان' },
  },
};

function _dimBar(label, pct, color) {
  return `
    <div class="ds-dim">
      <div class="ds-dim__header">
        <span class="ds-dim__label">${label}</span>
        <span class="ds-dim__pct ltr-text">${pct}%</span>
      </div>
      <div class="ds-dim__track">
        <div class="ds-dim__fill" data-pct="${pct}" style="width:0%;background:${color}"></div>
      </div>
    </div>`;
}

export function DecisionSummary() {
  const result   = TestService.getResult();
  const lang     = document.documentElement.getAttribute('lang') || 'en';
  const isAr     = lang === 'ar';

  if (!result) {
    return `<div class="empty-state">
      <h3>${isAr ? 'لا توجد نتائج' : 'No results found'}</h3>
      <p>${isAr ? 'أكمل التقييم أولاً' : 'Complete the assessment first'}</p>
      <a href="#/test" class="btn btn--primary">${isAr ? 'ابدأ التقييم' : 'Start Assessment'}</a>
    </div>`;
  }

  const allTracks  = TrackService.getAllTracks();
  const topTrack   = allTracks.find(t => t.id === result.topTrackId) || allTracks[0];
  const top3       = result.top3 || [];
  const confidence = result.confidence || { level: 'high' };
  const dims       = result.dimensions || {};
  const strength   = result.strengthSentence?.[lang] || result.strengthSentence?.en || '';
  const style      = WORK_STYLE[topTrack.id]?.[lang] || WORK_STYLE[topTrack.id]?.en || [];
  const pref       = PREFERENCES[topTrack.id]?.[lang] || PREFERENCES[topTrack.id]?.en || {};

  const confColor  = { high: 'var(--color-success)', medium: 'var(--color-warning)', low: 'var(--color-primary)' };
  const color      = topTrack.color;

  // Top 6 strongest dimensions
  const dimEntries = Object.entries(dims)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const dimBars = dimEntries.map(([key, pct]) =>
    _dimBar(TestService.getDimensionLabel(key, lang), pct, color)
  ).join('');

  // Runner-up track
  const runnerUp = top3[1] ? allTracks.find(t => t.id === top3[1].id) : null;

  return `
    <div class="ds-screen fade-in">

      <!-- Top banner -->
      <div class="ds-banner" style="border-color:${color}30;background:${color}08">
        <div class="ds-banner__left">
          <div class="ds-banner__eyebrow">${isAr ? 'ملخص القرار المهني' : 'Career Decision Summary'}</div>
          <h1 class="ds-banner__title">
            ${isAr ? 'مسارك:' : 'Your track:'}
            <span style="color:${color}">&nbsp;${isAr ? topTrack.nameAr : topTrack.name}</span>
          </h1>
          <p class="ds-banner__strength">${strength}</p>
        </div>
        <div class="ds-banner__icon" style="background:${color}18;color:${color};border-color:${color}30">
          ${topTrack.icon}
        </div>
      </div>

      <!-- Confidence + quick stats -->
      <div class="ds-stats">
        <div class="ds-stat">
          <div class="ds-stat__value ltr-text" style="color:${color}">${top3[0]?.pct || 0}%</div>
          <div class="ds-stat__label">${isAr ? 'درجة التوافق' : 'Fit Score'}</div>
        </div>
        <div class="ds-stat">
          <div class="ds-stat__value" style="color:${confColor[confidence.level]}">
            ${{ high: isAr ? 'عالية' : 'High', medium: isAr ? 'متوسطة' : 'Medium', low: isAr ? 'معقولة' : 'Moderate' }[confidence.level]}
          </div>
          <div class="ds-stat__label">${isAr ? 'الثقة' : 'Confidence'}</div>
        </div>
        <div class="ds-stat">
          <div class="ds-stat__value ltr-text">${topTrack.salaryRange}</div>
          <div class="ds-stat__label">${isAr ? 'النطاق المرتبي' : 'Salary Range'}</div>
        </div>
        <div class="ds-stat">
          <div class="ds-stat__value">${isAr ? topTrack.durationAr : topTrack.duration}</div>
          <div class="ds-stat__label">${isAr ? 'مدة التحضير' : 'Prep Duration'}</div>
        </div>
      </div>

      <div class="ds-body">

        <!-- Left column -->
        <div class="ds-col">

          <!-- Cognitive Dimensions -->
          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              ${isAr ? 'أبعادك المعرفية' : 'Cognitive Dimensions'}
            </div>
            <div class="ds-dims">${dimBars}</div>
          </div>

          <!-- Work Style -->
          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              ${isAr ? 'أسلوب عملك' : 'Your Work Style'}
            </div>
            <div class="ds-tags">
              ${style.map(s => `<span class="ds-tag" style="border-color:${color}40;color:${color}">${s}</span>`).join('')}
            </div>
          </div>

        </div>

        <!-- Right column -->
        <div class="ds-col">

          <!-- Preferences -->
          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              ${isAr ? 'تفضيلاتك المهنية' : 'Professional Preferences'}
            </div>
            <div class="ds-pref">
              <div class="ds-pref__row">
                <span class="ds-pref__icon ds-pref__icon--build">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <div>
                  <div class="ds-pref__key">${isAr ? 'تبني' : 'You build'}</div>
                  <div class="ds-pref__val">${pref.builds}</div>
                </div>
              </div>
              <div class="ds-pref__row">
                <span class="ds-pref__icon ds-pref__icon--avoid">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
                <div>
                  <div class="ds-pref__key">${isAr ? 'تتجنب' : 'You avoid'}</div>
                  <div class="ds-pref__val">${pref.avoids}</div>
                </div>
              </div>
              <div class="ds-pref__row">
                <span class="ds-pref__icon ds-pref__icon--thrive">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </span>
                <div>
                  <div class="ds-pref__key">${isAr ? 'تزدهر في' : 'You thrive in'}</div>
                  <div class="ds-pref__val">${pref.thrives}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Runner-up track -->
          ${runnerUp ? `
          <div class="ds-card ds-card--alt">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              ${isAr ? 'المسار البديل القوي' : 'Strong Alternative Track'}
            </div>
            <div class="ds-alt-track">
              <div class="ds-alt-track__icon" style="background:${runnerUp.color}18;color:${runnerUp.color}">${runnerUp.icon}</div>
              <div>
                <div class="ds-alt-track__name">${isAr ? runnerUp.nameAr : runnerUp.name}</div>
                <div class="ds-alt-track__fit">${top3[1]?.pct}% ${isAr ? 'توافق' : 'fit'}</div>
              </div>
            </div>
            <p class="ds-alt-track__desc">${isAr ? runnerUp.descriptionAr : runnerUp.description}</p>
          </div>` : ''}

          <!-- Skills unlocked -->
          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              ${isAr ? 'المهارات التي ستبنيها' : 'Skills You Will Build'}
            </div>
            <div class="ds-tags">
              ${(topTrack.skills || []).map(s =>
                `<span class="ds-tag ds-tag--skill">${s}</span>`
              ).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- CTA -->
      <div class="ds-cta">
        <div class="ds-cta__left">
          <div class="ds-cta__headline">${isAr ? 'جاهز لتحويل هذا القرار إلى خطة عمل؟' : 'Ready to turn this decision into an action plan?'}</div>
          <div class="ds-cta__sub">${isAr ? 'افتح التقرير الكامل للحصول على خارطة طريق مخصصة، وتحليل عمق المسار، وجلسات إرشاد' : 'Unlock the full report for a personalised roadmap, deep track analysis, and mentorship access.'}</div>
        </div>
        <div class="ds-cta__actions">
          <a href="#/pricing" class="btn btn--primary btn--lg">${isAr ? 'فتح التقرير الكامل' : 'Unlock Full Report'}</a>
          <button class="btn btn--outline" id="ds-start-free-btn" data-track-id="${topTrack.id}">
            ${isAr ? 'ابدأ المسار مجاناً' : 'Start Track for Free'}
          </button>
        </div>
      </div>

    </div>`;
}

export function DecisionSummaryEvents() {
  // Animate dimension bars
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.ds-dim__fill').forEach(el => {
        el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
        el.style.width = el.dataset.pct + '%';
      });
    });
  });

  document.getElementById('ds-start-free-btn')?.addEventListener('click', (e) => {
    const trackId = e.currentTarget.dataset.trackId;
    import('../../services/track.service.js').then(({ TrackService: TS }) => {
      if (trackId) TS.enrollInTrack(trackId);
      Router.navigate('/roadmap');
    });
  });
}
