import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';

// Why-this-result copy per track
const WHY = {
  frontend: {
    en: 'Your answers show a strong preference for visual output, creative problem-solving, and building things users interact with directly. Frontend Engineering aligns closely with how you think and what excites you.',
    ar: 'إجاباتك تكشف عن تفضيل قوي للمخرجات المرئية والإبداع وبناء ما يتفاعل معه المستخدمون مباشرةً.',
  },
  backend: {
    en: 'Your responses reflect systematic thinking, a love for logic, and satisfaction in building things that work invisibly at scale. Backend Engineering matches your cognitive style.',
    ar: 'إجاباتك تعكس تفكيراً منظومياً وحبّاً للمنطق والبناء على نطاق واسع.',
  },
  data: {
    en: "You gravitate toward curiosity, evidence, and patterns. You want to understand why things happen before acting. Data Analysis is where your mindset thrives.",
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

const FIT_LABEL = { en: 'Fit Score', ar: 'درجة التوافق' };

export function Results() {
  const result = TestService.getResult();
  const lang   = document.documentElement.getAttribute('lang') || 'en';
  const isAr   = lang === 'ar';

  if (!result) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg></div>
        <h3>${t('results.noResult')}</h3>
        <p>${t('results.noResultSub')}</p>
        <a href="#/test" class="btn btn--primary">${t('test.title')}</a>
      </div>`;
  }

  const allTracks = TrackService.getAllTracks();
  const top3      = result.top3 || [];
  const topTrack  = allTracks.find(tr => tr.id === result.topTrackId) || allTracks[0];
  const why       = WHY[result.topTrackId]?.[lang] || WHY[result.topTrackId]?.en || '';

  const top3Html = top3.map((item, i) => {
    const tr = allTracks.find(t => t.id === item.id);
    if (!tr) return '';
    const isWinner = i === 0;
    return `
      <div class="results-track-card ${isWinner ? 'results-track-card--winner' : ''}" 
           style="animation-delay:${i * 0.12}s">
        <div class="results-track-card__header">
          <div class="results-track-card__icon" style="background:${tr.color}22;color:${tr.color}">${tr.icon}</div>
          <div class="results-track-card__info">
            <div class="results-track-card__name">${isAr ? tr.nameAr : tr.name}</div>
            <div class="results-track-card__level">${tr.level}</div>
          </div>
          ${isWinner ? `<span class="results-badge">${isAr ? 'الأنسب' : 'Best Fit'}</span>` : ''}
        </div>
        <div class="results-track-card__bar-wrap">
          <div class="results-track-card__bar-bg">
            <div class="results-track-card__bar-fill" 
                 style="width:0%;background:${tr.color}" 
                 data-pct="${item.pct}"></div>
          </div>
          <span class="results-track-card__pct">${item.pct}%</span>
        </div>
        <p class="results-track-card__desc">${isAr ? tr.descriptionAr : tr.description}</p>
      </div>`;
  }).join('');

  return `
    <div class="results-screen fade-in">
      <div class="results-hero">
        <div class="results-hero__label">${isAr ? 'نتائج تقييمك' : 'Your Assessment Results'}</div>
        <h1 class="results-hero__title">
          ${isAr ? 'مسارك الأنسب:' : 'Your best-fit track is'}
          <span style="color:${topTrack.color}">&nbsp;${isAr ? topTrack.nameAr : topTrack.name}</span>
        </h1>
        <p class="results-hero__sub">
          ${isAr ? 'تم تحليل إجاباتك عبر سبعة أبعاد لتحديد أفضل مسار مهني' : 'Your answers were analysed across 7 dimensions to identify your strongest career alignment.'}
        </p>
      </div>

      <div class="results-tracks">
        ${top3Html}
      </div>

      <div class="results-why card slide-up" style="animation-delay:0.4s">
        <div class="results-why__heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
          <span>${isAr ? 'لماذا هذه النتيجة?' : 'Why this result?'}</span>
        </div>
        <p>${why}</p>
      </div>

      <div class="results-actions">
        <button class="btn btn--primary btn--lg" id="results-start-btn" data-track-id="${topTrack.id}">
          ${isAr ? 'ابدأ مسارك' : 'Start This Track'}
        </button>
        <a href="#/pricing" class="btn btn--outline">${isAr ? 'فتح التقرير الكامل' : 'Unlock Full Report'}</a>
        <a href="#/test" class="btn btn--ghost btn--sm">${t('results.cta.retake')}</a>
      </div>
    </div>`;
}

export function ResultsEvents() {
  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.results-track-card__bar-fill').forEach(bar => {
      const pct = bar.dataset.pct;
      bar.style.width = pct + '%';
    });
  }, 120);

  document.getElementById('results-start-btn')?.addEventListener('click', (e) => {
    const trackId = e.currentTarget.dataset.trackId;
    import('../../services/track.service.js').then(({ TrackService: TS }) => {
      if (trackId) TS.enrollInTrack(trackId);
      Router.navigate('/roadmap');
    });
  });
}
