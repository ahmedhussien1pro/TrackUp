import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { PaymentService } from '../../services/payment.service.js';
import State from '../../state.js';

export function Pricing() {
  const plans = PaymentService.getPlans();
  const activePlan = PaymentService.getActivePlan();

  return `
    <div class="pricing-screen" style="max-width:960px;margin:0 auto;padding:var(--space-8) var(--space-4)">
      <div class="pricing-screen__header" style="text-align:center;margin-bottom:var(--space-10)">
        <h1>${t('pricing.title')}</h1>
        <p>${t('pricing.subtitle')}</p>
      </div>
      <div class="pricing-screen__plans">
        ${plans.map(plan => `
          <div class="pricing-card ${plan.recommended ? 'pricing-card--featured' : ''}">
            ${plan.recommended ? `<div class="pricing-card__badge">${t('pricing.recommended')}</div>` : ''}
            <div class="pricing-card__name">${plan.name}</div>
            <div class="pricing-card__price">
              <span class="pricing-card__amount">${plan.price === 0 ? t('pricing.free') : '$' + plan.price}</span>
              ${plan.price > 0 ? `<span class="pricing-card__period">/ ${t('pricing.month')}</span>` : ''}
            </div>
            <ul class="pricing-card__features">
              ${plan.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <button
              class="btn ${plan.recommended ? 'btn--primary' : 'btn--outline'} btn--full pricing-select-btn"
              data-plan-id="${plan.id}"
              ${activePlan?.id === plan.id ? 'disabled' : ''}
            >
              ${activePlan?.id === plan.id ? 'Current Plan' : t('pricing.select')}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
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
