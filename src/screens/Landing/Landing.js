import { t } from '../../i18n.js';
import { Router } from '../../router.js';

export function Landing() {
  return `
    <section class="landing-hero">
      <div class="landing-hero__inner">
        <h1 class="landing-hero__title">${t('landing.hero.title')}</h1>
        <p class="landing-hero__sub">${t('landing.hero.subtitle')}</p>
        <button
          class="btn btn--primary btn--lg"
          onclick="Router.navigate('/test')">
          ${t('landing.hero.cta')}
        </button>
        <a class="landing-hero__pricing-link" href="#/pricing">
          ${t('landing.hero.pricingLink')}
        </a>
      </div>
    </section>
  `;
}
