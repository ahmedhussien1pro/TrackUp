import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import State from '../../state.js';

export function Landing() {
  return `
    <div class="landing">
      <nav class="landing__nav">
        <span class="landing__logo">TrackUp</span>
        <div class="landing__nav-links">
          <a href="#/pricing" class="btn btn--ghost btn--sm">${t('landing.hero.pricingLink')}</a>
          <a href="#/login"   class="btn btn--outline btn--sm">${t('auth.login.submit')}</a>
          <a href="#/register" class="btn btn--primary btn--sm">${t('auth.register.submit')}</a>
        </div>
      </nav>

      <section class="landing__hero">
        <div class="landing__hero-content">
          <div class="landing__eyebrow">Career Intelligence Platform</div>
          <h1 class="landing__title">${t('landing.hero.title')}</h1>
          <p class="landing__subtitle">${t('landing.hero.subtitle')}</p>
          <div class="landing__cta-group">
            <a href="#/register" class="btn btn--primary btn--lg" id="landing-cta">${t('landing.hero.cta')}</a>
            <a href="#/pricing" class="btn btn--ghost btn--lg">${t('landing.hero.pricingLink')}</a>
          </div>
        </div>
        <div class="landing__hero-visual">
          <div class="landing__mockup">
            <div class="landing__mockup-bar">
              <span></span><span></span><span></span>
            </div>
            <div class="landing__mockup-body">
              <div class="landing__mock-track">
                <div class="landing__mock-icon">FE</div>
                <div>
                  <div class="landing__mock-name">Frontend Engineer</div>
                  <div class="landing__mock-progress">
                    <div class="landing__mock-bar" style="width:68%"></div>
                  </div>
                </div>
              </div>
              <div class="landing__mock-track">
                <div class="landing__mock-icon" style="background:#f0fdf4;color:#16a34a">DS</div>
                <div>
                  <div class="landing__mock-name">Data Science</div>
                  <div class="landing__mock-progress">
                    <div class="landing__mock-bar" style="width:34%;background:#16a34a"></div>
                  </div>
                </div>
              </div>
              <div class="landing__mock-steps">
                <div class="landing__mock-step done">HTML Foundations</div>
                <div class="landing__mock-step done">CSS & Layout</div>
                <div class="landing__mock-step active">JavaScript Core</div>
                <div class="landing__mock-step locked">React Basics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="landing__features">
        ${[
          { icon: 'A', title: 'Smart Assessment', desc: 'A 5-minute test maps your skills and goals to the right career track.' },
          { icon: 'B', title: 'Personalized Roadmap', desc: 'Step-by-step learning plan built around your pace and schedule.' },
          { icon: 'C', title: '1-on-1 Mentorship', desc: 'Book sessions with industry experts who have been where you want to go.' },
        ].map(f => `
          <div class="landing__feature">
            <div class="landing__feature-icon">${f.icon}</div>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
          </div>
        `).join('')}
      </section>
    </div>
  `;
}
