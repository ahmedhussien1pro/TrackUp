// toggleMobileMenu, closeMobileMenu, toggleJourneyMenu, guardedNavigate
// are defined in shell.js — do NOT redefine here

/* ── Views where the progress strip should appear ── */
const JOURNEY_VIEWS = new Set([
  'test', 'results', 'track-details', 'roadmap',
  'courses', 'progress', 'subtrack-test', 'sub-track-result'
]);

window.submitAssessment = function submitAssessment() {
  const missing = QUESTIONS.find(q => !state.testAnswers[q.id]);
  if (missing) return showToast(t('answerNeeded'), '#dc2626');
  calculateResults();
  updateProgress('testCompleted', true);
  updateProgress('resultsViewed', true);
  showToast(t('assessmentDone'), '#16a34a');
  navigateTo('results');
};

window.openTrack = function openTrack(trackId) {
  state.selectedTrack = trackId;
  updateProgress('detailsOpened', true);
  persistState();
  showToast(t('detailsOpenedToast'), '#2563eb');
  navigateTo('track-details', { selectedTrack: trackId });
};

window.openRoadmapFor = function openRoadmapFor(trackId) {
  state.selectedTrack = trackId;
  updateProgress('roadmapStarted', true);
  persistState();
  showToast(t('roadmapStartedToast'), '#2563eb');
  navigateTo('roadmap', { selectedTrack: trackId });
};

window.completeRoadmapStep = function completeRoadmapStep(trackId, step) {
  state.roadmapProgress[`${trackId}_${step}`] = true;
  updateProgress('roadmapStarted', true);
  persistState();
  showToast(t('roadmapStartedToast'), '#16a34a');
  renderMainOnly();
};

window.startCourse = function startCourse(courseId) {
  if (!state.startedCourseIds.includes(courseId)) {
    state.startedCourseIds.push(courseId);
    updateProgress('courseStarted', true);
    persistState();
    showToast(t('learningStarted'), '#16a34a');
    renderMainOnly();
  }
};

// activatePlan is defined in pricing.js — do not duplicate here

window.renderMainContent = function renderMainContent() {
  const views = {
    home:                renderHomeView,
    profile:             renderProfileView,
    test:                renderTestView,
    results:             renderResultsView,
    'track-details':     renderTrackDetailsView,
    roadmap:             renderRoadmapView,
    courses:             renderCoursesView,
    platforms:           renderPlatformsView,
    pricing:             renderPricingView,
    progress:            renderProgressView,
    'session-booking':   renderSessionBookingView,
    mentors:             renderMentorsView,
    'subtrack-test':     renderSubtrackTestView,
    'recorded-library':  renderRecordedLibraryView,
    'chat':              renderChatView,
    'sub-track-result':  renderSubTrackResultView,
    about:               renderAboutView,
    contact:             renderContactView,
    auth:                renderAuthView,
  };
  return (views[state.currentView] || renderHomeView)();
};

window.bindForms = function bindForms() {
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(profileForm);
      const profile = {
        fullName: String(formData.get('fullName') || '').trim(),
        college:  String(formData.get('college')  || '').trim(),
        year:     String(formData.get('year')     || '').trim(),
        email:    String(formData.get('email')    || '').trim()
      };
      const errors = validateProfile(profile);
      if (Object.keys(errors).length) return showToast(errors.email ? t('invalidEmail') : t('formErrors'), '#dc2626');
      state.profile = profile;
      updateProgress('profileCompleted', true);
      persistState();
      showToast(t('saved'), '#16a34a');
      // ── UC2: show branching “knows-track?” step instead of jumping to test directly
      setProfileStep('ask');
    });
  }

  const sessionForm = document.getElementById('sessionForm');
  if (sessionForm) {
    sessionForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!state.premiumUnlocked) return navigateTo('pricing');
      const fd = new FormData(sessionForm);
      const payload = {
        fullName:        String(fd.get('fullName')        || '').trim(),
        email:           String(fd.get('email')           || '').trim(),
        password:        String(fd.get('password')        || '').trim(),
        confirmPassword: String(fd.get('confirmPassword') || '').trim(),
        specialization:  String(fd.get('specialization')  || '').trim(),
        topic:           String(fd.get('topic')           || '').trim()
      };
      const errors = validateSessionForm(payload);
      if (errors.email)           return showToast(t('invalidEmail'),  '#dc2626');
      if (errors.password)        return showToast(t('weakPassword'),   '#dc2626');
      if (errors.confirmPassword) return showToast(t('passMismatch'),   '#dc2626');
      if (errors.topic)           return showToast(t('chooseTopic'),    '#dc2626');
      if (errors.fullName || errors.specialization) return showToast(t('formErrors'), '#dc2626');
      updateProgress('sessionBooked', true);
      persistState();
      Swal.fire({
        title: t('sessionSuccessTitle'),
        text:  t('sessionSuccessText'),
        icon:  'success',
        confirmButtonColor: '#2563eb',
        background: state.theme === 'dark' ? '#0a0a0a' : '#ffffff',
        color:      state.theme === 'dark' ? '#fafafa' : '#09090b'
      }).then(() => {
        showToast(t('saved'), '#16a34a');
        navigateTo('subtrack-test');
      });
    });
  }
};

window.renderApp = function renderApp() {
  applyDocumentState();
  const app = document.getElementById('app');
  const showStrip = JOURNEY_VIEWS.has(state.currentView);
  app.innerHTML = `<div class="app-shell">${renderHeader()}${renderMobilePanel()}<main class="container-shell main-grid">${showStrip ? renderProgressStrip() : ''}${renderMainContent()}</main>${renderFooter()}${renderBottomNav()}</div>`;
  bindForms();
  if (window.lucide) lucide.createIcons();
  if (window.AOS) { AOS.init({ duration: 550, once: true, offset: 14, easing: 'ease-out-cubic' }); AOS.refreshHard(); }
  if (state.currentView === 'home') {
    requestAnimationFrame(() => {
      if (window.initPartnersScroll) window.initPartnersScroll();
    });
  }
};

state.direction  = state.language === 'ar' ? 'rtl' : 'ltr';
if (!state.auth)        state.auth        = null;
if (!state.accountOpen) state.accountOpen = false;
initRouter();
seedDemoAccount();
renderApp();
