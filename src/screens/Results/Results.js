import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';

const WHY = {
  frontend: {
    en: 'Your answers show a strong preference for visual output, creative problem-solving, and building things users interact with directly. Frontend Engineering aligns closely with how you think and what excites you.',
    ar: 'إجاباتك تكشف تفضيلاً قوياً للمخرجات المرئية والإبداع وبناء ما يتفاعل معه المستخدمون مباشرةً.',
  },
  backend: {
    en: 'Your responses reflect systematic thinking, a love for logic, and satisfaction in building things that work invisibly at scale. Backend Engineering matches your cognitive style.',
    ar: 'إجاباتك تعكس تفكيراً منظومياً وحبّاً للمنطق والبناء على نطاق واسع.',
  },
  data: {
    en: 'You gravitate toward curiosity, evidence, and patterns. You want to understand why things happen before acting. Data Analysis is where your mindset thrives.',
    ar: 'أنت تميل نحو الفضول والأدلة والأنماط. تحليل البيانات هو المجال الذي يزدهر فيه عقلك.',
  },
  ux: {
    en: 'Your empathy-driven thinking and visual orientation strongly align with UX Design. You naturally think about users first, which is the foundation of great design.',
    ar: 'تفكيرك المتمحور حول التعاطف والبصرية يتوافق بشدة مع تصميم تجربة المستخدم.',
  },
  devops: {
    en: 'You think about reliability, automation, and infrastructure at a system level. DevOps Engineering channels your need to make complex systems work predictably.',
    ar: 'تفكيرك في الانتظام والأتمتة والبنية التحتية يجعل DevOps المجال المثالي لك.',
  },
};

export function Results() {
  const result = TestService.getResult();
  const lang   = document.documentElement.getAttribute('lang') || 'en';
  const isAr   = lang === 'ar';

  if (!result) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
        </div>
        <h3>${isAr ? 'لا توجد نتائج بعد' : 'No results yet'}</h3>
        <p>${isAr ? 'أكمل التقييم أولاً لمعرفة مسارك المهني' : 'Complete the assessment first to discover your career fit'}</p>
        <a href="#/test" class="btn btn--primary">${isAr ? 'ابدأ التقييم' : 'Start Assessment'}</a>
      </div>`;
  }

  const allTracks  = TrackService.getAllTracks();
  const top3       = result.top3 || [];
  const topTrack   = allTracks.find(tr => tr.id === result.topTrackId) || allTracks[0];
  const confidence = result.confidence || { level: 'high', gap: 30 };
  const confLabel  = { high: isAr ? 'ثقة عالية' : 'High Confidence', medium: isAr ? 'ثقة متوسطة' : 'Medium Confidence', low: isAr ? 'ثقة معقولة' : 'Moderate Confidence' };
  const confColor  = { high: 'var(--color-success)', medium: 'var(--color-warning)', low: 'var(--color-primary)' };

  // Build track cards — hidden initially, revealed by JS
  const trackCards = top3.map((item, i) => {
    const tr      = allTracks.find(t => t.id === item.id);
    if (!tr) return '';
    const isTop   = i === 0;
    const name    = isAr ? tr.nameAr : tr.name;
    const desc    = isAr ? tr.descriptionAr : tr.description;
    const why     = WHY[tr.id]?.[lang] || WHY[tr.id]?.en || '';

    return `
      <div class="rc-card rc-card--rank-${i + 1}" data-rank="${i}" style="opacity:0;transform:translateY(24px)">
        <div class="rc-card__header">
          <div class="rc-card__rank">${i + 1}</div>
          <div class="rc-card__icon" style="background:${tr.color}18;color:${tr.color};border-color:${tr.color}30">
            ${tr.icon}
          </div>
          <div class="rc-card__meta">
            <div class="rc-card__name">${name}</div>
            <div class="rc-card__sub">${isAr ? tr.level : tr.level} &middot; ${isAr ? tr.durationAr : tr.duration}</div>
          </div>
          ${isTop ? `<span class="rc-badge">${isAr ? 'الأنسب لك' : 'Best Fit'}</span>` : ''}
        </div>

        <div class="rc-bar-row">
          <div class="rc-bar-bg">
            <div class="rc-bar-fill" data-pct="${item.pct}" style="width:0%;background:${tr.color}"></div>
          </div>
          <span class="rc-pct ltr-text" data-target="${item.pct}">0%</span>
        </div>

        <p class="rc-desc">${desc}</p>

        <details class="rc-why">
          <summary class="rc-why__toggle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
            ${isAr ? 'لماذا هذه النتيجة؟' : 'Why this result?'}
          </summary>
          <p class="rc-why__body">${why}</p>
        </details>
      </div>`;
  }).join('');

  return `
    <div class="results-screen">

      <!-- PHASE 1: Analysing overlay (shown first, then fades) -->
      <div class="rc-overlay" id="rc-overlay">
        <div class="rc-overlay__inner">
          <div class="rc-overlay__dots"><span></span><span></span><span></span></div>
          <p class="rc-overlay__label" id="rc-overlay-label">
            ${isAr ? 'جاري تحليل ملفك المهني...' : 'Analysing your career profile...'}
          </p>
        </div>
      </div>

      <!-- PHASE 2: Results (revealed after overlay) -->
      <div class="rc-results" id="rc-results" style="opacity:0">

        <div class="rc-hero">
          <div class="rc-hero__eyebrow">${isAr ? 'نتائج تقييمك' : 'Your Assessment Results'}</div>
          <h1 class="rc-hero__title">
            ${isAr ? 'المسار الأنسب لك:' : 'Your best-fit track is'}
            <span style="color:${topTrack.color}">&nbsp;${isAr ? topTrack.nameAr : topTrack.name}</span>
          </h1>
          <p class="rc-hero__sub">
            ${isAr
              ? 'تم تحليل إجاباتك عبر 7 أبعاد معرفية لتحديد أقوى توافق مهني'
              : 'Your answers were analysed across 7 cognitive dimensions to surface your strongest career alignment.'}
          </p>
          <div class="rc-confidence" style="border-color:${confColor[confidence.level]}20;background:${confColor[confidence.level]}0d">
            <span class="rc-confidence__dot" style="background:${confColor[confidence.level]}"></span>
            <span class="rc-confidence__label" style="color:${confColor[confidence.level]}">${confLabel[confidence.level]}</span>
            <span class="rc-confidence__copy">${TestService.getConfidenceCopy(confidence.level, lang)}</span>
          </div>
        </div>

        <div class="rc-tracks" id="rc-tracks">
          ${trackCards}
        </div>

        <div class="rc-actions">
          <button class="btn btn--primary btn--lg" id="rc-summary-btn" data-track-id="${topTrack.id}">
            ${isAr ? 'عرض ملخص القرار' : 'View Decision Summary'}
          </button>
          <a href="#/test" class="btn btn--ghost btn--sm">${isAr ? 'إعادة التقييم' : 'Retake Assessment'}</a>
        </div>
      </div>
    </div>`;
}

export function ResultsEvents() {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const isAr = lang === 'ar';

  const overlay   = document.getElementById('rc-overlay');
  const results   = document.getElementById('rc-results');
  const overlayLbl = document.getElementById('rc-overlay-label');

  const phases = isAr
    ? ['جاري تحليل ملفك المهني...', 'نقيس التوافق عبر 7 أبعاد...', 'نُرتّب نتائجك...']
    : ['Analysing your career profile...', 'Measuring fit across 7 dimensions...', 'Ranking your results...'];

  let phaseIdx = 0;
  const phaseInterval = setInterval(() => {
    phaseIdx = (phaseIdx + 1) % phases.length;
    if (overlayLbl) overlayLbl.textContent = phases[phaseIdx];
  }, 700);

  // After 2.2s — hide overlay, reveal results
  setTimeout(() => {
    clearInterval(phaseInterval);

    if (overlay) {
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 500);
    }

    if (results) {
      results.style.transition = 'opacity 0.4s ease';
      results.style.opacity = '1';
    }

    // Reveal cards one by one with stagger
    const cards = document.querySelectorAll('.rc-card');
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';

        // Animate bar + counter
        const fill   = card.querySelector('.rc-bar-fill');
        const pctEl  = card.querySelector('.rc-pct');
        const target = parseInt(fill?.dataset.pct || '0');

        setTimeout(() => {
          if (fill) fill.style.width = target + '%';
          if (pctEl) _countUp(pctEl, 0, target, 800);
        }, 100);
      }, i * 220);
    });
  }, 2200);

  // Summary button
  document.getElementById('rc-summary-btn')?.addEventListener('click', (e) => {
    const trackId = e.currentTarget.dataset.trackId;
    import('../../services/track.service.js').then(({ TrackService: TS }) => {
      if (trackId) TS.enrollInTrack(trackId);
      Router.navigate('/decision-summary');
    });
  });
}

function _countUp(el, from, to, duration) {
  const start    = performance.now();
  const range    = to - from;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.round(from + range * ease) + '%';
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
