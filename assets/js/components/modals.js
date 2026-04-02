window.openPremiumLock = function openPremiumLock(targetView = 'pricing') {
  const freeList = [t('profileCompleted'), t('testCompleted'), t('resultsViewed'), t('roadmapPreview'), t('coursesTitle')];
  const paidList = [t('premiumTitle'), t('premiumReason'), t('strongerPaid'), t('sessionsPaid')];
  Swal.fire({
    title: t('premiumTitle'),
    html: `
      <div style="text-align:${state.direction === 'rtl' ? 'right' : 'left'};display:grid;gap:12px;">
        <div style="padding:14px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:${state.theme === 'dark' ? '#111111' : '#fafafa'};">
          <div style="font-size:12px;font-weight:700;margin-bottom:8px;">${t('visibleFree')}</div>
          ${freeList.map(i => `<div style="font-size:14px;color:${state.theme === 'dark' ? '#a1a1aa' : '#52525b'};margin:4px 0;">• ${i}</div>`).join('')}
        </div>
        <div style="padding:14px;border-radius:16px;border:1px solid rgba(59,130,246,.18);background:${state.theme === 'dark' ? 'rgba(59,130,246,.08)' : 'rgba(37,99,235,.08)'};">
          <div style="font-size:12px;font-weight:700;margin-bottom:8px;">${t('premiumUnlocks')}</div>
          ${paidList.map(i => `<div style="font-size:14px;color:${state.theme === 'dark' ? '#d4d4d8' : '#27272a'};margin:4px 0;">• ${i}</div>`).join('')}
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: t('upgradeNow'),
    cancelButtonText: t('continueFree'),
    confirmButtonColor: '#2563eb',
    background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
    color: state.theme === 'dark' ? '#fafafa' : '#09090b'
  }).then(result => {
    if (result.isConfirmed) {
      state.premiumUnlocked = true;
      updateProgress('premiumUnlocked', true);
      persistState();
      showToast(t('premiumActive'), '#2563eb');
      navigateTo(targetView);
    }
  });
};

window.openSessionGate = function openSessionGate() {
  Swal.fire({
    title: t('sessionsPaid'),
    text: t('premiumReason'),
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: t('upgradeNow'),
    cancelButtonText: t('continueFree'),
    confirmButtonColor: '#2563eb',
    background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
    color: state.theme === 'dark' ? '#fafafa' : '#09090b'
  }).then(result => {
    if (result.isConfirmed) openPremiumLock('session-booking');
  });
};
