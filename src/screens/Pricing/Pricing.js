import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { PaymentService } from '../../services/payment.service.js';
import State from '../../state.js';

const CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const CROSS = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

export function Pricing() {
  const plans      = PaymentService.getPlans();
  const activePlan = PaymentService.getActivePlan();
  const isAr       = document.documentElement.getAttribute('lang') === 'ar';
  const loggedIn   = !!State.getState('user');

  const allFeatures = [...new Set(plans.flatMap(p => p.features))];

  // BUG-02 FIX: minimal nav for public (guest) users since layout is not mounted
  const guestNav = !loggedIn ? `
    <nav class="public-nav">
      <a href="#/" class="public-nav__logo">TrackUp</a>
      <div class="public-nav__actions">
        <a href="#/" class="btn btn--ghost btn--sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          ${isAr ? 'الرئيسية' : 'Home'}
        </a>
        <a href="#/login"    class="btn btn--outline btn--sm">${isAr ? 'تسجيل الدخول' : 'Sign In'}</a>
        <a href="#/register" class="btn btn--primary btn--sm">${isAr ? 'إنشاء حساب' : 'Get Started'}</a>
      </div>
    </nav>` : '';

  return `
    <div class="pricing-screen fade-in">

      ${guestNav}

      <div class="pricing-header">
        <p class="pricing-header__eyebrow">${isAr ? 'الأسعار' : 'Pricing'}</p>
        <h1 class="pricing-header__title">${isAr ? 'اختر الخطة المناسبة' : 'Choose the right plan'}</h1>
        <p class="pricing-header__sub">${isAr
          ? 'ابدأ مجاناً وحدّث في أي وقت. لا توجد تكاليف خفية.'
          : 'Start free and upgrade anytime. No hidden fees.'
        }</p>
      </div>

      <div class="pricing-cards">
        ${plans.map(plan => {
          const isCurrent  = activePlan?.id === plan.id;
          const isFeatured = plan.recommended;
          return `
            <div class="pricing-card${isFeatured ? ' pricing-card--featured' : ''}${isCurrent ? ' pricing-card--current' : ''}">
              ${isFeatured ? `<div class="pricing-card__badge">${isAr ? 'الأكثر شيوعاً' : 'Most popular'}</div>` : ''}
              ${isCurrent  ? `<div class="pricing-card__badge pricing-card__badge--current">${isAr ? 'خطتك الحالية' : 'Current plan'}</div>` : ''}
              <div class="pricing-card__name">${isAr ? (plan.nameAr || plan.name) : plan.name}</div>
              <div class="pricing-card__price">
                <span class="pricing-card__amount">${plan.price === 0 ? (isAr ? 'مجاني' : 'Free') : '$' + plan.price}</span>
                ${plan.price > 0 ? `<span class="pricing-card__period"> / ${isAr ? 'شهر' : 'mo'}</span>` : ''}
              </div>
              <ul class="pricing-card__features">
                ${plan.features.map(f => `
                  <li>
                    <span class="pricing-card__feat-icon" style="color:${isFeatured ? 'var(--color-primary)' : 'var(--color-success)'}">${CHECK}</span>
                    ${f}
                  </li>`).join('')}
              </ul>
              <button
                class="btn ${isFeatured ? 'btn--primary' : 'btn--outline'} btn--full pricing-select-btn"
                data-plan-id="${plan.id}"
                ${isCurrent ? 'disabled' : ''}
              >
                ${isCurrent
                  ? (isAr ? 'خطتك الحالية' : 'Current plan')
                  : plan.price === 0
                    ? (isAr ? 'ابدأ مجاناً' : 'Get started free')
                    : (isAr ? 'ابدأ الآن' : 'Get started')
                }
              </button>
            </div>`;
        }).join('')}
      </div>

      <div class="pricing-table slide-up" style="animation-delay:0.2s">
        <div class="pricing-table__title">${isAr ? 'مقارنة الميزات' : 'Feature comparison'}</div>
        <div class="pricing-table__grid" style="grid-template-columns: 1fr ${plans.map(() => '1fr').join(' ')}">
          <div class="pricing-table__cell pricing-table__cell--header"></div>
          ${plans.map(p => `
            <div class="pricing-table__cell pricing-table__cell--header pricing-table__cell--plan${p.recommended ? ' pricing-table__cell--featured' : ''}">
              ${isAr ? (p.nameAr || p.name) : p.name}
            </div>`).join('')}
          ${allFeatures.map(feat => `
            <div class="pricing-table__cell pricing-table__cell--feat">${feat}</div>
            ${plans.map(p => {
              const has = p.features.includes(feat);
              return `<div class="pricing-table__cell${p.recommended ? ' pricing-table__cell--featured' : ''}">
                <span style="color:${has ? 'var(--color-success)' : 'var(--color-text-muted)'}">${has ? CHECK : CROSS}</span>
              </div>`;
            }).join('')}`).join('')}
        </div>
      </div>

      <p class="pricing-trust">
        ${isAr ? 'لا توجد بيانات بنك مطلوبة. إلغاء في أي وقت.' : 'No credit card required. Cancel anytime.'}
      </p>

    </div>`;
}

export function PricingEvents() {
  document.querySelectorAll('.pricing-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.dataset.planId;
      if (planId === 'free') {
        PaymentService.processPayment(PaymentService.getPlanById('free'));
        Router.navigate('/register');
        return;
      }
      State.setState('selectedPlanId', planId);
      Router.navigate('/payment');
    });
  });
}
