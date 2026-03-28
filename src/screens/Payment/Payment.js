import { t } from '../../i18n.js';
import { PaymentService } from '../../services/payment.service.js';
import { Router } from '../../router.js';
import State from '../../state.js';
import { showToast } from '../../utils.js';

export function Payment() {
  const plan = State.getState('activePlan');
  if (!plan) { Router.navigate('/pricing'); return ''; }
  return `
    <div class="payment-screen">
      <div class="payment-screen__card">
        <h2>${t('payment.title')}</h2>
        <div class="payment-screen__summary">
          <span>${plan.name}</span>
          <strong>$${plan.price} / ${t('pricing.month')}</strong>
        </div>
        <form id="payment-form" novalidate>
          <div class="form-group">
            <label class="form-label">${t('payment.cardNumber')}</label>
            <input class="form-input" id="pay-card" placeholder="4242 4242 4242 4242" maxlength="19" />
          </div>
          <div class="payment-screen__row">
            <div class="form-group">
              <label class="form-label">${t('payment.expiry')}</label>
              <input class="form-input" id="pay-expiry" placeholder="MM/YY" maxlength="5" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('payment.cvv')}</label>
              <input class="form-input" id="pay-cvv" placeholder="123" maxlength="3" />
            </div>
          </div>
          <button type="submit" class="btn btn--primary btn--full">
            ${t('payment.submit')}
          </button>
        </form>
      </div>
    </div>
  `;
}

export function PaymentEvents() {
  document.getElementById('payment-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const plan = State.getState('activePlan');
    const result = await PaymentService.processPayment(plan);
    if (result.success) {
      showToast(t('payment.success'), 'success');
      Router.navigate('/dashboard');
    } else {
      showToast(t('payment.error'), 'error');
    }
  });
}
