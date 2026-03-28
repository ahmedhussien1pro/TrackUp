import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { PaymentService } from '../../services/payment.service.js';
import State from '../../state.js';

export function Payment() {
  const planId = State.getState('selectedPlanId') || 'pro';
  const plan   = PaymentService.getPlanById(planId);

  return `
    <div class="payment-screen">
      <div class="payment-screen__card">
        <h2 style="margin-bottom:var(--space-6)">${t('payment.title')}</h2>

        <div class="payment-screen__summary">
          <span>${plan?.name || 'Pro'} Plan</span>
          <strong>$${plan?.price || 19} / ${t('pricing.month')}</strong>
        </div>

        <form id="payment-form" novalidate>
          <div class="form-group">
            <label class="form-label">${t('payment.cardNumber')}</label>
            <input class="form-input" id="pay-card" type="text" placeholder="4242 4242 4242 4242" maxlength="19" />
          </div>
          <div class="payment-screen__row">
            <div class="form-group">
              <label class="form-label">${t('payment.expiry')}</label>
              <input class="form-input" id="pay-expiry" type="text" placeholder="MM / YY" maxlength="7" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('payment.cvv')}</label>
              <input class="form-input" id="pay-cvv" type="text" placeholder="123" maxlength="4" />
            </div>
          </div>
          <div id="pay-error" style="display:none"></div>
          <button type="submit" class="btn btn--primary btn--full btn--lg" id="pay-submit">
            ${t('payment.submit')}
          </button>
        </form>

        <p style="font-size:var(--text-xs);color:var(--color-text-muted);text-align:center;margin-top:var(--space-4)">
          This is a demo. No real payment is processed.
        </p>
      </div>
    </div>
  `;
}

export function PaymentEvents() {
  // Card number formatting
  document.getElementById('pay-card')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
  });

  // Expiry formatting
  document.getElementById('pay-expiry')?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    e.target.value = v;
  });

  document.getElementById('payment-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const card   = document.getElementById('pay-card').value.replace(/\s/g, '');
    const expiry = document.getElementById('pay-expiry').value;
    const cvv    = document.getElementById('pay-cvv').value;
    const errEl  = document.getElementById('pay-error');
    const btn    = document.getElementById('pay-submit');

    errEl.style.display = 'none';

    if (card.length < 16 || !expiry || cvv.length < 3) {
      errEl.textContent = t('payment.error');
      errEl.style.cssText = 'display:block;color:var(--color-danger);font-size:0.85rem;margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:#fee2e2;border-radius:6px;';
      return;
    }

    btn.disabled = true;
    btn.textContent = t('common.loading');

    const planId = State.getState('selectedPlanId') || 'pro';
    const plan   = PaymentService.getPlanById(planId);
    const result = await PaymentService.processPayment(plan);

    if (result.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: t('payment.success'),
        confirmButtonColor: 'var(--color-primary)',
      });
      Router.navigate('/dashboard');
    }
  });
}
