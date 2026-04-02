window.t = function t(key) {
  return TRANSLATIONS[state.language][key] || key;
};

window.escapeHtml = function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
};

window.applyDocumentState = function applyDocumentState() {
  document.documentElement.lang          = state.language;
  document.documentElement.dir           = state.direction;
  document.documentElement.dataset.theme = state.theme;
};

window.showToast = function showToast(text, color = '#2563eb', icon = null) {
  Toastify({
    text,
    duration: 2200,
    gravity: 'bottom',
    position: state.direction === 'rtl' ? 'left' : 'right',
    style: { background: color, borderRadius: '12px', color: '#fff' }
  }).showToast();
};

// ── Demo Account Seed ─────────────────────────────────────────
// Ensures demo@trackup.io / trackup123 always exists in localStorage
const DEMO_EMAIL    = 'demo@trackup.io';
const DEMO_PASSWORD = 'trackup123';
const DEMO_NAME     = 'Ahmed';

window.seedDemoAccount = function seedDemoAccount() {
  const existing = StorageAPI.get('trackup_user_' + DEMO_EMAIL, null);
  if (!existing) {
    StorageAPI.set('trackup_user_' + DEMO_EMAIL, {
      name:     DEMO_NAME,
      password: btoa(DEMO_PASSWORD),
      profile:  { fullName: DEMO_NAME, college: 'electrical', year: '3', email: DEMO_EMAIL }
    });
  }
};

window.loginDemo = function loginDemo() {
  seedDemoAccount();
  const stored = StorageAPI.get('trackup_user_' + DEMO_EMAIL, null);
  state.auth = { email: DEMO_EMAIL, name: stored.name, isGuest: false };
  if (stored.profile) state.profile = stored.profile;
  showToast(
    (state.language === 'ar' ? 'أهلاً ' : 'Welcome back, ') + stored.name + ' 👋',
    '#16a34a'
  );
  navigateTo('onboarding');
};

// ── Surgical patch helpers ────────────────────────────────────

/** Re-render ONLY the <main> content — no header/footer flash */
window.renderMainOnly = function renderMainOnly() {
  const main = document.querySelector('.main-grid');
  if (!main) { renderApp(); return; }
  applyDocumentState();
  const showStrip = (typeof JOURNEY_VIEWS !== 'undefined') && JOURNEY_VIEWS.has(state.currentView);
  main.innerHTML = (showStrip ? renderProgressStrip() : '') + renderMainContent();
  bindForms();
  if (window.lucide) lucide.createIcons();
  if (window.AOS) { AOS.init({ duration: 550, once: true, offset: 14, easing: 'ease-out-cubic' }); AOS.refreshHard(); }
  if (state.currentView === 'home') {
    requestAnimationFrame(() => { if (window.initPartnersScroll) window.initPartnersScroll(); });
  }
};

/** Patch ONLY the header */
window.patchHeader = function patchHeader() {
  const header = document.querySelector('.app-header');
  if (!header) { renderApp(); return; }
  const tmp = document.createElement('div');
  tmp.innerHTML = renderHeader();
  header.replaceWith(tmp.firstElementChild);
  if (window.lucide) lucide.createIcons();
};

/** Patch ONLY the mobile panel */
window.patchMobilePanel = function patchMobilePanel() {
  const panel = document.querySelector('.mobile-panel');
  if (!panel) { renderApp(); return; }
  const tmp = document.createElement('div');
  tmp.innerHTML = renderMobilePanel();
  panel.replaceWith(tmp.firstElementChild);
  if (window.lucide) lucide.createIcons();
};

// ── Nav helpers ───────────────────────────────────────────────

window.getOrderedNav = function getOrderedNav() {
  const isPremium   = state.premiumUnlocked;
  const sessionDone = state.completedMilestones?.sessionBooked;
  const isAr        = state.language === 'ar';

  return [
    { id: 'home',             label: t('home'),       icon: 'house',          group: 'primary' },
    { id: 'pricing',          label: t('pricing'),    icon: 'credit-card',    group: 'primary' },
    { id: 'about',            label: t('about'),      icon: 'info',           group: 'primary' },
    { id: 'contact',          label: t('contact'),    icon: 'mail',           group: 'primary' },

    { id: 'profile',          label: t('profile'),                                                     icon: 'user-round',     group: 'journey' },
    { id: 'test',             label: t('test'),                                                        icon: 'clipboard-list', group: 'journey' },
    { id: 'results',          label: t('results'),                                                     icon: 'bar-chart-3',    group: 'journey' },
    { id: 'track-details',    label: t('tracks'),                                                      icon: 'layers-3',       group: 'journey' },
    { id: 'roadmap',          label: t('roadmap'),                                                     icon: 'route',          group: 'journey' },
    { id: 'platforms',        label: t('platforms'),                                                   icon: 'layout-grid',    group: 'journey' },
    { id: 'progress',         label: t('progress'),                                                    icon: 'target',         group: 'journey' },
    { id: 'mentors',          label: t('mentors'),                                                     icon: 'users-round',    group: 'journey' },
    { id: 'session-booking',  label: t('sessions'),                                                    icon: 'calendar-days',  group: 'journey' },
    { id: 'subtrack-test',    label: isAr ? 'اختبار التخصص الدقيق' : 'Sub-track Test',                 icon: 'flask-conical',  group: 'journey', lock: !sessionDone },
    { id: 'sub-track-result', label: isAr ? 'تخصصك الدقيق'         : 'Sub-track Result',               icon: 'crosshair',      group: 'journey', lock: !sessionDone },
    { id: 'recorded-library', label: isAr ? 'مكتبة الجلسات'        : 'Recorded Library',               icon: 'library',        group: 'journey', lock: !isPremium },
    { id: 'chat',             label: isAr ? 'تواصل مع مرشدك'       : 'Mentor Chat',                    icon: 'message-square', group: 'journey', lock: !isPremium },

    { id: 'profile',          label: t('profile'),    icon: 'user-round',     group: 'account' },
    { id: 'auth',             label: isAr ? 'الحساب' : 'Account', icon: 'log-in', group: 'account' },

    { id: 'about',            label: t('about'),      icon: 'info',           group: 'footer' },
    { id: 'contact',          label: t('contact'),    icon: 'mail',           group: 'footer' },
  ];
};

window.getMilestones = function getMilestones() {
  return [
    { key: 'profileCompleted', label: t('profileCompleted') },
    { key: 'testCompleted',    label: t('testCompleted') },
    { key: 'resultsViewed',    label: t('resultsViewed') },
    { key: 'detailsOpened',    label: t('detailsOpened') },
    { key: 'roadmapStarted',   label: t('roadmapStarted') },
    { key: 'courseStarted',    label: t('courseStarted') },
    { key: 'premiumUnlocked',  label: t('premiumUnlocked') },
    { key: 'sessionBooked',    label: t('sessionBooked') },
  ];
};

window.completedCount = function completedCount() {
  return Object.values(state.completedMilestones).filter(Boolean).length;
};

window.progressPercentage = function progressPercentage() {
  return Math.round((completedCount() / getMilestones().length) * 100);
};

window.updateProgress = function updateProgress(key, value = true) {
  state.completedMilestones[key] = value;
  if (key === 'premiumUnlocked') state.premiumUnlocked = value;
  if (key === 'sessionBooked')   state.sessionRequested = value;
  persistState();
};

window.nextRecommendedStep = function nextRecommendedStep() {
  const m    = state.completedMilestones;
  const isAr = state.language === 'ar';
  if (!m.profileCompleted)    return { view: 'profile',          label: t('profileTitle') };
  if (!m.testCompleted)       return { view: 'test',             label: t('startAssessment') };
  if (!m.resultsViewed)       return { view: 'results',          label: t('openResults') };
  if (!m.detailsOpened)       return { view: 'track-details',    label: t('exploreTrack') };
  if (!m.roadmapStarted)      return { view: 'roadmap',          label: t('openRoadmap') };
  if (!m.courseStarted)       return { view: 'platforms',        label: t('platforms') };
  if (!m.premiumUnlocked)     return { view: 'pricing',          label: t('upgradeNow') };
  if (!m.sessionBooked)       return { view: 'mentors',          label: t('meetMentors') };
  if (!state.subtestComplete) return { view: 'subtrack-test',    label: isAr ? 'اختبار التخصص الدقيق' : 'Sub-track Test' };
  if (!state.subTrackResult)  return { view: 'sub-track-result', label: isAr ? 'تخصصك الدقيق' : 'Your Sub-track' };
  return { view: 'progress',  label: isAr ? 'الرحلة مكتملة' : 'Journey complete' };
};

window.safeProfileName = function safeProfileName() {
  return state.profile.fullName?.trim() || (state.language === 'ar' ? 'المستخدم' : 'User');
};

window.getCurrentTrack = function getCurrentTrack() {
  return TRACKS[state.selectedTrack] || TRACKS.embedded;
};

window.ensureResultsOrPrompt = function ensureResultsOrPrompt() {
  if (!state.completedMilestones.profileCompleted) {
    showToast(t('profileNeeded'), '#dc2626');
    navigateTo('profile');
    return false;
  }
  if (!state.rankedTracks.length) {
    showToast(t('noResults'), '#f59e0b');
    navigateTo('test');
    return false;
  }
  return true;
};

window.guardView = function guardView(view) {
  if (view === 'test' && !state.completedMilestones.profileCompleted) {
    showToast(t('profileNeeded'), '#f59e0b');
    navigateTo('profile');
    return false;
  }
  if (['results','track-details','roadmap','courses'].includes(view) && !state.rankedTracks.length) {
    showToast(t('noResults'), '#f59e0b');
    navigateTo('test');
    return false;
  }
  if (view === 'session-booking' && !state.premiumUnlocked) {
    if (window.openSessionGate) openSessionGate();
    else navigateTo('pricing');
    return false;
  }
  return true;
};

window.openPremiumLock = function openPremiumLock(from) {
  const isAr = state.language === 'ar';
  Swal.fire({
    title: isAr ? 'هذه الميزة للأعضاء المدفوعين' : 'Premium required',
    text:  isAr ? 'فعّل Premium للوصول لهذه الخدمة.' : 'Upgrade to Premium to access this feature.',
    icon:  'lock',
    confirmButtonText: isAr ? 'ترقية الآن' : 'Upgrade Now',
    showCancelButton: true,
    cancelButtonText: isAr ? 'لاحقاً' : 'Later',
    confirmButtonColor: '#2563eb',
    background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
    color:      state.theme === 'dark' ? '#fafafa' : '#09090b'
  }).then(r => { if (r.isConfirmed) navigateTo('pricing'); });
};

// ── URL Router ────────────────────────────────────────────────
const PRIVATE_VIEWS = ['auth', 'onboarding'];

window.navigateTo = function navigateTo(view, extras = {}) {
  if (extras.selectedTrack) state.selectedTrack = extras.selectedTrack;
  state.currentView    = view;
  state.mobileMenuOpen = false;
  state.journeyOpen    = false;
  state.accountOpen    = false;
  if (view === 'results' && state.rankedTracks.length) updateProgress('resultsViewed', true);
  if (view === 'track-details') updateProgress('detailsOpened', true);
  if (view === 'roadmap')       updateProgress('roadmapStarted', true);
  persistState();
  if (!PRIVATE_VIEWS.includes(view)) {
    const params = new URLSearchParams({ tab: view });
    if (extras.selectedTrack) params.set('track', extras.selectedTrack);
    history.pushState({ view, ...extras }, '', '?' + params.toString());
  }
  patchHeader();
  renderMainOnly();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('popstate', function(e) {
  const params = new URLSearchParams(window.location.search);
  const view   = params.get('tab') || 'home';
  const track  = params.get('track');
  state.currentView    = view;
  if (track) state.selectedTrack = track;
  state.mobileMenuOpen = false;
  state.journeyOpen    = false;
  state.accountOpen    = false;
  patchHeader();
  renderMainOnly();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.initRouter = function initRouter() {
  const params = new URLSearchParams(window.location.search);
  const tab    = params.get('tab');
  const track  = params.get('track');
  if (tab && !PRIVATE_VIEWS.includes(tab)) {
    state.currentView = tab;
    if (track) state.selectedTrack = track;
    history.replaceState({ view: tab, selectedTrack: track }, '', window.location.search);
  } else {
    history.replaceState({ view: state.currentView }, '', '?tab=' + state.currentView);
  }
};

window.switchLanguage = function switchLanguage() {
  state.language  = state.language === 'en' ? 'ar' : 'en';
  state.direction = state.language === 'ar' ? 'rtl' : 'ltr';
  persistState();
  renderApp();
};

window.switchTheme = function switchTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  persistState();
  applyDocumentState();
};

window.resetDemo = function resetDemo() {
  Swal.fire({
    title: t('resetConfirmTitle'),
    text:  t('resetConfirmText'),
    icon:  'warning',
    showCancelButton: true,
    confirmButtonText: t('resetNow'),
    cancelButtonText:  t('cancel'),
    confirmButtonColor: '#dc2626',
    background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
    color:      state.theme === 'dark' ? '#fafafa' : '#09090b'
  }).then(result => {
    if (result.isConfirmed) {
      state.currentView         = 'home';
      state.mobileMenuOpen      = false;
      state.journeyOpen         = false;
      state.accountOpen         = false;
      state.mentorFilter        = 'all';
      state.selectedMentor      = null;
      state.subtestField        = null;
      state.subtestIndex        = 0;
      state.subtestAnswers      = {};
      state.subtestComplete     = false;
      state.subTrackResult      = null;
      state.profile             = { fullName: '', college: '', year: '', email: '' };
      state.testAnswers         = {};
      state.scores              = {};
      state.rankedTracks        = [];
      state.selectedTrack       = 'embedded';
      state.completedMilestones = {
        profileCompleted: false, testCompleted: false, resultsViewed: false,
        detailsOpened:   false, roadmapStarted: false, courseStarted: false,
        premiumUnlocked: false, sessionBooked:  false
      };
      state.premiumUnlocked     = false;
      state.sessionRequested    = false;
      state.currentQuestionIndex = 0;
      state.startedCourseIds    = [];
      state.roadmapProgress     = {};
      state.chatMessages        = [];
      state.watchedSessions     = [];
      state.libraryFilter       = 'all';
      state.auth                = null;
      persistState();
      history.replaceState({ view: 'home' }, '', '?tab=home');
      renderApp();
    }
  });
};

window.toggleAccountMenu = function toggleAccountMenu() {
  state.accountOpen = !state.accountOpen;
  state.journeyOpen = false;
  patchHeader();
  if (state.accountOpen) {
    setTimeout(() => {
      function outsideHandler(e) {
        const dropdown = document.querySelector('.account-dropdown');
        const trigger  = document.querySelector('[data-account]');
        if (dropdown && !dropdown.contains(e.target) && trigger && !trigger.contains(e.target)) {
          state.accountOpen = false;
          patchHeader();
          document.removeEventListener('click', outsideHandler, true);
        }
      }
      document.addEventListener('click', outsideHandler, true);
    }, 0);
  }
};
