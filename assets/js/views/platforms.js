// ============================================================
// platforms.js — Platform Recommendations view
// Sections:
//   1. Your Top Picks (based on sub-track result)
//   2. Browse All (filterable by type: free / paid / all)
// ============================================================

window.renderPlatformsView = function renderPlatformsView() {
  const isAr = state.language === 'ar';
  const isPremium = state.premiumUnlocked;

  const userSubtrack = getUserSubtrack();
  const topIds = userSubtrack ? (SUBTRACK_TOP_PLATFORMS[userSubtrack] || []) : [];
  const topPlatforms = topIds.map(id => ALL_PLATFORMS.find(p => p.id === id)).filter(Boolean);

  if (window._platformFilter === undefined) window._platformFilter = 'all';
  const filter = window._platformFilter;

  const filtered = filter === 'all'
    ? ALL_PLATFORMS
    : ALL_PLATFORMS.filter(p => p.type === filter);

  const typeLabel = { free: isAr ? 'مجاني' : 'Free', paid: isAr ? 'مدفوع' : 'Paid', freemium: 'Freemium' };
  const typeColor = { free: '#16a34a', paid: '#2563eb', freemium: '#d97706' };

  function platformCard(p, highlight = false) {
    const showPromo = p.promoCode && isPremium;
    const blurPromo = p.promoCode && !isPremium;
    return `
      <a href="${p.url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;"
        class="platform-card ${highlight ? 'platform-card--top' : ''}">
        <div class="platform-card-inner">
          <div class="platform-icon" style="background:${p.color}18;border-color:${p.color}33;">
            <i data-lucide="${p.icon}" style="width:1.4rem;height:1.4rem;color:${p.color};"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
              <span style="font-weight:800;font-size:.97rem;">${p.name}</span>
              <span class="platform-badge" style="background:${typeColor[p.type]}18;color:${typeColor[p.type]};border-color:${typeColor[p.type]}33;">
                ${typeLabel[p.type] || p.type}
              </span>
              ${p.promoCode ? `<span class="platform-badge" style="background:#16a34a18;color:#16a34a;border-color:#16a34a33;font-size:.68rem;">PROMO</span>` : ''}
            </div>
            <p class="text-muted" style="font-size:.83rem;line-height:1.6;margin-top:.3rem;">${isAr ? p.descAr : p.descEn}</p>
            ${showPromo ? `
              <div style="display:flex;align-items:center;gap:.4rem;margin-top:.5rem;">
                <span style="font-size:.75rem;color:var(--text-muted);">${isAr ? 'كود خصم:' : 'Promo code:'}</span>
                <code class="promo-code-chip" onclick="copyPromo('${p.promoCode}',event)">
                  <i data-lucide="copy" style="width:.75rem;height:.75rem;"></i>
                  ${p.promoCode}
                </code>
              </div>
            ` : blurPromo ? `
              <div style="display:flex;align-items:center;gap:.4rem;margin-top:.5rem;">
                <span style="font-size:.75rem;color:var(--text-muted);">${isAr ? 'كود خصم:' : 'Promo code:'}</span>
                <span style="font-size:.78rem;filter:blur(4px);background:var(--surface-3);padding:2px 10px;border-radius:6px;user-select:none;color:var(--text-muted);cursor:pointer;"
                  onclick="event.preventDefault();openPremiumLock('pricing')">
                  XXXXXXXX
                </span>
                <span style="font-size:.72rem;color:var(--accent);cursor:pointer;" onclick="event.preventDefault();openPremiumLock('pricing')">
                  <i data-lucide="lock" style="width:.7rem;height:.7rem;"></i>
                  ${isAr ? 'للمدفوع' : 'Premium'}
                </span>
              </div>
            ` : ''}
          </div>
          <div style="flex-shrink:0;">
            <span class="btn btn-secondary" style="font-size:.78rem;padding:.35rem .8rem;pointer-events:none;">
              ${isAr ? 'زور' : 'Visit'}
              <i data-lucide="arrow-${isAr ? 'left' : 'right'}" style="width:.75rem;height:.75rem;"></i>
            </span>
          </div>
        </div>
      </a>
    `;
  }

  return `
    <div style="display:grid;gap:1.5rem;">

      <!-- Header -->
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${isAr ? 'منصات التعلم' : 'Learning Platforms'}</div>
          <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'اختار منصتك وابدأ' : 'Pick Your Platform & Start'}</h2>
          <p class="text-muted" style="font-size:.88rem;margin-top:.4rem;max-width:560px;line-height:1.7;">
            ${isAr
              ? 'منصات مجانية ومدفوعة مختارة بعناية بناءً على تخصصك. أعضاء الباقة المدفوعة يحصلون على كود خصم حصري.'
              : 'Carefully curated free and paid platforms based on your sub-track. Premium members get exclusive promo codes.'}
          </p>
        </div>
        ${!isPremium ? `
          <div class="surface-soft section-pad" style="border:1px solid rgba(234,179,8,.2);max-width:240px;">
            <div style="display:flex;gap:.4rem;align-items:center;margin-bottom:.3rem;">
              <i data-lucide="lock" style="width:.9rem;height:.9rem;color:#eab308;"></i>
              <span style="font-weight:700;font-size:.82rem;color:#eab308;">${isAr ? 'أكواد الخصم للمدفوع' : 'Promo codes — Premium only'}</span>
            </div>
            <p class="text-muted" style="font-size:.78rem;line-height:1.6;">${isAr ? 'اشترك للحصول على أكواد خصم حصرية.' : 'Upgrade to unlock exclusive discount codes.'}</p>
            <button class="btn btn-secondary" style="width:100%;margin-top:.6rem;font-size:.78rem;" onclick="openPremiumLock('pricing')">
              ${isAr ? 'الباقات' : 'View Pricing'}
            </button>
          </div>
        ` : ''}
      </div>

      ${topPlatforms.length ? `
        <div class="surface-panel section-pad" data-aos="fade-up">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
            <div>
              <div class="eyebrow" style="color:var(--accent);">${isAr ? 'خياراتك المقترحة' : 'Your Top Picks'}</div>
              <div style="font-weight:800;font-size:1.05rem;margin-top:.25rem;">
                ${isAr ? 'بناءً على نتيجة اختبارك' : 'Based on your sub-track test result'}
              </div>
            </div>
            <span class="mentor-tag" style="font-size:.8rem;display:inline-flex;align-items:center;gap:.3rem;">
              <i data-lucide="layers-3" style="width:.85rem;height:.85rem;"></i>
              ${isAr ? (SUBTRACK_PLATFORMS[userSubtrack]?.nameAr || '') : (SUBTRACK_PLATFORMS[userSubtrack]?.nameEn || '')}
            </span>
          </div>
          <div style="display:grid;gap:.75rem;">
            ${topPlatforms.map(p => platformCard(p, true)).join('')}
          </div>
        </div>
      ` : `
        <div class="surface-panel section-pad" style="text-align:center;" data-aos="fade-up">
          <div style="margin-bottom:.75rem;">
            <i data-lucide="compass" style="width:2rem;height:2rem;color:var(--accent);opacity:.6;"></i>
          </div>
          <div style="font-weight:700;margin-bottom:.5rem;">
            ${isAr ? 'خلِ نجيبلك توصيات شخصية' : 'Get personalised recommendations'}
          </div>
          <p class="text-muted" style="font-size:.88rem;line-height:1.7;max-width:400px;margin:0 auto .9rem;">
            ${isAr
              ? 'بعد ما تكمل اختبار التخصص هتلاقي 4 منصات هي الأنسب لك بالضبط.'
              : 'Complete the sub-track test to unlock your personalised top-4 platform picks.'}
          </p>
          <button class="btn btn-primary" onclick="navigateTo('subtrack-test')">
            <i data-lucide="clipboard-check" style="width:.9rem;height:.9rem;"></i>
            ${isAr ? 'ابدأ الاختبار' : 'Take Sub-track Test'}
          </button>
        </div>
      `}

      <!-- Browse All -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem;">
          <div>
            <div class="eyebrow">${isAr ? 'جميع المنصات' : 'Browse All Platforms'}</div>
            <div style="font-size:.83rem;color:var(--text-muted);margin-top:.2rem;">${filtered.length} ${isAr ? 'منصة' : 'platforms'}</div>
          </div>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
            ${['all','free','freemium','paid'].map(f => `
              <button
                onclick="setPlatformFilter('${f}')"
                class="btn ${filter === f ? 'btn-primary' : 'btn-secondary'}"
                style="font-size:.78rem;padding:.3rem .8rem;">
                ${f === 'all' ? (isAr ? 'الكل' : 'All') : f === 'free' ? (isAr ? 'مجاني' : 'Free') : f === 'freemium' ? 'Freemium' : (isAr ? 'مدفوع' : 'Paid')}
              </button>
            `).join('')}
          </div>
        </div>
        <div style="display:grid;gap:.75rem;">
          ${filtered.map(p => platformCard(p, false)).join('')}
        </div>
      </div>

    </div>
  `;
};

window.setPlatformFilter = function setPlatformFilter(f) {
  window._platformFilter = f;
  renderApp();
};

window.copyPromo = function copyPromo(code, e) {
  e.preventDefault();
  e.stopPropagation();
  navigator.clipboard?.writeText(code).then(() => {
    showToast((state.language === 'ar' ? 'تم نسخ الكود: ' : 'Copied: ') + code, '#16a34a');
  });
};

window.getUserSubtrack = function getUserSubtrack() {
  if (!state.subtestComplete || !state.subtestAnswers) return null;
  const fieldMap = {
    power:'electrical', embedded:'electrical', communications:'electrical',
    frontend:'software', backend:'software', data:'software', cyber:'software',
    'mechanical-design':'mechanical','mechanical-mfg':'mechanical','mechanical-thermal':'mechanical',
    'civil-structural':'civil','civil-water':'civil','civil-geo':'civil',
  };
  const topTrack = state.rankedTracks?.[0]?.id || '';
  const fieldKey = fieldMap[topTrack] || 'software';
  const questions = (typeof SUBTRACK_QUESTIONS !== 'undefined' && SUBTRACK_QUESTIONS[fieldKey])
    ? SUBTRACK_QUESTIONS[fieldKey]
    : (typeof SUBTRACK_QUESTIONS !== 'undefined' ? SUBTRACK_QUESTIONS.software : []);
  if (!questions.length) return null;
  const scores = {};
  questions.forEach(q => {
    const sel = state.subtestAnswers[q.id];
    if (!sel) return;
    const optIdx = parseInt(sel.split('_').pop(), 10);
    const opt = q.options[optIdx];
    if (!opt) return;
    Object.entries(opt.scores).forEach(([track, pts]) => { scores[track] = (scores[track] || 0) + pts; });
  });
  const ranked = Object.entries(scores).sort((a,b) => b[1]-a[1]);
  return ranked[0]?.[0] || null;
};
