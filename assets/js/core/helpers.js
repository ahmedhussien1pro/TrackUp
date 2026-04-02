window.t = function t(key) {
  return TRANSLATIONS[state.language][key] || key;
};

window.escapeHtml = function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
};

window.applyDocumentState = function applyDocumentState() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.direction;
  document.documentElement.dataset.theme = state.theme;
};

window.showToast = function showToast(text, color = '#2563eb') {
  Toastify({
    text,
    duration: 2200,
    gravity: 'bottom',
    position: state.direction === 'rtl' ? 'left' : 'right',
    style: { background: color, borderRadius: '12px', color: '#fff' }
  }).showToast();
};

window.getOrderedNav = function getOrderedNav() {
  return [
    { id: 'home',             label: t('home'),       icon: 'house' },
    { id: 'profile',          label: t('profile'),    icon: 'user-round' },
    { id: 'test',             label: t('test'),       icon: 'clipboard-list' },
    { id: 'results',          label: t('results'),    icon: 'bar-chart-3' },
    { id: 'track-details',    label: t('tracks'),     icon: 'layers-3' },
    { id: 'roadmap',          label: t('roadmap'),    icon: 'route' },
    { id: 'platforms',        label: t('platforms'),  icon: 'layout-grid' },
    { id: 'pricing',          label: t('pricing'),    icon: 'credit-card' },
    { id: 'progress',         label: t('progress'),   icon: 'target' },
    { id: 'mentors',          label: t('mentors'),    icon: 'users-round' },
    { id: 'session-booking',  label: t('sessions'),   icon: 'calendar-days' },
    { id: 'about',            label: t('about'),      icon: 'info' },
    { id: 'contact',          label: t('contact'),    icon: 'mail' },
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
  if (key === 'sessionBooked') state.sessionRequested = value;
  persistState();
};

window.nextRecommendedStep = function nextRecommendedStep() {
  const m = state.completedMilestones;
  if (!m.profileCompleted)  return { view: 'profile',         label: t('profileTitle') };
  if (!m.testCompleted)     return { view: 'test',            label: t('startAssessment') };
  if (!m.resultsViewed)     return { view: 'results',         label: t('openResults') };
  if (!m.detailsOpened)     return { view: 'track-details',   label: t('exploreTrack') };
  if (!m.roadmapStarted)    return { view: 'roadmap',         label: t('openRoadmap') };
  if (!m.courseStarted)     return { view: 'platforms',       label: t('platforms') };
  if (!m.premiumUnlocked)   return { view: 'pricing',         label: t('upgradeNow') };
  if (!m.sessionBooked)     return { view: 'mentors',         label: t('meetMentors') };
  return { view: 'subtrack-test', label: t('startNow') };
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
    openSessionGate();
    return false;
  }
  return true;
};

window.navigateTo = function navigateTo(view, extras = {}) {
  if (extras.selectedTrack) state.selectedTrack = extras.selectedTrack;
  state.currentView = view;
  state.mobileMenuOpen = false;
  state.journeyOpen = false;
  if (view === 'results' && state.rankedTracks.length) updateProgress('resultsViewed', true);
  if (view === 'track-details') updateProgress('detailsOpened', true);
  if (view === 'roadmap') updateProgress('roadmapStarted', true);
  persistState();
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.switchLanguage = function switchLanguage() {
  state.language = state.language === 'en' ? 'ar' : 'en';
  state.direction = state.language === 'ar' ? 'rtl' : 'ltr';
  persistState();
  renderApp();
};

window.switchTheme = function switchTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  persistState();
  renderApp();
};

window.resetDemo = function resetDemo() {
  Swal.fire({
    title: t('resetConfirmTitle'),
    text: t('resetConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('resetNow'),
    cancelButtonText: t('cancel'),
    confirmButtonColor: '#dc2626',
    background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
    color: state.theme === 'dark' ? '#fafafa' : '#09090b'
  }).then(result => {
    if (result.isConfirmed) {
      state.currentView = 'home';
      state.mobileMenuOpen = false;
      state.journeyOpen = false;
      state.mentorFilter = 'all';
      state.selectedMentor = null;
      state.subtestField = null;
      state.subtestIndex = 0;
      state.subtestAnswers = {};
      state.subtestComplete = false;
      state.profile = { fullName: '', college: '', year: '', email: '' };
      state.testAnswers = {};
      state.scores = {};
      state.rankedTracks = [];
      state.selectedTrack = 'embedded';
      state.completedMilestones = {
        profileCompleted: false, testCompleted: false, resultsViewed: false,
        detailsOpened: false, roadmapStarted: false, courseStarted: false,
        premiumUnlocked: false, sessionBooked: false
      };
      state.premiumUnlocked = false;
      state.sessionRequested = false;
      state.currentQuestionIndex = 0;
      state.startedCourseIds = [];
      state.roadmapProgress = {};
      state.auth = null;
      persistState();
      renderApp();
    }
  });
};
