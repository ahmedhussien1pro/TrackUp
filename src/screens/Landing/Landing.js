import { Router } from '../../router.js';
import { TrackService } from '../../services/track.service.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

const TRACK_PREVIEWS = [
  {
    id: 'power',
    icon: 'PW',
    color: '#f59e0b',
    en: { name: 'Power Systems', desc: 'Design and maintain electrical grids, substations, and energy infrastructure.' },
    ar: { name: 'أنظمة القوى', desc: 'تصميم وصيانة شبكات الكهرباء ومحطات التوزيع والبنية التحتية للطاقة.' },
  },
  {
    id: 'embedded',
    icon: 'EM',
    color: '#6366f1',
    en: { name: 'Embedded Systems', desc: 'Program microcontrollers and build firmware for smart devices and IoT.' },
    ar: { name: 'الأنظمة المدمجة', desc: 'برمجة المتحكمات الدقيقة وبناء البرمجيات الثابتة للأجهزة الذكية.' },
  },
  {
    id: 'communications',
    icon: 'CM',
    color: '#10b981',
    en: { name: 'Communications', desc: 'Build wireless networks, fiber systems, and 5G infrastructure.' },
    ar: { name: 'الاتصالات', desc: 'بناء الشبكات اللاسلكية وأنظمة الألياف وبنية تحتية للجيل الخامس.' },
  },
  {
    id: 'career-shift',
    icon: 'CS',
    color: '#ec4899',
    en: { name: 'Career Shift', desc: 'A structured fast-track into electrical engineering from any background.' },
    ar: { name: 'تحويل المسار', desc: 'مسار سريع ومنظم للدخول للهندسة الكهربائية من أي خلفية.' },
  },
];

export function Landing() {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const isAr = lang === 'ar';

  const copy = {
    eyebrow: isAr ? 'اكتشف تخصصك الهندسي' : 'Discover Your Engineering Track',
    title:   isAr ? 'مش عارف تختار تخصص؟ خد الاختبار.' : 'Not sure which path to take? Take the test.',
    sub:     isAr
      ? 'TrackUp بيمشيك خطوة خطوة من إنك تايه لحد ما يبقى عندك مسار واضح وخطة تنفيذ حقيقية.'
      : 'TrackUp walks you step by step from confusion to a clear track and a real execution plan.',
    cta:     isAr ? 'ابدأ الاختبار' : 'Take the Test',
    demo:    isAr ? 'جرّب بدون تسجيل' : 'Try Without Signing Up',
    login:   isAr ? 'تسجيل الدخول' : 'Sign In',
    signup:  isAr ? 'إنشاء حساب' : 'Get Started',
    plans:   isAr ? 'الخطط' : 'Plans',
    tracksHeading: isAr ? 'التخصصات المتاحة' : 'Available Tracks',
    tracksSub:     isAr ? 'الاختبار يحدد الأنسب ليك من بينهم' : 'The test finds which one fits you best',
    exploreTrack:  isAr ? 'تعرف أكثر' : 'Learn More',
  };

  const steps = isAr ? [
    { n: '01', title: 'أجب على 7 أسئلة',    desc: 'تقيس ميولك وطريقة تفكيرك — مش بس مهاراتك.' },
    { n: '02', title: 'شوف نتيجتك',         desc: 'Top 3 تخصصات بنسبة توافق واضحة.' },
    { n: '03', title: 'ابدأ مسارك',          desc: 'خارطة طريق + كورسات + مرشد متخصص.' },
  ] : [
    { n: '01', title: 'Answer 7 questions', desc: 'Measures your mindset and work style — not just your skills.' },
    { n: '02', title: 'See your result',    desc: 'Top 3 tracks with a clear fit percentage.' },
    { n: '03', title: 'Start your path',   desc: 'Roadmap + courses + a matched mentor.' },
  ];

  const proof = isAr ? [
    { stat: '4',       label: 'مسارات هندسية' },
    { stat: '7',       label: 'أسئلة فقط' },
    { stat: '95%',     label: 'دقة في التوافق' },
    { stat: '3 دقائق', label: 'لمعرفة تخصصك' },
  ] : [
    { stat: '4',     label: 'Engineering Tracks' },
    { stat: '7',     label: 'Questions Only' },
    { stat: '95%',   label: 'Match Accuracy' },
    { stat: '3 min', label: 'To find your track' },
  ];

  return `
    <div class="landing">

      <nav class="landing__nav">
        <span class="landing__logo">TrackUp</span>
        <div class="landing__nav-links">
          <a href="#/pricing" class="btn btn--ghost btn--sm">${copy.plans}</a>
          <a href="#/login"   class="btn btn--outline btn--sm">${copy.login}</a>
          <a href="#/register" class="btn btn--primary btn--sm">${copy.signup}</a>
        </div>
      </nav>

      <!-- HERO -->
      <section class="landing__hero">
        <div class="landing__hero-content">
          <div class="landing__eyebrow">${copy.eyebrow}</div>
          <h1 class="landing__title">${copy.title}</h1>
          <p class="landing__subtitle">${copy.sub}</p>
          <div class="landing__cta-group">
            <a href="#/test" class="btn btn--primary btn--lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              ${copy.cta}
            </a>
            <button class="btn btn--outline btn--lg" id="landing-demo-btn">${copy.demo}</button>
          </div>
          <p class="landing__demo-hint">${isAr ? 'الاختبار مجاني — لا يتطلب إنشاء حساب' : 'Free test — no account required to start'}</p>
        </div>

        <div class="landing__hero-visual">
          <div class="landing__mockup">
            <div class="landing__mockup-bar"><span></span><span></span><span></span></div>
            <div class="landing__mockup-body">
              <div class="lm-eyebrow">${isAr ? 'نتيجتك المهنية' : 'Your Career Result'}</div>
              <div class="lm-track-row">
                <div class="lm-icon" style="background:#6366f118;color:#6366f1">EM</div>
                <div>
                  <div class="lm-name">${isAr ? 'أنظمة مدمجة' : 'Embedded Systems'}</div>
                  <div class="lm-fit"><span style="color:#6366f1;font-weight:700">89%</span> ${isAr ? 'توافق' : 'fit'}</div>
                </div>
                <span class="lm-badge">${isAr ? 'الأنسب' : 'Best Fit'}</span>
              </div>
              <div class="lm-dims">
                ${ [
                  { label: isAr ? 'التوجه الميداني'  : 'Field Orientation', pct: 82, color: '#f59e0b' },
                  { label: isAr ? 'تفكير الهاردوير' : 'Hardware Thinking',  pct: 76, color: '#6366f1' },
                  { label: isAr ? 'العقل التحليلي'  : 'Analytical Mind',    pct: 61, color: '#10b981' },
                ].map(d => `
                  <div class="lm-dim">
                    <div class="lm-dim__header"><span>${d.label}</span><span style="color:${d.color};font-weight:600" class="ltr-text">${d.pct}%</span></div>
                    <div class="lm-dim__bar"><div style="width:${d.pct}%;background:${d.color}"></div></div>
                  </div>`).join('') }
              </div>
              <div class="lm-tags">
                ${ (isAr
                  ? ['موجه للهاردوير', 'يحب بناء الأشياء', 'مدفوع بالمشكلات']
                  : ['Hardware-Oriented', 'Loves Building', 'Problem-Driven']
                ).map(s => `<span class="lm-tag">${s}</span>`).join('') }
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PROOF STATS -->
      <div class="landing__proof">
        ${proof.map(p => `
          <div class="landing__proof-item">
            <div class="landing__proof-stat">${p.stat}</div>
            <div class="landing__proof-label">${p.label}</div>
          </div>`).join('')}
      </div>

      <!-- TRACK PREVIEWS -->
      <section class="landing__tracks">
        <div class="landing__steps-header">
          <div class="landing__section-eyebrow">${copy.tracksHeading}</div>
          <h2 class="landing__section-title">${copy.tracksSub}</h2>
        </div>
        <div class="landing__tracks-grid">
          ${TRACK_PREVIEWS.map(tr => {
            const t = isAr ? tr.ar : tr.en;
            return `
              <div class="landing__track-card">
                <div class="landing__track-icon" style="background:${tr.color}18;color:${tr.color}">${tr.icon}</div>
                <div class="landing__track-name">${t.name}</div>
                <div class="landing__track-desc">${t.desc}</div>
                <a href="#/career?id=${tr.id}" class="btn btn--ghost btn--sm" style="margin-top:var(--space-3)">${copy.exploreTrack}</a>
              </div>`;
          }).join('')}
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="landing__steps">
        <div class="landing__steps-header">
          <div class="landing__section-eyebrow">${isAr ? 'كيف يعمل' : 'How it works'}</div>
          <h2 class="landing__section-title">${isAr ? 'من التيه إلى الوضوح في 3 خطوات' : 'From confusion to clarity in 3 steps'}</h2>
        </div>
        <div class="landing__steps-grid">
          ${steps.map(s => `
            <div class="landing__step">
              <div class="landing__step-num">${s.n}</div>
              <h3 class="landing__step-title">${s.title}</h3>
              <p class="landing__step-desc">${s.desc}</p>
            </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:var(--space-10)">
          <a href="#/test" class="btn btn--primary btn--lg">${copy.cta}</a>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="landing__final-cta">
        <h2>${isAr ? 'جاهز تعرف تخصصك؟' : 'Ready to find your engineering track?'}</h2>
        <p>${isAr ? 'الاختبار مجاني ويأخذ 3 دقائق فقط.' : 'The test is free and takes only 3 minutes.'}</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap">
          <a href="#/test" class="btn btn--primary btn--lg">${copy.cta}</a>
          <button class="btn btn--outline btn--lg" id="landing-demo-btn-2">${copy.demo}</button>
        </div>
      </section>

    </div>`;
}

export function LandingEvents() {
  function _activateDemo() {
    const isAr = document.documentElement.getAttribute('lang') === 'ar';

    // BUG-05 FIX: always wipe old demo/test data before injecting fresh demo
    StorageService.remove('testResult');
    StorageService.remove('enrollments');
    StorageService.remove('bookings');
    StorageService.remove('committed_track_id');
    StorageService.remove('path_committed');
    StorageService.remove('dismissed_save_banner');
    StorageService.remove('first_run_dismissed');
    State.setState('testResult', null);

    const demoResult = {
      topTrackId: 'embedded',
      top3: [
        { id: 'embedded',       score: 32, pct: 100 },
        { id: 'communications', score: 24, pct: 75  },
        { id: 'power',          score: 18, pct: 56  },
      ],
      scores:      { power: 18, embedded: 32, communications: 24, 'career-shift': 10 },
      percentages: { power: 56, embedded: 100, communications: 75, 'career-shift': 31 },
      confidence:  { level: 'high', gap: 25 },
      dimensions:  { fieldwork: 71, software: 64, hardware: 86, analytical: 57, systematic: 43, resilient: 71, ambitious: 50, adaptive: 29 },
      strengthSentence: {
        en: 'You love the intersection of hardware and code — building smart devices that solve real problems.',
        ar: 'تحب تلاقي الهاردوير والكود — بناء أجهزة ذكية تحل مشكلات حقيقية.',
      },
      completedAt: Date.now(),
    };

    State.setState('testResult', demoResult);
    StorageService.set('testResult', demoResult);

    const existingUser = State.getState('user');
    if (!existingUser) {
      const demoUser = {
        id: 'demo-user',
        name: isAr ? 'أحمد حسين' : 'Ahmed Hussien',
        email: 'demo@trackup.io',
        activeTrackId: 'embedded',
        createdAt: Date.now(),
      };
      State.setState('user', demoUser);
      StorageService.set('user', demoUser);
    }

    TrackService.enrollInTrack('embedded');

    StorageService.set('enrollments', [
      { courseId: 'c-em-1', progress: 100, status: 'completed', enrolledAt: Date.now() - 86400000 },
      { courseId: 'c-em-2', progress: 35,  status: 'active',    enrolledAt: Date.now() },
    ]);
    StorageService.set('bookings', [
      { mentorId: 'm3', mentorName: isAr ? 'م. أحمد نور' : 'Eng. Ahmed Nour', bookedAt: Date.now(), status: 'confirmed' },
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

    setTimeout(() => Router.navigate('/dashboard'), 400);
  }

  document.getElementById('landing-demo-btn')?.addEventListener('click', _activateDemo);
  document.getElementById('landing-demo-btn-2')?.addEventListener('click', _activateDemo);
}
