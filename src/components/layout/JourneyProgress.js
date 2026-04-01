// Journey Progress Indicator
// Shows current position in the TrackUp flow: Test → Results → Track → Roadmap
// Mounts as a sticky top bar on relevant screens

const JOURNEY_STEPS = [
  { key: 'test',    paths: ['/test'],                         en: 'Test',    ar: 'الاختبار' },
  { key: 'results', paths: ['/results', '/decision-summary'], en: 'Results', ar: 'النتيجة' },
  { key: 'track',   paths: ['/career'],                       en: 'Track',   ar: 'المسار' },
  { key: 'roadmap', paths: ['/roadmap'],                      en: 'Roadmap', ar: 'خارطة الطريق' },
];

const JOURNEY_PATHS = new Set(JOURNEY_STEPS.flatMap(s => s.paths));

export function shouldShowJourney(path) {
  return JOURNEY_PATHS.has(path);
}

export function mountJourneyProgress(currentPath) {
  unmountJourneyProgress();
  if (!shouldShowJourney(currentPath)) return;

  const isAr         = document.documentElement.getAttribute('lang') === 'ar';
  const currentIndex = JOURNEY_STEPS.findIndex(s => s.paths.includes(currentPath));

  const bar = document.createElement('div');
  bar.id        = 'journey-progress';
  bar.className = 'journey-progress';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', isAr ? 'تقدم الرحلة' : 'Journey progress');

  bar.innerHTML = `
    <div class="journey-progress__inner">
      ${JOURNEY_STEPS.map((step, i) => {
        const isDone    = i < currentIndex;
        const isCurrent = i === currentIndex;
        const label     = isAr ? step.ar : step.en;
        const cls       = isDone ? 'done' : isCurrent ? 'current' : 'pending';
        return `
          <div class="journey-step journey-step--${cls}">
            <div class="journey-step__dot">
              ${isDone
                ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
                : `<span>${i + 1}</span>`
              }
            </div>
            <span class="journey-step__label">${label}</span>
            ${i < JOURNEY_STEPS.length - 1
              ? `<div class="journey-step__line journey-step__line--${isDone ? 'done' : 'pending'}"></div>`
              : ''
            }
          </div>`;
      }).join('')}
    </div>`;

  // Insert before app-outlet
  const outlet = document.getElementById('app-outlet');
  if (outlet?.parentNode) {
    outlet.parentNode.insertBefore(bar, outlet);
  }
}

export function unmountJourneyProgress() {
  document.getElementById('journey-progress')?.remove();
}
