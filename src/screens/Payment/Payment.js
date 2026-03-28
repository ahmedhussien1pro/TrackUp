import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import { PaymentService } from '../../services/payment.service.js';
import State from '../../state.js';

const CARD_BRANDS = [
  { name: 'Visa',       pattern: /^4/,           color: '#1a1f71' },
  { name: 'Mastercard', pattern: /^5[1-5]/,      color: '#eb001b' },
  { name: 'Amex',       pattern: /^3[47]/,       color: '#2e77bc' },
];

function _detectBrand(num) {
  const clean = num.replace(/\s/g, '');
  return CARD_BRANDS.find(b => b.pattern.test(clean)) || null;
}

function _maskCard(num) {
  const clean = num.replace(/\s/g, '');
  const padded = clean.padEnd(16, '_');
  return [padded.slice(0,4), padded.slice(4,8), padded.slice(8,12), padded.slice(12,16)].join(' ');
}

export function Payment() {
  const planId = State.getState('selectedPlanId') || 'pro';
  const plan   = PaymentService.getPlanById(planId);
  const isAr   = document.documentElement.getAttribute('lang') === 'ar';

  return `
    <div class="payment-screen fade-in">

      <!-- Steps -->
      <div class="pay-steps">
        <div class="pay-step pay-step--done">
          <span class="pay-step__num">1</span>
          <span class="pay-step__label">${isAr ? 'اختيار الخطة' : 'Plan'}</span>
        </div>
        <div class="pay-step__line pay-step__line--done"></div>
        <div class="pay-step pay-step--active">
          <span class="pay-step__num">2</span>
          <span class="pay-step__label">${isAr ? 'بيانات الدفع' : 'Payment'}</span>
        </div>
        <div class="pay-step__line"></div>
        <div class="pay-step">
          <span class="pay-step__num">3</span>
          <span class="pay-step__label">${isAr ? 'تأكيد' : 'Confirm'}</span>
        </div>
      </div>

      <div class="pay-layout">

        <!-- Form side -->
        <div class="pay-form-wrap">
          <div class="pay-card-preview" id="pay-preview">
            <div class="pay-card-preview__brand" id="pay-brand-name">CARD</div>
            <div class="pay-card-preview__number" id="pay-preview-num">•••• •••• •••• ••••</div>
            <div class="pay-card-preview__bottom">
              <div>
                <div class="pay-card-preview__label">${isAr ? 'اسم حامل البطاقة' : 'Card holder'}</div>
                <div class="pay-card-preview__value" id="pay-preview-name">${State.getState('user')?.name || (isAr ? 'اسمك' : 'YOUR NAME')}</div>
              </div>
              <div style="text-align:end">
                <div class="pay-card-preview__label">${isAr ? 'تنتهي' : 'Expires'}</div>
                <div class="pay-card-preview__value" id="pay-preview-exp">MM / YY</div>
              </div>
            </div>
          </div>

          <form id="payment-form" novalidate>
            <div class="form-group">
              <label class="form-label">${isAr ? 'رقم البطاقة' : 'Card number'}</label>
              <input class="form-input" id="pay-card" type="text"
                     placeholder="4242 4242 4242 4242" maxlength="19"
                     inputmode="numeric" autocomplete="cc-number" />
            </div>
            <div class="pay-row">
              <div class="form-group">
                <label class="form-label">${isAr ? 'تاريخ الانتهاء' : 'Expiry'}</label>
                <input class="form-input" id="pay-expiry" type="text"
                       placeholder="MM / YY" maxlength="7"
                       inputmode="numeric" autocomplete="cc-exp" />
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input class="form-input" id="pay-cvv" type="text"
                       placeholder="123" maxlength="4"
                       inputmode="numeric" autocomplete="cc-csc" />
              </div>
            </div>

            <div id="pay-error" class="pay-error" style="display:none"></div>

            <button type="submit" class="btn btn--primary btn--full btn--lg" id="pay-submit">
              ${isAr ? `ادفع $${ plan?.price || 19}` : `Pay $${ plan?.price || 19}`}
            </button>

            <p class="pay-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              ${isAr ? 'محمي بتشفير 256-bit SSL. هذه بيئة تجريبية.' : 'Protected by 256-bit SSL. This is a demo environment.'}
            </p>
          </form>
        </div>

        <!-- Summary side -->
        <div class="pay-summary">
          <div class="pay-summary__title">${isAr ? 'ملخص الطلب' : 'Order summary'}</div>
          <div class="pay-summary__row">
            <span>${isAr ? (plan?.nameAr || plan?.name || 'Pro') : (plan?.name || 'Pro')} ${isAr ? 'خطة' : 'Plan'}</span>
            <span class="ltr-text">$${plan?.price || 19} / ${isAr ? 'شهر' : 'mo'}</span>
          </div>
          <div class="pay-summary__divider"></div>
          <div class="pay-summary__row pay-summary__row--total">
            <span>${isAr ? 'الإجمالي اليوم' : 'Due today'}</span>
            <span class="ltr-text">$${plan?.price || 19}</span>
          </div>
          <ul class="pay-summary__features">
            ${(plan?.features || []).map(f => `
              <li>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ${f}
              </li>`).join('')}
          </ul>
          <a href="#/pricing" class="pay-summary__change">${isAr ? 'تغيير الخطة' : 'Change plan'}</a>
        </div>

      </div>
    </div>`;
}

export function PaymentEvents() {
  const cardEl   = document.getElementById('pay-card');
  const expiryEl = document.getElementById('pay-expiry');

  cardEl?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    const preview = document.getElementById('pay-preview-num');
    const brand   = document.getElementById('pay-brand-name');
    const card    = document.getElementById('pay-preview');
    if (preview) preview.textContent = _maskCard(e.target.value);
    const b = _detectBrand(e.target.value);
    if (brand) brand.textContent = b ? b.name.toUpperCase() : 'CARD';
    if (card && b) card.style.setProperty('--card-color', b.color);
  });

  expiryEl?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2, 4);
    e.target.value = v;
    const el = document.getElementById('pay-preview-exp');
    if (el) el.textContent = e.target.value || 'MM / YY';
  });

  document.getElementById('payment-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const isAr  = document.documentElement.getAttribute('lang') === 'ar';
    const card  = cardEl?.value.replace(/\s/g, '') || '';
    const expiry= expiryEl?.value || '';
    const cvv   = document.getElementById('pay-cvv')?.value || '';
    const errEl = document.getElementById('pay-error');
    const btn   = document.getElementById('pay-submit');

    errEl.style.display = 'none';

    if (card.length < 16 || !expiry || cvv.length < 3) {
      errEl.textContent = isAr ? 'يرجى ملء جميع بيانات البطاقة' : 'Please fill in all card details';
      errEl.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = isAr ? 'جاري المعالجة...' : 'Processing...';

    const planId = State.getState('selectedPlanId') || 'pro';
    const plan   = PaymentService.getPlanById(planId);
    const result = await PaymentService.processPayment(plan);

    if (result.success) {
      await Swal.fire({
        icon: 'success',
        title: isAr ? 'تمت عملية الدفع' : 'Payment successful',
        text:  isAr ? 'مرحباً بك في TrackUp بلا حدود' : 'Welcome to TrackUp. Your plan is now active.',
        confirmButtonColor: 'var(--color-primary)',
      });
      Router.navigate('/dashboard');
    }
  });
}
