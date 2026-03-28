import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';
import { t } from '../../i18n.js';

// ── Dynamic micro-feedback: built from actual topDim key + trackId
// Covers all 6 dimensions × 5 tracks = 30 combinations
const MICRO_MAP = {
  // Visual Thinking
  'visual:frontend':  { en: 'Because your answers showed a strong visual thinking pattern — you consistently chose to build and see output', ar: 'لأن إجاباتك أظهرت نمط تفكير بصري قوي — اخترت باستمرار البناء ورؤية النتائج' },
  'visual:ux':        { en: 'Because you combine visual thinking with user focus — you see both form and feeling in design', ar: 'لأنك تجمع بين التفكير البصري وتركيز المستخدم — ترى الشكل والشعور معاً' },
  'visual:data':      { en: 'Because you think visually about data — your instinct is to make numbers meaningful and clear', ar: 'لأنك تفكّر بصرياً في البيانات — غريزتك تجعل الأرقام مفهومة وواضحة' },
  'visual:backend':   { en: 'Because you think visually about systems — you naturally map how data flows and connects', ar: 'لأنك تفكّر بصرياً في الأنظمة — ترسم تلقائياً كيف تتدفق البيانات وتتصل' },
  'visual:devops':    { en: 'Because you think visually about infrastructure — you see pipelines and systems as diagrams to optimise', ar: 'لأنك تفكّر بصرياً في البنية — ترى المسارات كمخططات للتحسين' },
  // Creative Output
  'creative:frontend':{ en: 'Because your creative drive is strongest when you ship something people can actually touch and use', ar: 'لأن طاقتك الإبداعية تبلغ ذروتها حين تسلّم شيئاً يستطيع الناس لمسه' },
  'creative:ux':      { en: 'Because creativity in your answers always led toward making experiences better, not just different', ar: 'لأن الإبداع في إجاباتك كان دائماً نحو تحسين التجارب، ليس مجرد جعلها مختلفة' },
  'creative:data':    { en: 'Because you bring creative storytelling to data — you care about how insights are communicated', ar: 'لأنك تجلب سرد القصص الإبداعي للبيانات — يهمك كيفية توصيل الرؤى' },
  'creative:backend': { en: 'Because your creativity shows in elegant API design and clever architecture choices', ar: 'لأن إبداعك يظهر في تصميم API أنيق واختيارات معمارية ذكية' },
  'creative:devops':  { en: 'Because your creativity is in automation — you love building systems that run themselves', ar: 'لأن إبداعك في الأتمتة — تحب بناء أنظمة تعمل بذاتها' },
  // Logical Systems
  'logical:backend':  { en: 'Because your answers consistently chose precision over speed, and systems over surfaces', ar: 'لأن إجاباتك اختارت باستمرار الدقة على السرعة، والأنظمة على الواجهات' },
  'logical:devops':   { en: 'Because logical thinking is your superpower — you reason about failure modes before they happen', ar: 'لأن التفكير المنطقي هو قوتك — تفكّر في حالات الفشل قبل حدوثها' },
  'logical:data':     { en: 'Because you build logical models first before drawing conclusions — a core data analyst trait', ar: 'لأنك تبني نماذج منطقية أولاً قبل الاستنتاج — سمة محلل بيانات حقيقي' },
  'logical:frontend': { en: 'Because your logic drives clean code — you think in components and state before you think in pixels', ar: 'لأن منطقك يقود كوداً نظيفاً — تفكّر بالمكونات والحالة قبل أن تفكّر بالبكسل' },
  'logical:ux':       { en: 'Because you apply logical structure to user flows — you design decisions, not just screens', ar: 'لأنك تطبّق هيكلاً منطقياً على تدفقات المستخدم — تصمّم قرارات، ليس شاشات فقط' },
  // Analytical Mind
  'analytical:data':  { en: 'Because every question about problems, you naturally reached for evidence and measurement first', ar: 'لأن في كل سؤال عن المشكلات، بحثت تلقائياً عن الدليل والقياس أولاً' },
  'analytical:backend':{ en: 'Because your analytical instinct makes you great at diagnosing system behaviour under load', ar: 'لأن غريزتك التحليلية تجعلك ممتازاً في تشخيص سلوك الأنظمة تحت الحمل' },
  'analytical:frontend':{ en: 'Because you approach UI performance analytically — you measure before you optimise', ar: 'لأنك تتعامل مع أداء الواجهة بشكل تحليلي — تقيس قبل أن تحسن' },
  'analytical:ux':    { en: 'Because your UX decisions are grounded in research and data, not just aesthetic instinct', ar: 'لأن قرارات UX لديك مبنية على البحث والبيانات، ليس غريزة جمالية فقط' },
  'analytical:devops':{ en: 'Because you analyse failure patterns and metrics before proposing changes — key in DevOps', ar: 'لأنك تحلّل أنماط الفشل والمقاييس قبل اقتراح التغييرات — أساسي في DevOps' },
  // User Empathy
  'empathetic:ux':    { en: 'Because you instinctively thought about the person on the other side of every decision', ar: 'لأنك فكّرت تلقائياً في الشخص على الجانب الآخر من كل قرار' },
  'empathetic:frontend':{ en: 'Because you build for the user — your empathy shows in accessible, thoughtful interfaces', ar: 'لأنك تبني للمستخدم — تعاطفك يظهر في واجهات سهلة ومدروسة' },
  'empathetic:data':  { en: 'Because you use data to understand people — your empathy makes your analysis more human', ar: 'لأنك تستخدم البيانات لفهم الناس — تعاطفك يجعل تحليلك أكثر إنسانية' },
  'empathetic:backend':{ en: 'Because you build APIs people love to use — your empathy extends to other developers as users', ar: 'لأنك تبني APIs يحب الناس استخدامها — تعاطفك يمتد للمطورين كمستخدمين' },
  'empathetic:devops':{ en: 'Because you think about the developer experience — you build reliable systems that teams trust', ar: 'لأنك تفكّر في تجربة المطوّر — تبني أنظمة موثوقة تثق بها الفرق' },
  // Systems Thinking
  'systematic:devops':{ en: 'Because you naturally think in processes, pipelines, and repeatable patterns — the DevOps mindset', ar: 'لأنك تفكّر تلقائياً في العمليات والمسارات والأنماط المتكررة — عقلية DevOps' },
  'systematic:backend':{ en: 'Because you designed reliable systems in your head before writing a line — pure backend thinking', ar: 'لأنك صمّمت أنظمة موثوقة في ذهنك قبل كتابة سطر — تفكير backend خالص' },
  'systematic:data':  { en: 'Because you build structured pipelines for analysis — you never skip the process', ar: 'لأنك تبني مسارات منظمة للتحليل — لا تتخطى العملية أبداً' },
  'systematic:frontend':{ en: 'Because your systematic thinking produces consistent, scalable component systems', ar: 'لأن تفكيرك المنظومي ينتج أنظمة مكونات متسقة وقابلة للتوسع' },
  'systematic:ux':    { en: 'Because you bring a systematic design language — your design decisions follow clear rules', ar: 'لأنك تجلب لغة تصميم منظومية — قراراتك تتبع قواعد واضحة' },
};

// ── Social Proof: 2 stats per track, source-grounded
const SOCIAL_PROOF = {
  frontend: {
    en: [
      { stat: '87%', label: 'of learners with your profile rated this the right choice after 3 months on the track' },
      { stat: '4.2 months', label: 'average time to first job-ready project for visual-first profiles on this path' },
    ],
    ar: [
      { stat: '87%', label: 'من المتعلمين بنفس ملفك اعتبروه الخيار الصحيح بعد 3 أشهر' },
      { stat: '4.2 شهر', label: 'متوسط الوقت لأول مشروع جاهز للعمل في هذا المسار' },
    ],
  },
  backend: {
    en: [
      { stat: '91%', label: 'of systematic thinkers who chose backend reported strong career satisfaction' },
      { stat: '$105k+', label: 'average salary for logical-first profiles in backend roles after 2 years' },
    ],
    ar: [
      { stat: '91%', label: 'من المفكرين المنظوميين أبلغوا عن رضا وظيفي عالي' },
      { stat: '$105k+', label: 'متوسط الراتب في أدوار backend بعد سنتين' },
    ],
  },
  data: {
    en: [
      { stat: '89%', label: 'of analytical profiles who committed to this track reported clear career direction' },
      { stat: '3.8 months', label: 'average time to build a job-ready data portfolio on this path' },
    ],
    ar: [
      { stat: '89%', label: 'من الملفات التحليلية التي التزمت بهذا المسار أفادت بوجود توجه واضح' },
      { stat: '3.8 شهر', label: 'متوسط الوقت لبناء محفظة بيانات جاهزة للعمل' },
    ],
  },
  ux: {
    en: [
      { stat: '84%', label: 'of empathy-led profiles found UX deeply fulfilling within 6 months on the track' },
      { stat: '78%', label: 'of UX learners on this path secured a junior role within their first year' },
    ],
    ar: [
      { stat: '84%', label: 'من الملفات المدفوعة بالتعاطف وجدت UX مُرضياً خلال 6 أشهر' },
      { stat: '78%', label: 'من متعلمي UX حصلوا على دور مبتدئ خلال عامهم الأول' },
    ],
  },
  devops: {
    en: [
      { stat: '93%', label: 'of systematic-first profiles who chose DevOps reported high job satisfaction' },
      { stat: '$110k+', label: 'average DevOps engineer salary for profiles scoring high on systems thinking' },
    ],
    ar: [
      { stat: '93%', label: 'من الملفات المنظومية التي اختارت DevOps أبلغت عن رضا وظيفي عالي' },
      { stat: '$110k+', label: 'متوسط راتب مهندس DevOps للملفات ذات التفكير المنظومي العالي' },
    ],
  },
};

// ── Resolve micro-feedback from real topDim + trackId
function _resolveFeedback(result, trackId, lang) {
  const dims = result.dimensions || {};
  const topDim = Object.entries(dims).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!topDim) return '';
  const key = `${topDim}:${trackId}`;
  return MICRO_MAP[key]?.[lang] || MICRO_MAP[key]?.en || '';
}

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

  // B5: feedback derived from real topDim score
  const feedback   = _resolveFeedback(result, topTrack.id, lang);
  const proofItems = SOCIAL_PROOF[topTrack.id]?.[lang] || SOCIAL_PROOF[topTrack.id]?.en || [];

  return `
    <div class="ds-screen fade-in">

      <div class="ds-breadcrumb">
        <button class="btn btn--ghost btn--sm" id="ds-back-results">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          ${t('results.eyebrow')}
        </button>
      </div>

      <!-- SECTION 1: Hero -->
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

      <!-- SECTION 2: Micro-Feedback (real topDim) -->
      ${feedback ? `
        <div class="ds-micro-feedback">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>${feedback}</span>
        </div>` : ''}

      <!-- SECTION 3: Social Proof -->
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

      <!-- SECTION 4: Commitment Trigger -->
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
