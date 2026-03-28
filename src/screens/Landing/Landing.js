import { Router } from '../../router.js';
import { TrackService } from '../../services/track.service.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

export function Landing() {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const isAr = lang === 'ar';

  const hero = {
    eyebrow: isAr ? 'محرك قرارات المسار المهني' : 'Career Decision Engine',
    title:   isAr
      ? 'لا تخمّن مسارك. اكتشفه.'
      : 'Stop guessing your career. Discover it.',
    sub: isAr
      ? 'TrackUp يحلّل كيف تفكر، ما تبني، وما يحفّزك — ثم يعطيك مساراً واضحاً وخطة تنفيذ حقيقية.'
      : 'TrackUp analyses how you think, what you build, and what drives you — then gives you a clear path and a real execution plan.',
    cta:    isAr ? 'اكتشف مسارك مجاناً' : 'Discover Your Path — Free',
    demo:   isAr ? 'جرّب العرض التوضيحي' : 'Try Live Demo',
    login:  isAr ? 'تسجيل الدخول' : 'Sign In',
    signup: isAr ? 'إنشاء حساب' : 'Get Started',
    plans:  isAr ? 'عرض الخطط' : 'View Plans',
  };

  const steps = isAr ? [
    { n: '01', title: 'أجب على 7 أسئلة ذكية',  desc: 'تقيس أسلوب تفكيرك، ميولك، وما يحفّزك — ليس فقط مهاراتك.' },
    { n: '02', title: 'احصل على ملخص قرارك',  desc: 'ملف شخصي كامل: درجة التوافق، الأبعاد المعرفية، وأسلوب عملك.' },
    { n: '03', title: 'نفّذ بخارطة مخصصة',     desc: 'دورات، مرشدون، وخطوات واضحة مبنية على مسارك تحديداً.' },
  ] : [
    { n: '01', title: 'Answer 7 smart questions',   desc: 'We measure how you think, not just what you know — across 7 cognitive dimensions.' },
    { n: '02', title: 'Get your Decision Summary',  desc: 'A full profile: fit score, cognitive map, work style, and strongest career alignment.' },
    { n: '03', title: 'Execute with a real plan',    desc: 'Courses, mentors, and a step-by-step roadmap built specifically for your track.' },
  ];

  const proof = isAr ? [
    { stat: '7',       label: 'أبعاد معرفية' },
    { stat: '5',       label: 'مسارات مهنية' },
    { stat: '95%',     label: 'نسبة الثقة في التوافق' },
    { stat: '3 دقائق', label: 'لمعرفة مسارك' },
  ] : [
    { stat: '7',     label: 'Cognitive Dimensions' },
    { stat: '5',     label: 'Career Tracks' },
    { stat: '95%',   label: 'Confidence in Results' },
    { stat: '3 min', label: 'To discover your path' },
  ];

  const features = isAr ? [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      title: 'تقييم ذكي يتكيّف معك',
      desc: '7 أسئلة تقيس أسلوب تفكيرك عبر 6 أبعاد معرفية. ليس اختبار مهارات — بل محرك قرار.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
      title: 'ملخص قرار شخصي',
      desc: 'درجة توافق، مستوى ثقة، أبعاد معرفية، وأسلوب عمل — كلها في شاشة واحدة واضحة.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      title: 'خارطة تنفيذ حقيقية',
      desc: 'خطوات مرتبة، دورات مختارة، ومرشدون متخصصون — كل شيء منظّم حول مسارك.',
    },
  ] : [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      title: 'Adaptive Decision Assessment',
      desc: '7 questions that measure your thinking style across 6 cognitive dimensions. Not a skills test — a decision engine.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
      title: 'Personal Decision Summary',
      desc: 'Fit score, confidence level, cognitive map, work style — all in one clear, personalized screen.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      title: 'Real Execution Roadmap',
      desc: 'Ordered milestones, curated courses, and matched mentors — everything organised around your specific track.',
    },
  ];

  return `
    <div class="landing">

      <nav class="landing__nav">
        <span class="landing__logo">TrackUp</span>
        <div class="landing__nav-links">
          <a href="#/pricing" class="btn btn--ghost btn--sm">${hero.plans}</a>
          <a href="#/login"   class="btn btn--outline btn--sm">${hero.login}</a>
          <a href="#/register" class="btn btn--primary btn--sm">${hero.signup}</a>
        </div>
      </nav>

      <section class="landing__hero">
        <div class="landing__hero-content">
          <div class="landing__eyebrow">${hero.eyebrow}</div>
          <h1 class="landing__title">${hero.title}</h1>
          <p class="landing__subtitle">${hero.sub}</p>
          <div class="landing__cta-group">
            <a href="#/register" class="btn btn--primary btn--lg">${hero.cta}</a>
            <button class="btn btn--outline btn--lg" id="landing-demo-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ${hero.demo}
            </button>
          </div>
          <p class="landing__demo-hint">${isAr ? 'يعمل العرض بدون تسجيل — يأخذك مباشرة إلى نتائج مخصصة' : 'Demo works without signup — takes you straight to a personalised result'}</p>
        </div>

        <div class="landing__hero-visual">
          <div class="landing__mockup">
            <div class="landing__mockup-bar"><span></span><span></span><span></span></div>
            <div class="landing__mockup-body">
              <div class="lm-eyebrow">${isAr ? 'ملخص قرارك المهني' : 'Career Decision Summary'}</div>
              <div class="lm-track-row">
                <div class="lm-icon" style="background:#6366f118;color:#6366f1">FE</div>
                <div>
                  <div class="lm-name">${isAr ? 'مهندس واجهات' : 'Frontend Engineer'}</div>
                  <div class="lm-fit"><span style="color:#6366f1;font-weight:700">92%</span> ${isAr ? 'توافق' : 'fit'}</div>
                </div>
                <span class="lm-badge">${isAr ? 'الأنسب' : 'Best Fit'}</span>
              </div>
              <div class="lm-dims">
                ${[
                  { label: isAr ? 'التفكير البصري' : 'Visual Thinking',  pct: 86, color: '#6366f1' },
                  { label: isAr ? 'الإبداع والإخراج' : 'Creative Output',  pct: 79, color: '#ec4899' },
                  { label: isAr ? 'التعاطف مع المستخدم' : 'User Empathy',  pct: 57, color: '#10b981' },
                ].map(d => `
                  <div class="lm-dim">
                    <div class="lm-dim__header"><span>${d.label}</span><span style="color:${d.color};font-weight:600" class="ltr-text">${d.pct}%</span></div>
                    <div class="lm-dim__bar"><div style="width:${d.pct}%;background:${d.color}"></div></div>
                  </div>`).join('')}
              </div>
              <div class="lm-tags">
                ${(isAr
                  ? ['مدفوع بالمخرجات البصرية','مبني بشكل تكراري','يهتم بالتفاصيل']
                  : ['Visual & Output-Driven','Iterative Builder','Detail-Oriented']
                ).map(s => `<span class="lm-tag">${s}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="landing__proof">
        ${proof.map(p => `
          <div class="landing__proof-item">
            <div class="landing__proof-stat">${p.stat}</div>
            <div class="landing__proof-label">${p.label}</div>
          </div>`).join('')}
      </div>

      <section class="landing__steps">
        <div class="landing__steps-header">
          <div class="landing__section-eyebrow">${isAr ? 'كيف يعمل' : 'How it works'}</div>
          <h2 class="landing__section-title">${isAr ? 'من الارتباك إلى الوضوح في 3 خطوات' : 'From confusion to clarity in 3 steps'}</h2>
        </div>
        <div class="landing__steps-grid">
          ${steps.map(s => `
            <div class="landing__step">
              <div class="landing__step-num">${s.n}</div>
              <h3 class="landing__step-title">${s.title}</h3>
              <p class="landing__step-desc">${s.desc}</p>
            </div>`).join('')}
        </div>
      </section>

      <section class="landing__features">
        ${features.map(f => `
          <div class="landing__feature">
            <div class="landing__feature-icon">${f.icon}</div>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
          </div>`).join('')}
      </section>

      <section class="landing__final-cta">
        <h2>${isAr ? 'مستعد لمعرفة مسارك الحقيقي؟' : 'Ready to discover your real career path?'}</h2>
        <p>${isAr ? 'لا اشتراك مطلوب للبدء. التقييم مجاني تماماً.' : 'No subscription required to start. The assessment is completely free.'}</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap">
          <a href="#/register" class="btn btn--primary btn--lg">${isAr ? 'ابدأ مجاناً' : 'Start for Free'}</a>
          <button class="btn btn--outline btn--lg" id="landing-demo-btn-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            ${hero.demo}
          </button>
        </div>
      </section>

    </div>`;
}

export function LandingEvents() {
  function _activateDemo() {
    const isAr = document.documentElement.getAttribute('lang') === 'ar';

    const demoResult = {
      topTrackId: 'frontend',
      top3: [
        { id: 'frontend', score: 30, pct: 92 },
        { id: 'ux',       score: 22, pct: 73 },
        { id: 'backend',  score: 16, pct: 53 },
      ],
      scores:      { frontend: 30, ux: 22, backend: 16, data: 10, devops: 8 },
      percentages: { frontend: 92, ux: 73, backend: 53, data: 33, devops: 27 },
      confidence:  { level: 'high', gap: 19 },
      dimensions:  { visual: 86, creative: 79, empathetic: 57, analytical: 43, logical: 36, systematic: 21 },
      strengthSentence: {
        en: 'You think in visuals, care about output, and love building things people interact with.',
        ar: 'تفكّر بصرياً، تهتم بالمخرجات، وتحب بناء ما يتفاعل معه الناس.',
      },
      completedAt: Date.now(),
    };

    State.setState('testResult', demoResult);
    StorageService.set('testResult', demoResult);
    StorageService.set('first_run_dismissed', false);

    // Pre-set demo user session if no user logged in
    const existingUser = State.getState('user');
    if (!existingUser) {
      const demoUser = {
        id: 'demo-user',
        name: isAr ? 'أحمد حسين' : 'Ahmed Hussien',
        email: 'demo@trackup.io',
        activeTrackId: 'frontend',
        createdAt: Date.now(),
      };
      State.setState('user', demoUser);
      StorageService.set('user', demoUser);
    }

    TrackService.enrollInTrack('frontend');

    StorageService.set('enrollments', [
      { courseId: 'c-fe-1', progress: 100, status: 'completed', enrolledAt: Date.now() - 86400000 },
      { courseId: 'c-fe-2', progress: 42,  status: 'active',    enrolledAt: Date.now() },
    ]);
    StorageService.set('bookings', [
      { mentorId: 'm1', mentorName: 'Sarah El-Rashidy', bookedAt: Date.now(), status: 'confirmed' },
    ]);

    if (window.Toastify) {
      Toastify({
        text:     isAr ? 'جاري تحميل العرض التوضيحي...' : 'Loading demo...',
        duration: 1600,
        gravity:  'bottom',
        position: 'right',
        style:    { background: 'var(--color-primary)' },
      }).showToast();
    }

    setTimeout(() => Router.navigate('/results'), 400);
  }

  document.getElementById('landing-demo-btn')?.addEventListener('click', _activateDemo);
  document.getElementById('landing-demo-btn-2')?.addEventListener('click', _activateDemo);
}
