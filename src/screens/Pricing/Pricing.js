import { t } from '../../i18n.js';
import { PaymentService } from '../../services/payment.service.js';
import { Router } from '../../router.js';
import State from '../../state.js';

export function Pricing() {
  const plans = PaymentService.getPlans();
  return `
    <div class="pricing-screen">
      <div class="pricing-screen__header">
        <h2>${t('pricing.title')}</h2>
        <p>${t('pricing.subtitle')}</p>
      </div>
      <div class="pricing-screen__plans">
        ${plans.map(plan => `
          <div class="pricing-card ${plan.recommended ? 'pricing-card--featured' : ''}">
            ${plan.recommended ? `<span class="pricing-card__badge">${t('pricing.recommended')}</span>` : ''}
            <h3 class="pricing-card__name">${plan.name}</h3>
            <div class="pricing-card__price">
              <span class="pricing-card__amount">${plan.price === 0 ? t('pricing.free') : '$' + plan.price}</span>
              ${plan.price > 0 ? `<span class="pricing-card__period">/ ${t('pricing.month')}</span>` : ''}
            </div>
            <ul class="pricing-card__features">
              ${plan.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <button
              class="btn ${plan.recommended ? 'btn--primary' : 'btn--outline'} btn--full"
              onclick="selectPlan('${plan.id}')">
              ${t('pricing.select')}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function PricingEvents() {
  window.selectPlan = (planId) => {
    const plans = PaymentService.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    if (plan.price === 0) {
      State.setState('activePlan', plan);
      Router.navigate('/dashboard');
    } else {
      State.setState('activePlan', plan);
      Router.navigate('/payment');
    }
  };
}
