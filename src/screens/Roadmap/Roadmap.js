import { t } from '../../i18n.js';
import State from '../../state.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { TrackService } from '../../services/track.service.js';

export function Roadmap() {
  const user = State.getState('user');
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const isAr = lang === 'ar';

  if (!user?.activeTrackId) {
    return `
      <div class="roadmap-screen">
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:var(--space-4);opacity:0.4"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <p style="margin-bottom:var(--space-4)">${t('roadmap.selectTrack')}</p>
          <a href="#/career" class="btn btn--primary">${t('career.title')}</a>
        </div>
      </div>
    `;
  }

  const track = TrackService.getTrackById(user.activeTrackId);
  const steps = RoadmapService.getStepsForTrack(user.activeTrackId);
  const prog  = RoadmapService.getProgressForTrack(user.activeTrackId);

  return `
    <div class="roadmap-screen fade-in">

      <!-- Header -->
      <div class="screen-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-4)">
        <div>
          <h1 style="color:${track?.color || 'var(--color-primary)'}">
            ${isAr ? (track?.nameAr || track?.name || '') : (track?.name || '')}
          </h1>
          <p>${isAr ? '\u062e\u0627\u0631\u0637\u0629 \u0637\u0631\u064a\u0642 \u062a\u0639\u0644\u0645\u0643' : 'Your learning roadmap'}</p>
        </div>
        <div style="text-align:end">
          <div style="font-size:var(--text-2xl);font-weight:var(--weight-black);color:var(--color-primary)" class="ltr-text">${prog.percent}%</div>
          <div style="font-size:var(--text-sm);color:var(--color-text-muted)" class="ltr-text">${prog.completed}/${prog.total} steps</div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar" style="margin-bottom:var(--space-8)">
        <div class="progress-bar__fill"
             data-pct="${prog.percent}"
             style="width:0%;background:${track?.color || 'var(--color-primary)'}"
        ></div>
      </div>

      <!-- Steps -->
      <div class="roadmap-steps">
        ${steps.map((step, i) => `
          <div class="roadmap-step step--${step.status}" data-step-id="${step.id}">
            <div class="roadmap-step__index">
              ${step.status === 'completed'
                ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
                : i + 1
              }
            </div>
            <div class="roadmap-step__body">
              <h4>${isAr ? (step.titleAr || step.title) : step.title}</h4>
              ${step.description ? `<p>${isAr ? (step.descriptionAr || step.description) : step.description}</p>` : ''}
              <div class="roadmap-step__meta">
                ${step.duration ? `<span class="badge badge--neutral ltr-text">${step.duration}</span>` : ''}
                <span class="badge badge--${step.status}">
                  ${step.status === 'completed'
                      ? (isAr ? '\u0645\u0643\u062a\u0645\u0644' : 'Completed')
                      : step.status === 'active'
                        ? (isAr ? '\u062c\u0627\u0631\u064a' : 'In Progress')
                        : (isAr ? '\u0645\u063a\u0644\u0642' : 'Locked')
                  }
                </span>
              </div>
            </div>
            <div class="roadmap-step__action">
              ${step.status === 'active' ? `
                <button
                  class="btn btn--primary btn--sm roadmap-complete-btn"
                  data-step-id="${step.id}"
                >
                  ${isAr ? '\u062a\u0639\u0644\u064a\u0645 \u0643\u0645\u0643\u062a\u0645\u0644' : 'Mark Complete'}
                </button>
              ` : ''}
              ${step.status === 'completed' ? `
                <span style="color:var(--color-success);font-size:var(--text-xs);font-weight:var(--weight-semi)">
                  ${isAr ? '\u062a\u0645' : 'Done'}
                </span>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function RoadmapEvents() {
  // Animate progress bar
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    });
  });

  document.querySelectorAll('.roadmap-complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepId = btn.dataset.stepId;
      RoadmapService.completeStep(stepId);
      Toastify({
        text: document.documentElement.getAttribute('lang') === 'ar'
          ? '\u0623\u062d\u0633\u0646\u062a! \u062a\u0645 \u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u062e\u0637\u0648\u0629'
          : 'Step completed. Keep going!',
        duration: 2500,
        gravity: 'bottom',
        position: 'right',
        style: { background: 'var(--color-success)' },
      }).showToast();
      const outlet = document.getElementById('app-outlet');
      if (outlet) { outlet.innerHTML = Roadmap(); RoadmapEvents(); }
    });
  });
}
