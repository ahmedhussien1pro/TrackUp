import { t } from '../../i18n.js';
import State from '../../state.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { TrackService } from '../../services/track.service.js';
import { Router } from '../../router.js';

const PHASE_ORDER = ['Basics', 'Courses', 'Projects', 'Job Ready'];
const PHASE_ICONS = {
  'Basics':    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`,
  'Courses':   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  'Projects':  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  'Job Ready': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`,
};
const PHASE_AR = {
  'Basics':    'الأساسيات',
  'Courses':   'الكورسات',
  'Projects':  'المشاريع',
  'Job Ready': 'جاهز للعمل',
};
// Phase-level CTA config: what action to show when phase is active
const PHASE_CTA = {
  'Basics':    { href: '#/courses',    en: 'Browse Courses',    ar: 'استعرض الكورسات' },
  'Courses':   { href: '#/courses',    en: 'Go to Courses',     ar: 'افتح الكورسات' },
  'Projects':  { href: '#/courses',    en: 'Find Project Courses', ar: 'كورسات المشاريع' },
  'Job Ready': { href: '#/mentorship', en: 'Book a Mentor',     ar: 'احجز مرشد' },
};

export function Roadmap() {
  const user = State.getState('user');
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const isAr = lang === 'ar';

  if (!user?.activeTrackId) {
    return `
      <div class="roadmap-screen">
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:var(--space-4);opacity:0.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <p style="margin-bottom:var(--space-4)">${t('roadmap.selectTrack')}</p>
          <a href="#/career" class="btn btn--primary">${t('career.title')}</a>
        </div>
      </div>`;
  }

  const track = TrackService.getTrackById(user.activeTrackId);
  const steps = RoadmapService.getStepsForTrack(user.activeTrackId);
  const prog  = RoadmapService.getProgressForTrack(user.activeTrackId);
  const color = track?.color || 'var(--color-primary)';

  const grouped = {};
  PHASE_ORDER.forEach(p => { grouped[p] = []; });
  steps.forEach(s => {
    const ph = s.phase || 'Basics';
    if (!grouped[ph]) grouped[ph] = [];
    grouped[ph].push(s);
  });

  function _phaseStatus(phaseSteps) {
    if (!phaseSteps.length) return 'locked';
    if (phaseSteps.every(s => s.status === 'completed')) return 'completed';
    if (phaseSteps.some(s => s.status === 'active' || s.status === 'completed')) return 'active';
    return 'locked';
  }

  const trackName = isAr ? (track?.nameAr || track?.name || '') : (track?.name || '');

  return `
    <div class="roadmap-screen fade-in">

      <div class="screen-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-4)">
        <div>
          <h1 style="color:${color}">${trackName}</h1>
          <p>${isAr ? 'خارطة طريق تعلمك' : 'Your learning roadmap'}</p>
        </div>
        <div style="text-align:end">
          <div style="font-size:var(--text-2xl);font-weight:var(--weight-black);color:${color}" class="ltr-text">${prog.percent}%</div>
          <div style="font-size:var(--text-sm);color:var(--color-text-muted)" class="ltr-text">${prog.completed}/${prog.total} ${isAr ? 'خطوة' : 'steps'}</div>
        </div>
      </div>

      <div class="progress-bar" style="margin-bottom:var(--space-8)">
        <div class="progress-bar__fill" data-pct="${prog.percent}" style="width:0%;background:${color}"></div>
      </div>

      <div class="roadmap-phases">
        ${PHASE_ORDER.filter(p => grouped[p].length > 0).map((phase) => {
          const phaseSteps = grouped[phase];
          const phaseSt    = _phaseStatus(phaseSteps);
          const phaseLabel = isAr ? (PHASE_AR[phase] || phase) : phase;
          const phaseIcon  = PHASE_ICONS[phase] || '';
          const phaseCta   = PHASE_CTA[phase];

          return `
            <div class="roadmap-phase roadmap-phase--${phaseSt}">
              <div class="roadmap-phase__header">
                <div class="roadmap-phase__label-wrap">
                  <div class="roadmap-phase__icon" style="${phaseSt === 'completed' ? `background:${color}20;color:${color}` : ''}">${phaseIcon}</div>
                  <span class="roadmap-phase__label">${phaseLabel}</span>
                  ${phaseSt === 'completed' ? `<span class="badge" style="background:${color}15;color:${color};font-size:0.6875rem">${isAr ? 'مكتمل' : 'Done'}</span>` : ''}
                  ${phaseSt === 'active' ? `<span class="badge badge--active" style="font-size:0.6875rem">${isAr ? 'جاري' : 'In Progress'}</span>` : ''}
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                  <span class="roadmap-phase__count">${phaseSteps.filter(s => s.status === 'completed').length}/${phaseSteps.length}</span>
                  ${phaseSt === 'active' && phaseCta ? `
                    <a href="${phaseCta.href}" class="btn btn--primary btn--sm" style="background:${color};border-color:${color};font-size:var(--text-xs)">
                      ${isAr ? phaseCta.ar : phaseCta.en}
                    </a>` : ''}
                </div>
              </div>
              <div class="roadmap-phase__steps">
                ${phaseSteps.map((step, i) => `
                  <div class="roadmap-step step--${step.status}" data-step-id="${step.id}">
                    <div class="roadmap-step__index" style="${step.status !== 'locked' ? `border-color:${color}40;` : ''}${step.status === 'completed' ? `background:${color};border-color:${color};color:#fff` : ''}">
                      ${step.status === 'completed'
                        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
                        : i + 1
                      }
                    </div>
                    <div class="roadmap-step__body">
                      <h4>${step.title}</h4>
                      ${step.desc ? `<p>${step.desc}</p>` : ''}
                      <div class="roadmap-step__meta">
                        ${step.weeks ? `<span class="badge badge--neutral ltr-text">${step.weeks}w</span>` : ''}
                        <span class="badge badge--${step.status}">
                          ${step.status === 'completed'
                              ? (isAr ? 'مكتمل' : 'Completed')
                              : step.status === 'active'
                                ? (isAr ? 'جاري' : 'In Progress')
                                : (isAr ? 'مغلق' : 'Locked')
                          }
                        </span>
                      </div>
                    </div>
                    <div class="roadmap-step__action">
                      ${step.status === 'active' ? `
                        <button class="btn btn--primary btn--sm roadmap-complete-btn" data-step-id="${step.id}" style="background:${color};border-color:${color}">
                          ${isAr ? 'إتمام' : 'Mark Done'}
                        </button>` : ''}
                      ${step.status === 'completed' ? `<span style="color:${color};font-size:var(--text-xs);font-weight:700">${isAr ? 'تم' : 'Done'}</span>` : ''}
                    </div>
                  </div>`).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Bottom navigation -->
      <div style="margin-top:var(--space-8);display:flex;gap:var(--space-3);flex-wrap:wrap">
        <a href="#/courses" class="btn btn--primary" style="background:${color};border-color:${color}">
          ${isAr ? 'الكورسات' : 'View Courses'}
        </a>
        <a href="#/mentorship" class="btn btn--outline">
          ${isAr ? 'ابحث عن مرشد' : 'Find a Mentor'}
        </a>
      </div>

    </div>`;
}

export function RoadmapEvents() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
      el.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1)';
      el.style.width = el.dataset.pct + '%';
    });
  }));

  document.querySelectorAll('.roadmap-complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepId = btn.dataset.stepId;
      const isAr   = document.documentElement.getAttribute('lang') === 'ar';
      RoadmapService.completeStep(stepId);
      Toastify({
        text:     isAr ? 'أحسنت! تم إكمال الخطوة' : 'Step completed. Keep going!',
        duration: 2500, gravity: 'bottom', position: 'right',
        style:    { background: 'var(--color-success)' },
      }).showToast();
      const outlet = document.getElementById('app-outlet');
      if (outlet) { outlet.innerHTML = Roadmap(); RoadmapEvents(); }
    });
  });
}
