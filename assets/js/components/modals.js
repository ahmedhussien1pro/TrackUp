/* ── openPremiumLock ──────────────────────────────────────────
   Shows a real payment simulation modal (Visa/Mastercard form).
   Skips entirely if premium is already active.
──────────────────────────────────────────────────────────────── */
window.openPremiumLock = function openPremiumLock(targetView) {
  if (state.premiumUnlocked) {
    if (targetView) navigateTo(targetView);
    return;
  }
  const isAr = state.language === 'ar';
  const dark  = state.theme === 'dark';

  Swal.fire({
    title: isAr ? 'ترقية إلى Premium' : 'Upgrade to Premium',
    html: `
      <div style="text-align:${isAr ? 'right' : 'left'};display:grid;gap:1rem;font-family:inherit;">

        <!-- plan summary -->
        <div style="background:${dark ? 'rgba(37,99,235,.12)' : 'rgba(37,99,235,.07)'};border:1px solid rgba(37,99,235,.25);border-radius:12px;padding:.85rem 1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
          <div>
            <div style="font-weight:800;font-size:.95rem;">Premium Plan</div>
            <div style="font-size:.78rem;color:#64748b;margin-top:.15rem;">${isAr ? 'وصول كامل لكل المحتوى' : 'Full access — all content unlocked'}</div>
          </div>
          <div style="font-size:1.4rem;font-weight:800;color:#2563eb;">99 <span style="font-size:.8rem;font-weight:600;">${isAr ? 'ج.م / شهر' : 'EGP/mo'}</span></div>
        </div>

        <!-- card number -->
        <div>
          <label style="font-size:.75rem;font-weight:700;letter-spacing:.06em;color:#64748b;display:block;margin-bottom:.4rem;">${isAr ? 'رقم البطاقة' : 'CARD NUMBER'}</label>
          <input id="swal-card-num" maxlength="19" placeholder="1234  5678  9012  3456"
            oninput="this.value=this.value.replace(/[^0-9]/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19)"
            style="width:100%;padding:.6rem .8rem;border-radius:10px;border:1px solid ${dark ? '#334155' : '#cbd5e1'};background:${dark ? '#0f172a' : '#f8fafc'};color:${dark ? '#f1f5f9' : '#0f172a'};font-size:.95rem;letter-spacing:.1em;outline:none;box-sizing:border-box;" />
        </div>

        <!-- expiry + cvv -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
          <div>
            <label style="font-size:.75rem;font-weight:700;letter-spacing:.06em;color:#64748b;display:block;margin-bottom:.4rem;">${isAr ? 'تاريخ الانتهاء' : 'EXPIRY'}</label>
            <input id="swal-expiry" maxlength="5" placeholder="MM/YY"
              oninput="let v=this.value.replace(/[^0-9]/g,'');if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);this.value=v;"
              style="width:100%;padding:.6rem .8rem;border-radius:10px;border:1px solid ${dark ? '#334155' : '#cbd5e1'};background:${dark ? '#0f172a' : '#f8fafc'};color:${dark ? '#f1f5f9' : '#0f172a'};font-size:.95rem;outline:none;box-sizing:border-box;" />
          </div>
          <div>
            <label style="font-size:.75rem;font-weight:700;letter-spacing:.06em;color:#64748b;display:block;margin-bottom:.4rem;">CVV</label>
            <input id="swal-cvv" maxlength="3" placeholder="•••" type="password"
              oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,3)"
              style="width:100%;padding:.6rem .8rem;border-radius:10px;border:1px solid ${dark ? '#334155' : '#cbd5e1'};background:${dark ? '#0f172a' : '#f8fafc'};color:${dark ? '#f1f5f9' : '#0f172a'};font-size:.95rem;outline:none;box-sizing:border-box;" />
          </div>
        </div>

        <!-- cardholder name -->
        <div>
          <label style="font-size:.75rem;font-weight:700;letter-spacing:.06em;color:#64748b;display:block;margin-bottom:.4rem;">${isAr ? 'اسم حامل البطاقة' : 'CARDHOLDER NAME'}</label>
          <input id="swal-name" placeholder="${isAr ? 'الاسم كما هو على البطاقة' : 'Name as on card'}"
            style="width:100%;padding:.6rem .8rem;border-radius:10px;border:1px solid ${dark ? '#334155' : '#cbd5e1'};background:${dark ? '#0f172a' : '#f8fafc'};color:${dark ? '#f1f5f9' : '#0f172a'};font-size:.95rem;outline:none;box-sizing:border-box;" />
        </div>

        <!-- secure badge -->
        <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:#64748b;justify-content:center;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${isAr ? 'بيانات مشفّرة — محاكاة آمنة' : 'Encrypted & secure — simulation only'}
        </div>

      </div>
    `,
    showCancelButton: true,
    confirmButtonText: isAr ? 'ادفع الآن — 99 ج.م' : 'Pay Now — 99 EGP',
    cancelButtonText:  isAr ? 'إلغاء' : 'Cancel',
    confirmButtonColor: '#2563eb',
    background: dark ? '#0a0a0a' : '#ffffff',
    color:      dark ? '#fafafa' : '#09090b',
    focusConfirm: false,
    preConfirm: () => {
      const cardNum = (document.getElementById('swal-card-num')?.value || '').replace(/\s/g,'');
      const expiry  =  document.getElementById('swal-expiry')?.value  || '';
      const cvv     =  document.getElementById('swal-cvv')?.value     || '';
      const name    = (document.getElementById('swal-name')?.value    || '').trim();
      if (cardNum.length < 16) {
        Swal.showValidationMessage(isAr ? 'رقم البطاقة غير مكتمل' : 'Card number is incomplete');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        Swal.showValidationMessage(isAr ? 'تاريخ الانتهاء غير صحيح' : 'Invalid expiry date');
        return false;
      }
      if (cvv.length < 3) {
        Swal.showValidationMessage(isAr ? 'CVV غير مكتمل' : 'CVV is incomplete');
        return false;
      }
      if (!name) {
        Swal.showValidationMessage(isAr ? 'أدخل اسم حامل البطاقة' : 'Enter cardholder name');
        return false;
      }
      return true;
    }
  }).then(result => {
    if (!result.isConfirmed) return;

    /* ── processing animation ── */
    Swal.fire({
      title: isAr ? 'جارٍ المعالجة...' : 'Processing...',
      html:  `<div style="color:#64748b;font-size:.88rem;">${isAr ? 'لحظة واحدة' : 'Please wait a moment'}</div>`,
      timer: 1800,
      timerProgressBar: true,
      showConfirmButton: false,
      background: dark ? '#0a0a0a' : '#ffffff',
      color:      dark ? '#fafafa' : '#09090b',
      didOpen: () => Swal.showLoading()
    }).then(() => {
      updateProgress('premiumUnlocked', true);
      persistState();
      Swal.fire({
        icon: 'success',
        title: isAr ? 'تم الدفع بنجاح' : 'Payment Successful',
        html: `<div style="font-size:.9rem;color:#64748b;">${isAr ? 'مرحباً بك في Premium — كل المحتوى مفتوح الآن.' : 'Welcome to Premium — all content is now unlocked.'}</div>`,
        confirmButtonText: isAr ? 'ابدأ الآن' : 'Get Started',
        confirmButtonColor: '#2563eb',
        background: dark ? '#0a0a0a' : '#ffffff',
        color:      dark ? '#fafafa' : '#09090b',
      }).then(() => {
        showToast(isAr ? 'تم تفعيل Premium' : 'Premium activated', '#16a34a', 'shield-check');
        if (targetView) navigateTo(targetView);
        else navigateTo('progress');
      });
    });
  });
};

/* ── openSessionGate ─────────────────────────────────────────── */
window.openSessionGate = function openSessionGate() {
  if (state.premiumUnlocked) {
    navigateTo('session-booking');
    return;
  }
  openPremiumLock('session-booking');
};
