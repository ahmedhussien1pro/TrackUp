import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';
import { t } from '../../i18n.js';

// ── Micro-Feedback: connects top dimension to decision
const MICRO_FEEDBACK = {
  frontend: {
    en: 'Because you preferred working on visual problems and building things people can see and interact with',
    ar: 'لأنك فضّلت العمل على مشكلات بصرية وبناء أشياء يراها الناس ويتفاعلون معها',
  },
  backend: {
    en: 'Because you showed strong logical thinking and a preference for systems over surfaces',
    ar: 'لأنك أظهرت تفكيراً منطقياً قوياً وتفضيلاً للأنظمة على الواجهات',
  },
  data: {
    en: 'Because you consistently chose evidence and patterns over intuition and speed',
    ar: 'لأنك اخترت باستمرار الأدلة والأنماط على الحدس والسرعة',
  },
  ux: {
    en: 'Because you showed deep empathy and consistently put user needs at the center of your thinking',
    ar: 'لأنك أظهرت تعاطفاً عميقاً ووضعت احتياجات المستخدم في مركز تفكيرك باستمرار',
  },
  devops: {
    en: 'Because you showed a systematic-first thinking pattern and satisfaction in making complex systems predictable',
    ar: 'لأنك أظهرت نمط تفكير منظومي أولاً ورضاً عن جعل الأنظمة المعقدة يمكن التنبؤ بها',
  },
};

// ── Social Proof: 2 stats per track
const SOCIAL_PROOF = {
  frontend: {
    en: [
      { stat: '87%',       label: 'of learners with your profile rated this as the right choice after 3 months' },
      { stat: '4.2 months', label: 'average time to first job-ready project for visual thinkers on this track' },
    ],
    ar: [
      { stat: '87%',       label: 'من المتعلمين بنفس ملفك اعتبروه الخيار الصحيح بعد 3 أشهر' },
      { stat: '4.2 شهر', label: 'متوسط الوقت لأول مشروع جاهز للعمل للمفكرين بصرياً' },
    ],
  },
  backend: {
    en: [
      { stat: '91%',       label: 'of systematic thinkers who chose backend reported strong career satisfaction' },
      { stat: '$105k+',    label: 'average salary for logical-first profiles in backend roles after 2 years' },
    ],
    ar: [
      { stat: '91%',       label: 'من المفكرين المنظوميين أبلغوا عن رضا وظيفي عالي' },
      { stat: '$105k+',    label: 'متوسط الراتب للملفات المنطقية في أدوار الباكند بعد سنتين' },
    ],
  },
  data: {
    en: [
      { stat: '89%',       label: 'of analytical profiles who committed to this track reported clear career direction' },
      { stat: '3.8 months', label: 'average time to build a job-ready data portfolio on this track' },
    ],
    ar: [
      { stat: '89%',       label: 'من الملفات التحليلية التي التزمت بهذا المسار أفادت بوجود توجه واضح' },
      { stat: '3.8 شهر', label: 'متوسط الوقت لبناء محفظة بيانات جاهزة للعمل' },
    ],
  },
  ux: {
    en: [
      { stat: '84%',       label: 'of empathy-led profiles found UX design deeply fulfilling within 6 months' },
      { stat: '78%',       label: 'of UX learners on this track secured a junior role within a year' },
    ],
    ar: [
      { stat: '84%',       label: 'من الملفات المدفوعة بالتعاطف وجدت UX مُرضياً خلال 6 أشهر' },
      { stat: '78%',       label: 'من متعلمي UX حصلوا على دور مبتدئ خلال عام' },
    ],
  },
  devops: {
    en: [
      { stat: '93%',       label: 'of systematic-first profiles who chose DevOps reported high job satisfaction' },
      { stat: '$110k+',    label: 'average DevOps engineer salary for profiles with strong systems thinking scores' },
    ],
    ar: [
      { stat: '93%',       label: 'من الملفات المنظومية التي اختارت DevOps أبلغت عن رضا وظيفي عالي' },
      { stat: '$110k+',    label: 'متوسط راتب مهندس DevOps للملفات ذات درجات التفكير المنظومي العالية' },
    ],
  },
};

export function DecisionSummary() {
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
        <h3>${t('results.noResult')}</h3>
        <p>${t('results.noResultSub')}</p>
        <a href="#/test" class="btn btn--primary">${t('test.title')}</a>
      </div>`;
  }

  const allTracks = TrackService.getAllTracks();
  const topTrack  =
    allTracks.find(tr => tr.id === result.topTrackId) ||
    allTracks.find(tr => tr.id === result.top3?.[0]?.id) ||
    allTracks[0];
  const top3      = result.top3 || [];
  const color     = topTrack.color;
  const trackName = isAr ? (topTrack.nameAr || topTrack.name) : topTrack.name;
  const strength  = result.strengthSentence?.[lang] || result.strengthSentence?.en || '';
  const fitPct    = typeof top3[0]?.pct === 'number' ? top3[0].pct : 100;

  const feedback   = MICRO_FEEDBACK[topTrack.id]?.[lang]  || MICRO_FEEDBACK[topTrack.id]?.en  || '';
  const proofItems = SOCIAL_PROOF[topTrack.id]?.[lang]    || SOCIAL_PROOF[topTrack.id]?.en    || [];

  return `
    <div class="ds-screen fade-in">

      <!-- Breadcrumb -->
      <div class="ds-breadcrumb">
        <button class="btn btn--ghost btn--sm" id="ds-back-results">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          ${t('results.eyebrow')}
        </button>
      </div>

      <!-- ── SECTION 1: Hero ── -->
      <div class="ds-banner" style="border-color:${color}30;background:${color}08">
        <div class="ds-banner__left">
          <div class="ds-banner__eyebrow">${t('decision.eyebrow')}</div>
          <h1 class="ds-banner__title">
            ${t('decision.headline')}
            <span style="color:${color}">&nbsp;${trackName}</span>
          </h1>
          <p class="ds-banner__strength">${strength}</p>
        </div>
        <div class="ds-banner__icon" style="background:${color}18;color:${color};border-color:${color}30">
          ${topTrack.icon}
        </div>
      </div>

      <!-- Stats row -->
      <div class="ds-stats">
        <div class="ds-stat">
          <div class="ds-stat__value ltr-text" style="color:${color}">${fitPct}%</div>
          <div class="ds-stat__label">${t('decision.fitScore')}</div>
        </div>
        <div class="ds-stat">
          <div class="ds-stat__value ltr-text">${topTrack.salaryRange || topTrack.salary || '—'}</div>
          <div class="ds-stat__label">${t('decision.salary')}</div>
        </div>
        <div class="ds-stat">
          <div class="ds-stat__value">${isAr ? (topTrack.durationAr || topTrack.duration) : topTrack.duration}</div>
          <div class="ds-stat__label">${t('decision.duration')}</div>
        </div>
      </div>

      <!-- ── SECTION 2: Micro-Feedback ── -->
      ${feedback ? `
        <div class="ds-micro-feedback">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>${feedback}</span>
        </div>` : ''}

      <!-- ── SECTION 3: Social Proof ── -->
      ${proofItems.length ? `
        <div class="ds-proof">
          <div class="ds-proof__eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            ${isAr ? 'مستخدمون بنفس ملفك سبقوك على هذا المسار' : 'People with a similar profile on this track'}
          </div>
          <div class="ds-proof__items">
            ${proofItems.map(p => `
              <div class="ds-proof__item">
                <div class="ds-proof__stat" style="color:${color}">${p.stat}</div>
                <div class="ds-proof__label">${p.label}</div>
              </div>`).join('')}
          </div>
        </div>` : ''}

      <!-- ── SECTION 4: Commitment Trigger ── -->
      <div class="ds-commit" id="ds-commit-block">
        <div class="ds-commit__icon" style="background:${color}14;color:${color}">${topTrack.icon}</div>
        <div class="ds-commit__body">
          <p class="ds-commit__pre">${isAr ? 'أنت على وشك البدء في مسارك في' : "You're about to start your path in"}</p>
          <h2 class="ds-commit__track" style="color:${color}">${trackName}</h2>
          <p class="ds-commit__q">${isAr ? 'هل أنت مستعد للالتزام؟' : 'Are you ready to commit?'}</p>
        </div>
        <div class="ds-commit__actions">
          <button class="btn btn--primary btn--lg" id="ds-commit-btn" data-track-id="${topTrack.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            ${isAr ? 'ابدأ مساري' : 'Start My Path'}
          </button>
          <button class="btn btn--ghost btn--sm" id="ds-retake-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.54"/></svg>
            ${t('results.retake')}
          </button>
        </div>
      </div>

    </div>`;
}

export function DecisionSummaryEvents() {
  document.getElementById('ds-back-results')?.addEventListener('click', () => {
    Router.navigate('/results');
  });

  document.getElementById('ds-commit-btn')?.addEventListener('click', (e) => {
    const trackId = e.currentTarget.dataset.trackId;
    if (trackId) TrackService.enrollInTrack(trackId);

    const lang  = document.documentElement.getAttribute('lang') || 'en';
    const isAr  = lang === 'ar';
    const track = TrackService.getTrackById(trackId);
    const name  = isAr ? (track?.nameAr || track?.name) : track?.name;

    StorageService.set('path_committed', true);
    StorageService.set('committed_track_id', trackId);

    if (window.Toastify) {
      Toastify({
        text:     isAr ? `مرحباً بك في مسار ${name}` : `Welcome to ${name}. Your path starts now.`,
        duration: 3000,
        gravity:  'bottom',
        position: 'right',
        style:    { background: track?.color || 'var(--color-primary)' },
      }).showToast();
    }

    const user = State.getState('user');
    setTimeout(() => Router.navigate(user ? '/dashboard' : '/register'), 600);
  });

  document.getElementById('ds-retake-btn')?.addEventListener('click', () => {
    State.setState('testResult', null);
    StorageService.set('testResult', null);
    Router.navigate('/test');
  });
}
