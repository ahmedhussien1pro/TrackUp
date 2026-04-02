window.renderProfileView = function renderProfileView() {
  const isAr = state.language === 'ar';
  const isPro = state.premiumUnlocked;
  const hasProfile = state.profile && state.profile.fullName && state.profile.fullName.trim();
  const initials = hasProfile
    ? (() => {
        const words = state.profile.fullName.trim().split(/\s+/);
        return words.length === 1
          ? words[0].slice(0,2).toUpperCase()
          : (words[0][0] + words[1][0]).toUpperCase();
      })()
    : '?';

  // ── profile completion %
  const completionFields = ['fullName','college','year','email'];
  const filled = completionFields.filter(f => state.profile && state.profile[f] && String(state.profile[f]).trim()).length;
  const completionPct = Math.round((filled / completionFields.length) * 100);

  // ── journey tab state (URL-aware)
  const hashTab = (location.hash.match(/^#profile-(.+)$/) || [])[1];
  if (hashTab) window._profileTab = hashTab;
  if (!window._profileTab) window._profileTab = 'profile';
  const activeTab = window._profileTab;

  const tabs = [
    { key: 'profile',  icon: 'user-round',    labelEn: 'Profile',  labelAr: '\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',    locked: false },
    { key: 'test',     icon: 'clipboard-list', labelEn: 'Test',     labelAr: '\u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631',    locked: !hasProfile },
    { key: 'results',  icon: 'bar-chart-3',   labelEn: 'Results',  labelAr: '\u0627\u0644\u0646\u062a\u0627\u0626\u062c',    locked: !state.progress?.testCompleted },
    { key: 'premium',  icon: 'star',          labelEn: 'Premium',  labelAr: '\u0627\u0644\u0628\u0627\u0642\u0629',     locked: false, highlight: true },
    { key: 'mentored', icon: 'pencil-ruler',  labelEn: 'Mentored', labelAr: '\u062a\u0648\u062c\u064a\u0647',     locked: !isPro },
  ];

  const lockIcon = `<i data-lucide="lock" style="width:.7rem;height:.7rem;opacity:.5;"></i>`;

  // ── tab content
  function tabContent() {
    if (activeTab === 'profile') return profileFormSection();
    if (activeTab === 'test')    return testRedirectSection();
    if (activeTab === 'results') return resultsRedirectSection();
    if (activeTab === 'premium') return premiumSection();
    if (activeTab === 'mentored') return mentoredSection();
    return profileFormSection();
  }

  function profileFormSection() {
    return `
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:1.1rem;">${isAr ? '\u0628\u064a\u0627\u0646\u0627\u062a\u0643' : 'Your Details'}</div>
        <form id="profileForm" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${isAr ? '\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0643\u0627\u0645\u0644' : 'Full Name'}</label>
              <input class="form-input" name="fullName" type="text"
                placeholder="${isAr ? '\u0645\u062b\u0627\u0644: \u0623\u062d\u0645\u062f \u0639\u0644\u064a' : 'e.g. Ahmed Ali'}"
                value="${state.profile?.fullName || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label">${isAr ? '\u0627\u0644\u062c\u0627\u0645\u0639\u0629 / \u0627\u0644\u0643\u0644\u064a\u0629' : 'College / University'}</label>
              <input class="form-input" name="college" type="text"
                placeholder="${isAr ? '\u0645\u062b\u0627\u0644: \u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0642\u0627\u0647\u0631\u0629' : 'e.g. Cairo University'}"
                value="${state.profile?.college || ''}" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${isAr ? '\u0627\u0644\u0633\u0646\u0629 \u0627\u0644\u062f\u0631\u0627\u0633\u064a\u0629' : 'Academic Year'}</label>
              <select class="form-input" name="year">
                <option value="" ${!state.profile?.year ? 'selected' : ''}>${isAr ? '\u0627\u062e\u062a\u0631 \u0633\u0646\u062a\u0643' : 'Select your year'}</option>
                ${[1,2,3,4,5].map(y => `<option value="year${y}" ${state.profile?.year === 'year'+y ? 'selected' : ''}>${isAr ? '\u0627\u0644\u0633\u0646\u0629 '+['\u0627\u0644\u0623\u0648\u0644\u0649','\u0627\u0644\u062b\u0627\u0646\u064a\u0629','\u0627\u0644\u062b\u0627\u0644\u062b\u0629','\u0627\u0644\u0631\u0627\u0628\u0639\u0629','\u0627\u0644\u062e\u0627\u0645\u0633\u0629'][y-1] : 'Year '+y+'${y===5?' (Final)':''}'}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${isAr ? '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a' : 'Email Address'}</label>
              <input class="form-input" name="email" type="email"
                placeholder="${isAr ? '\u0645\u062b\u0627\u0644: name@mail.com' : 'e.g. name@mail.com'}"
                value="${state.profile?.email || ''}" />
            </div>
          </div>
          <div style="margin-top:.75rem;">
            <button type="submit" class="btn btn-primary">
              <i data-lucide="save" style="width:.9rem;height:.9rem;"></i>
              ${isAr ? '\u062d\u0641\u0638 \u0648\u0627\u0643\u0645\u0644' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  function testRedirectSection() {
    const done = state.progress?.testCompleted;
    return `
      <div class="surface-panel section-pad" data-aos="fade-up" style="text-align:center;">
        <i data-lucide="clipboard-list" style="width:2rem;height:2rem;color:var(--accent);margin-bottom:.75rem;"></i>
        <div style="font-weight:700;font-size:1rem;margin-bottom:.5rem;">${isAr ? (done ? '\u0644\u0642\u062f \u0623\u062a\u0645\u0645\u062a \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631' : '\u0627\u0628\u062f\u0623 \u0627\u0644\u062a\u0642\u064a\u064a\u0645') : (done ? 'Assessment Completed' : 'Take the Assessment')}</div>
        <p class="text-muted" style="font-size:.88rem;line-height:1.7;max-width:360px;margin:0 auto .9rem;">
          ${isAr
            ? (done ? '\u064a\u0645\u0643\u0646\u0643 \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0641\u064a \u0623\u064a \u0648\u0642\u062a.' : '\u062e\u0645\u0633\u0629 \u0623\u0633\u0626\u0644\u0629 \u062a\u062d\u062f\u062f \u0645\u0633\u0627\u0631\u0643 \u0627\u0644\u0645\u062b\u0627\u0644\u064a.')
            : (done ? 'You can retake the assessment anytime.' : '5 questions to find your ideal engineering track.')}
        </p>
        <button class="btn btn-primary" onclick="navigateTo('test')">
          <i data-lucide="${done ? 'refresh-cw' : 'play'}" style="width:.9rem;height:.9rem;"></i>
          ${isAr ? (done ? '\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631' : '\u0627\u0628\u062f\u0623 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631') : (done ? 'Retake Test' : 'Start Test')}
        </button>
      </div>
    `;
  }

  function resultsRedirectSection() {
    return `
      <div class="surface-panel section-pad" data-aos="fade-up" style="text-align:center;">
        <i data-lucide="bar-chart-3" style="width:2rem;height:2rem;color:var(--accent);margin-bottom:.75rem;"></i>
        <div style="font-weight:700;font-size:1rem;margin-bottom:.5rem;">${isAr ? '\u0646\u062a\u0627\u0626\u062c \u062a\u0642\u064a\u064a\u0645\u0643' : 'Your Assessment Results'}</div>
        <p class="text-muted" style="font-size:.88rem;line-height:1.7;max-width:360px;margin:0 auto .9rem;">
          ${isAr ? '\u0627\u0639\u0631\u0636 \u0623\u0641\u0636\u0644 3 \u0645\u0633\u0627\u0631\u0627\u062a \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0625\u062c\u0627\u0628\u0627\u062a\u0643.' : 'See your top 3 ranked tracks based on your answers.'}
        </p>
        <button class="btn btn-primary" onclick="navigateTo('results')">
          <i data-lucide="arrow-right" style="width:.9rem;height:.9rem;"></i>
          ${isAr ? '\u0639\u0631\u0636 \u0627\u0644\u0646\u062a\u0627\u0626\u062c' : 'View Results'}
        </button>
      </div>
    `;
  }

  function premiumSection() {
    return `
      <div class="surface-panel section-pad" data-aos="fade-up" style="text-align:center;">
        <i data-lucide="star" style="width:2rem;height:2rem;color:#eab308;margin-bottom:.75rem;"></i>
        <div style="font-weight:700;font-size:1rem;margin-bottom:.5rem;">${isAr ? (isPro ? '\u0623\u0646\u062a \u0639\u0636\u0648 Premium' : '\u062a\u0631\u0642\u0651 \u0625\u0644\u0649 Premium') : (isPro ? 'You\'re Premium' : 'Upgrade to Premium')}</div>
        <p class="text-muted" style="font-size:.88rem;line-height:1.7;max-width:360px;margin:0 auto .9rem;">
          ${isAr
            ? (isPro ? '\u062a\u0645\u062a\u0639 \u0628\u062c\u0645\u064a\u0639 \u0645\u064a\u0632\u0627\u062a \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0629.' : '\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062a\u062d\u0644\u064a\u0644 \u0643\u0627\u0645\u0644 \u0648\u062e\u0627\u0631\u0637\u0629 \u0637\u0631\u064a\u0642 \u062a\u0641\u0635\u064a\u0644\u064a\u0629.')
            : (isPro ? 'You have access to all premium features.' : 'Get full analysis, detailed roadmap & expert sessions.')}
        </p>
        ${!isPro ? `
          <button class="btn btn-primary" onclick="navigateTo('pricing')">
            <i data-lucide="arrow-right" style="width:.9rem;height:.9rem;"></i>
            ${isAr ? '\u0627\u0634\u062a\u0631\u0643 \u062f\u0644\u0648\u0642\u062a\u064a' : 'See Plans'}
          </button>
        ` : `
          <span class="badge badge-accent">${isAr ? '\u0645\u0641\u0639\u0651\u0644' : 'Active'}</span>
        `}
      </div>
    `;
  }

  function mentoredSection() {
    return `
      <div class="surface-panel section-pad" data-aos="fade-up" style="text-align:center;">
        <i data-lucide="pencil-ruler" style="width:2rem;height:2rem;color:var(--accent);margin-bottom:.75rem;"></i>
        <div style="font-weight:700;font-size:1rem;margin-bottom:.5rem;">${isAr ? '\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u062a\u0648\u062c\u064a\u0647' : 'Mentorship Sessions'}</div>
        <p class="text-muted" style="font-size:.88rem;line-height:1.7;max-width:360px;margin:0 auto .9rem;">
          ${isAr ? '\u062c\u0644\u0633\u0627\u062a \u0641\u0631\u062f\u064a\u0629 \u0645\u0639 \u062e\u0628\u0631\u0627\u0621 \u0645\u062a\u062e\u0635\u0635\u064a\u0646.' : 'One-on-one sessions with domain experts.'}
        </p>
        <button class="btn btn-primary" onclick="guardedNavigate('session-booking')">
          <i data-lucide="calendar-check" style="width:.9rem;height:.9rem;"></i>
          ${isAr ? '\u0627\u062d\u062c\u0632 \u062c\u0644\u0633\u0629' : 'Book a Session'}
        </button>
      </div>
    `;
  }

  return `
    <div style="display:grid;gap:1.25rem;">

      <!-- Avatar + summary -->
      <div class="surface-panel section-pad profile-hero" data-aos="fade-up">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar ${isPro ? 'profile-avatar--pro' : ''}">
            <span class="profile-avatar-initials">${initials}</span>
            ${isPro ? `<span class="profile-avatar-badge">PRO</span>` : ''}
          </div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:900;font-size:1.25rem;">${hasProfile ? state.profile.fullName : (isAr ? '\u0627\u0633\u0645\u0643 \u0647\u0646\u0627' : 'Your Name Here')}</div>
          <div class="text-muted" style="font-size:.88rem;margin-top:.15rem;">${hasProfile && state.profile.college ? state.profile.college : (isAr ? '\u0627\u0644\u062c\u0627\u0645\u0639\u0629 \u063a\u064a\u0631 \u0645\u062d\u062f\u062f\u0629' : 'College not set')}</div>
          <div style="margin-top:.6rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.3rem;">
              <span style="font-size:.75rem;color:var(--text-faint);">${isAr ? '\u0627\u0643\u062a\u0645\u0627\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a' : 'Profile completion'}: ${completionPct}%</span>
            </div>
            <div class="progress-track" style="height:4px;">
              <div class="progress-fill" style="width:${completionPct}%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full-width tab bar -->
      <div class="tab-bar" role="tablist" data-aos="fade-up">
        ${tabs.map(tab => `
          <button
            role="tab"
            aria-selected="${activeTab === tab.key}"
            class="tab-btn ${activeTab === tab.key ? 'tab-btn--active' : ''} ${tab.highlight && !isPro ? 'tab-btn--highlight' : ''}"
            onclick="setProfileTab('${tab.key}')">
            <i data-lucide="${tab.icon}" style="width:.85rem;height:.85rem;"></i>
            <span>${isAr ? tab.labelAr : tab.labelEn}</span>
            ${tab.locked ? lockIcon : ''}
          </button>
        `).join('')}
      </div>

      <!-- Tab content -->
      ${tabContent()}

    </div>
  `;
};

window.setProfileTab = function setProfileTab(key) {
  window._profileTab = key;
  history.replaceState(null, '', '#profile-' + key);
  renderApp();
};
