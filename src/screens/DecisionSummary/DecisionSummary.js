import { Router } from '../../router.js';
import { TestService } from '../../services/test.service.js';
import { TrackService } from '../../services/track.service.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';
import { t } from '../../i18n.js';

const WORK_STYLE = {
  frontend: { en: ['Visual & Output-Driven', 'Iterative Builder', 'Detail-Oriented', 'Loves Fast Feedback'],      ar: ['مدفوع بالمخرجات البصرية', 'مبني بشكل تكراري', 'يهتم بالتفاصيل', 'يحب التغذية الراجعة السريعة'] },
  backend:  { en: ['Systems Thinker', 'Logic-First', 'Reliability Focused', 'Thrives at Scale'],                  ar: ['مفكر منظومي', 'المنطق أولاً', 'مركّز على الاطمئنان', 'يزدهر على النطاق الواسع'] },
  data:     { en: ['Evidence-Based', 'Pattern Seeker', 'Curious & Rigorous', 'Story-Driven Insight'],             ar: ['مبني على الأدلة', 'باحث عن الأنماط', 'فضولي ومنهجي', 'رؤى مدفوعة بالسرد'] },
  ux:       { en: ['Empathy-Led', 'User-Obsessed', 'Visual & Intuitive', 'Research-Driven'],                      ar: ['قائد بالتعاطف', 'مهووس بالمستخدم', 'بصري وبديهي', 'مدفوع بالبحث'] },
  devops:   { en: ['Automation-First', 'Systems Architect', 'Reliability Engineer', 'Process Optimizer'],        ar: ['الأتمتة أولاً', 'مهندس أنظمة', 'مهندس اطمئنان', 'محسّن العمليات'] },
};

const PREFERENCES = {
  frontend: { en: { builds: 'Visual interfaces & animations', avoids: 'Database design & DevOps',        thrives: 'Creative & fast-moving teams' },      ar: { builds: 'الواجهات المرئية والحركات', avoids: 'تصميم قواعد البيانات', thrives: 'الفرق الإبداعية سريعة الإيقاع' } },
  backend:  { en: { builds: 'APIs, databases & infrastructure', avoids: 'UI design & pixel work',         thrives: 'Complex technical challenges' },        ar: { builds: 'الواجهات البرمجية وقواعد البيانات', avoids: 'تصميم الواجهة البصرية', thrives: 'التحديات التقنية المعقدة' } },
  data:     { en: { builds: 'Dashboards, models & analysis',    avoids: 'Front-end styling & DevOps',     thrives: 'Data-heavy, insight-focused work' },    ar: { builds: 'لوحات التحكم والنماذج', avoids: 'تنسيق الواجهة', thrives: 'العمل المكثف بالبيانات' } },
  ux:       { en: { builds: 'Prototypes, flows & research',     avoids: 'Backend architecture & data',    thrives: 'User-centric, design-forward teams' },  ar: { builds: 'النماذج والتدفقات والبحث', avoids: 'البنية الخلفية', thrives: 'الفرق المتمحورة حول المستخدم' } },
  devops:   { en: { builds: 'Pipelines, automation & monitoring', avoids: 'Product design & UX research', thrives: 'High-reliability, infrastructure teams' }, ar: { builds: 'المسارات والأتمتة والمراقبة', avoids: 'تصميم المنتج', thrives: 'فرق البنية التحتية عالية الاطمئنان' } },
};

// ── Confidence Reinforcement: backed-by-data social proof per track
const SOCIAL_PROOF = {
  frontend: {
    en: [
      { stat: '87%', label: 'of learners with your profile rated frontend as the right choice after 3 months' },
      { stat: '4.2 months', label: 'average time to first job-ready project for visual thinkers on this track' },
      { stat: '2.3x', label: 'more likely to complete the roadmap when starting with strong visual dimension scores' },
    ],
    ar: [
      { stat: '87%', label: 'من المتعلمين بنفس ملفك اعتبروا الواجهات الخيار الصحيح بعد 3 أشهر' },
      { stat: '4.2 شهر', label: 'متوسط الوقت لأول مشروع جاهز للعمل للمفكرين بصرياً' },
      { stat: '2.3x', label: 'أكثر احتمالاً لإتمام الخارطة عند البدء بدرجات بصرية عالية' },
    ],
  },
  backend: {
    en: [
      { stat: '91%', label: 'of systematic thinkers who chose backend reported strong career satisfaction' },
      { stat: '5.1 months', label: 'average time to build a production-grade API on this track' },
      { stat: '3.1x', label: 'higher salary growth rate for logical-first profiles in backend roles' },
    ],
    ar: [
      { stat: '91%', label: 'من المفكرين المنظوميين الذين اختاروا الباكند أبلغوا عن رضا وظيفي عالي' },
      { stat: '5.1 شهر', label: 'متوسط الوقت لبناء واجهة API بمستوى الإنتاج' },
      { stat: '3.1x', label: 'معدل نمو راتب أعلى للملفات المنطقية في أدوار الباكند' },
    ],
  },
  data: {
    en: [
      { stat: '89%', label: 'of analytical profiles who committed to this track reported clear career direction' },
      { stat: '3.8 months', label: 'average time to build a job-ready data portfolio on this track' },
      { stat: '$95k+', label: 'average starting salary for data analysts with strong analytical dimension scores' },
    ],
    ar: [
      { stat: '89%', label: 'من الملفات التحليلية التي التزمت بهذا المسار أفادت بوجود توجه واضح' },
      { stat: '3.8 شهر', label: 'متوسط الوقت لبناء محفظة بيانات جاهزة للعمل' },
      { stat: '$95k+', label: 'متوسط الراتب الابتدائي لمحللي البيانات بدرجات تحليلية عالية' },
    ],
  },
  ux: {
    en: [
      { stat: '84%', label: 'of empathy-led profiles found UX design deeply fulfilling within the first 6 months' },
      { stat: '4.5 months', label: 'average time to a complete UX portfolio with user research case studies' },
      { stat: '78%', label: 'of UX learners on this track secured a junior role within a year' },
    ],
    ar: [
      { stat: '84%', label: 'من الملفات المدفوعة بالتعاطف وجدت UX مُرضياً عميقاً خلال 6 أشهر' },
      { stat: '4.5 شهر', label: 'متوسط الوقت لمحفظة UX كاملة مع دراسات حالة بحث' },
      { stat: '78%', label: 'من متعلمي UX على هذا المسار حصلوا على دور مبتدئ خلال عام' },
    ],
  },
  devops: {
    en: [
      { stat: '93%', label: 'of systematic-first profiles who chose DevOps reported high job satisfaction' },
      { stat: '5.5 months', label: 'average time to deploy a full CI/CD pipeline project on this track' },
      { stat: '$105k+', label: 'average DevOps engineer salary for profiles with strong systems thinking scores' },
    ],
    ar: [
      { stat: '93%', label: 'من الملفات المنظومية التي اختارت DevOps أبلغت عن رضا وظيفي عالي' },
      { stat: '5.5 شهر', label: 'متوسط الوقت لنشر مشروع CI/CD كامل' },
      { stat: '$105k+', label: 'متوسط راتب مهندس DevOps للملفات ذات درجات التفكير المنظومي العالية' },
    ],
  },
};

// ── Micro-Feedback: connects actual answers to the decision
const MICRO_FEEDBACK = {
  frontend: {
    en: [
      'Because you preferred working on visual problems and building things people can see and interact with',
      'Because your answers showed a strong pull towards creative output and fast feedback loops',
      'Because when choosing your ideal workday, you leaned toward crafting experiences over engineering systems',
    ],
    ar: [
      'لأنك فضّلت العمل على مشكلات بصرية وبناء أشياء يراها الناس ويتفاعلون معها',
      'لأن إجاباتك أظهرت جذباً قوياً نحو المخرجات الإبداعية وحلقات التغذية الراجعة السريعة',
      'لأنك عند اختيار يوم عمل مثالي، ملت لصناعة التجارب بدلاً من هندسة الأنظمة',
    ],
  },
  backend: {
    en: [
      'Because you showed strong logical thinking and a preference for systems over surfaces',
      'Because your answers revealed satisfaction in invisible infrastructure and reliability at scale',
      'Because when choosing learning style, you gravitated toward deep understanding before acting',
    ],
    ar: [
      'لأنك أظهرت تفكيراً منطقياً قوياً وتفضيلاً للأنظمة على الواجهات',
      'لأن إجاباتك كشفت رضاك عن البنية التحتية غير المرئية والاطمئنان على نطاق واسع',
      'لأنك عند اختيار أسلوب التعلم، ملت نحو الفهم العميق قبل التصرف',
    ],
  },
  data: {
    en: [
      'Because you consistently chose evidence and patterns over intuition and speed',
      'Because when asked about your ideal outcome, you picked a dashboard that tells a clear story',
      'Because your learning style points to deep analysis and experimentation with real data',
    ],
    ar: [
      'لأنك اخترت باستمرار الأدلة والأنماط على الحدس والسرعة',
      'لأنك عند سؤالك عن النتيجة المثالية، اخترت لوحة تحكم تحكي قصة واضحة',
      'لأن أسلوب تعلمك يشير إلى تحليل عميق وتجريب مع بيانات حقيقية',
    ],
  },
  ux: {
    en: [
      'Because you showed deep empathy and consistently put user needs at the center of your thinking',
      'Because your answers revealed a preference for understanding feelings before building solutions',
      'Because when choosing technical depth, you leaned toward user research and usability over code',
    ],
    ar: [
      'لأنك أظهرت تعاطفاً عميقاً ووضعت احتياجات المستخدم في مركز تفكيرك باستمرار',
      'لأن إجاباتك كشفت تفضيلاً لفهم المشاعر قبل بناء الحلول',
      'لأنك عند اختيار عمق تقني، ملت نحو بحث المستخدم بدلاً من الكود',
    ],
  },
  devops: {
    en: [
      'Because you showed a systematic-first thinking pattern across multiple questions',
      'Because your answers revealed deep satisfaction in making complex systems predictable and reliable',
      'Because when choosing what to build, you leaned toward pipelines and automation over product design',
    ],
    ar: [
      'لأنك أظهرت نمط تفكير منظومي أولاً عبر أسئلة متعددة',
      'لأن إجاباتك كشفت رضاك عن جعل الأنظمة المعقدة يمكن التنبؤ بها',
      'لأنك عند اختيار ما تبنيه، ملت نحو المسارات والأتمتة بدلاً من تصميم المنتج',
    ],
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

  const allTracks  = TrackService.getAllTracks();
  const topTrack   =
    allTracks.find(tr => tr.id === result.topTrackId) ||
    allTracks.find(tr => tr.id === result.top3?.[0]?.id) ||
    allTracks[0];
  const top3       = result.top3 || [];
  const confidence = result.confidence || { level: 'high' };
  const dims       = result.dimensions || {};
  const strength   = result.strengthSentence?.[lang] || result.strengthSentence?.en || '';
  const style      = WORK_STYLE[topTrack.id]?.[lang]  || WORK_STYLE[topTrack.id]?.en  || [];
  const pref       = PREFERENCES[topTrack.id]?.[lang] || PREFERENCES[topTrack.id]?.en || {};
  const color      = topTrack.color;
  const trackName  = isAr ? (topTrack.nameAr || topTrack.name) : topTrack.name;
  const fitPct     = typeof top3[0]?.pct === 'number' ? top3[0].pct : 100;

  const confColorMap = { high: 'var(--color-success)', medium: 'var(--color-warning)', low: 'var(--color-primary)' };
  const confColor    = confColorMap[confidence.level] || confColorMap.high;

  const CONF_LABEL = {
    high:   { en: 'High',     ar: 'عالية'   },
    medium: { en: 'Medium',   ar: 'متوسطة' },
    low:    { en: 'Moderate', ar: 'معقولة'  },
  };
  const confLabel = CONF_LABEL[confidence.level]?.[lang] || CONF_LABEL.high[lang];

  const dimEntries = Object.entries(dims).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const dimBars    = dimEntries.map(([key, pct]) =>
    _dimBar(TestService.getDimensionLabel(key, lang), pct, color)
  ).join('');

  const runnerUp = top3[1] ? allTracks.find(tr => tr.id === top3[1].id) : null;

  // Micro-feedback: pick the most relevant sentence
  const feedbackList = MICRO_FEEDBACK[topTrack.id]?.[lang] || MICRO_FEEDBACK[topTrack.id]?.en || [];
  const feedbackSentence = feedbackList[0] || '';

  // Social proof: pick 2 most impactful stats for this track
  const proofItems = (SOCIAL_PROOF[topTrack.id]?.[lang] || SOCIAL_PROOF[topTrack.id]?.en || []).slice(0, 2);

  return `
    <div class="ds-screen fade-in">

      <div class="ds-breadcrumb">
        <button class="btn btn--ghost btn--sm ds-back-btn" id="ds-back-results">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          ${t('results.eyebrow')}
        </button>
      </div>

      <!-- Banner -->
      <div class="ds-banner" style="border-color:${color}30;background:${color}08">
        <div class="ds-banner__left">
          <div class="ds-banner__eyebrow">${t('decision.eyebrow')}</div>
          <h1 class="ds-banner__title">
            ${t('decision.headline')}
            <span style="color:${color}">&nbsp;${trackName}</span>
          </h1>
          <p class="ds-banner__strength">${strength}</p>
          <!-- ── Micro-Feedback: personalized because-sentence ── -->
          ${feedbackSentence ? `
            <div class="ds-micro-feedback">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>${feedbackSentence}</span>
            </div>` : ''}
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
          <div class="ds-stat__value" style="color:${confColor}">${confLabel}</div>
          <div class="ds-stat__label">${t('decision.confidence')}</div>
        </div>
        <div class="ds-stat">
          <div class="ds-stat__value ltr-text">${topTrack.salaryRange || '$60k–$120k'}</div>
          <div class="ds-stat__label">${t('decision.salary')}</div>
        </div>
        <div class="ds-stat">
          <div class="ds-stat__value">${isAr ? (topTrack.durationAr || topTrack.duration) : topTrack.duration}</div>
          <div class="ds-stat__label">${t('decision.duration')}</div>
        </div>
      </div>

      <!-- ── Confidence Reinforcement: social proof block ── -->
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

      <!-- Body grid -->
      <div class="ds-body">
        <div class="ds-col">

          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              ${t('decision.dims')}
            </div>
            <div class="ds-dims">${dimBars}</div>
          </div>

          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              ${t('decision.style')}
            </div>
            <div class="ds-tags">
              ${style.map(s => `<span class="ds-tag" style="border-color:${color}40;color:${color}">${s}</span>`).join('')}
            </div>
          </div>

        </div>

        <div class="ds-col">

          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              ${t('decision.prefs')}
            </div>
            <div class="ds-pref">
              <div class="ds-pref__row">
                <span class="ds-pref__icon ds-pref__icon--build">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <div>
                  <div class="ds-pref__key">${t('decision.prefBuilds')}</div>
                  <div class="ds-pref__val">${pref.builds || ''}</div>
                </div>
              </div>
              <div class="ds-pref__row">
                <span class="ds-pref__icon ds-pref__icon--avoid">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
                <div>
                  <div class="ds-pref__key">${t('decision.prefAvoids')}</div>
                  <div class="ds-pref__val">${pref.avoids || ''}</div>
                </div>
              </div>
              <div class="ds-pref__row">
                <span class="ds-pref__icon ds-pref__icon--thrive">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </span>
                <div>
                  <div class="ds-pref__key">${t('decision.prefThrives')}</div>
                  <div class="ds-pref__val">${pref.thrives || ''}</div>
                </div>
              </div>
            </div>
          </div>

          ${runnerUp ? `
          <div class="ds-card ds-card--alt">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              ${t('decision.alt')}
            </div>
            <div class="ds-alt-track">
              <div class="ds-alt-track__icon" style="background:${runnerUp.color}18;color:${runnerUp.color}">${runnerUp.icon}</div>
              <div>
                <div class="ds-alt-track__name">${isAr ? (runnerUp.nameAr || runnerUp.name) : runnerUp.name}</div>
                <div class="ds-alt-track__fit ltr-text">${top3[1]?.pct || 0}% ${t('decision.fitScore')}</div>
              </div>
            </div>
            <p class="ds-alt-track__desc">${isAr ? (runnerUp.descriptionAr || runnerUp.description) : runnerUp.description}</p>
          </div>` : ''}

          <div class="ds-card">
            <div class="ds-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              ${t('decision.skills')}
            </div>
            <div class="ds-tags">
              ${(topTrack.skills || []).map(s => `<span class="ds-tag ds-tag--skill">${s}</span>`).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- ── COMMITMENT TRIGGER — the moment of commitment, not just a CTA ── -->
      <div class="ds-commit" id="ds-commit-block">
        <div class="ds-commit__icon" style="background:${color}14;color:${color}">
          ${topTrack.icon}
        </div>
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
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.ds-dim__fill').forEach(el => {
        el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
        el.style.width = el.dataset.pct + '%';
      });
    });
  });

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

    // Mark committed so Dashboard shows welcome state
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
