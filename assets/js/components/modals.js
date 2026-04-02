// openPremiumLock — skips entirely if premium already active
window.openPremiumLock = function openPremiumLock(targetView) {
  // If already unlocked, just navigate — never show the upgrade modal
  if (state.premiumUnlocked) {
    if (targetView) navigateTo(targetView);
    return;
  }

  const lang = state.language;
  const freeList = [
    lang === 'ar' ? 'إعداد الملف الشخصي' : 'Profile setup',
    lang === 'ar' ? 'الاختبار القصير' : 'Short assessment',
    lang === 'ar' ? 'أفضل 3 نتائج' : 'Top 3 ranked results',
    lang === 'ar' ? 'تفاصيل المسار الأساسية' : 'Basic track details',
    lang === 'ar' ? 'معاينة الخارطة' : 'Roadmap preview',
    lang === 'ar' ? 'بطاقات التعلم المبدئي' : 'Starter learning cards',
  ];
  const paidList = [
    lang === 'ar' ? 'تحليل ملاءمة مخصص وأعمق' : 'Personalized deeper fit analysis',
    lang === 'ar' ? 'توجيه خارطة أقوى' : 'Stronger roadmap guidance',
    lang === 'ar' ? 'رؤى إرشادية من زاوية المهندس' : 'Mentor-oriented insights',
    lang === 'ar' ? 'فتح جميع خطوات الخارطة' : 'All roadmap steps unlocked',
    lang === 'ar' ? 'الوصول لحجز الجلسات المدفوعة' : 'Paid session booking access',
  ];

  Swal.fire({
    title: t('premiumTitle'),
    html: `
      <div style="text-align:${state.direction === 'rtl' ? 'right' : 'left'};display:grid;gap:12px;">
        <div style="padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:${state.theme === 'dark' ? '#111827' : '#f8fafc'};">
          <div style="font-size:11px;font-weight:700;letter-spacing:.06em;margin-bottom:8px;color:#64748b;">${t('visibleFree')}</div>
          ${freeList.map(i => `<div style="font-size:13px;color:${state.theme === 'dark' ? '#94a3b8' : '#475569'};margin:4px 0;display:flex;align-items:center;gap:6px;"><span style="color:#16a34a;font-weight:700;">✓</span>${i}</div>`).join('')}
        </div>
        <div style="padding:14px;border-radius:12px;border:1px solid rgba(21,150,242,.25);background:${state.theme === 'dark' ? 'rgba(21,150,242,.07)' : 'rgba(21,150,242,.06)'};">
          <div style="font-size:11px;font-weight:700;letter-spacing:.06em;margin-bottom:8px;color:#1596f2;">${t('premiumUnlocks')}</div>
          ${paidList.map(i => `<div style="font-size:13px;color:${state.theme === 'dark' ? '#e2e8f0' : '#1e293b'};margin:4px 0;display:flex;align-items:center;gap:6px;"><span style="color:#1596f2;font-weight:700;">+</span>${i}</div>`).join('')}
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: t('upgradeNow'),
    cancelButtonText: t('continueFree'),
    confirmButtonColor: '#1596f2',
    background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
    color: state.theme === 'dark' ? '#fafafa' : '#09090b',
  }).then(result => {
    if (result.isConfirmed) {
      state.premiumUnlocked = true;
      updateProgress('premiumUnlocked', true);
      persistState();
      showToast(t('premiumActive'), '#1596f2');
      if (targetView) navigateTo(targetView);
      else renderApp();
    }
  });
};

window.openSessionGate = function openSessionGate() {
  if (state.premiumUnlocked) {
    navigateTo('session-booking');
    return;
  }
  Swal.fire({
    title: t('sessionsPaid'),
    text: t('premiumReason'),
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: t('upgradeNow'),
    cancelButtonText: t('continueFree'),
    confirmButtonColor: '#1596f2',
    background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
    color: state.theme === 'dark' ? '#fafafa' : '#09090b',
  }).then(result => {
    if (result.isConfirmed) openPremiumLock('session-booking');
  });
};
