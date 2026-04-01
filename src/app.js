import State from './state.js';
import { Router } from './router.js';
import { setLang } from './i18n.js';
import { StorageService } from './services/storage.service.js';
import { AuthService } from './services/auth.service.js';
import { Sidebar, SidebarEvents } from './components/layout/Sidebar.js';
import { mountLayout, unmountLayout } from './components/layout/Topbar.js';
import { mountJourneyProgress, unmountJourneyProgress, shouldShowJourney } from './components/layout/JourneyProgress.js';

import { Landing, LandingEvents }                             from './screens/Landing/Landing.js';
import { Login, LoginEvents }                                 from './screens/Auth/Login.js';
import { Register, RegisterEvents }                           from './screens/Auth/Register.js';
import { Onboarding, OnboardingEvents }                       from './screens/Onboarding/Onboarding.js';
import { Test, TestEvents }                                   from './screens/Test/Test.js';
import { Results, ResultsEvents }                             from './screens/Results/Results.js';
import { DecisionSummary, DecisionSummaryEvents }             from './screens/DecisionSummary/DecisionSummary.js';
import { Pricing, PricingEvents }                             from './screens/Pricing/Pricing.js';
import { Payment, PaymentEvents }                             from './screens/Payment/Payment.js';
import { Dashboard, DashboardEvents }                         from './screens/Dashboard/Dashboard.js';
import { Career, CareerEvents }                               from './screens/Career/Career.js';
import { TrackDetails, TrackDetailsEvents }                   from './screens/TrackDetails/TrackDetails.js';
import { Roadmap, RoadmapEvents }                             from './screens/Roadmap/Roadmap.js';
import { Courses, CoursesEvents }                             from './screens/Courses/Courses.js';
import { Mentorship, MentorshipEvents }                       from './screens/Mentorship/Mentorship.js';
import { Progress, ProgressEvents }                           from './screens/Progress/Progress.js';
import { Notifications, NotificationsEvents }                 from './screens/Notifications/Notifications.js';
import { Settings, SettingsEvents }                           from './screens/Settings/Settings.js';

// /career?id=X => TrackDetails | /career => Career list
function _careerRender(query) {
  return query?.id ? TrackDetails(query) : Career(query);
}
function _careerAfter(query) {
  return query?.id ? TrackDetailsEvents(query) : CareerEvents(query);
}

// Screens that never need the app layout (sidebar + topbar)
const NO_LAYOUT_SCREENS = ['/', '/login', '/register', '/pricing', '/onboarding', '/test', '/career', '/results', '/decision-summary'];

// Screens accessible to logged-out users only after completing the test
const SEMI_PUBLIC = ['/results', '/decision-summary'];

window.__trackup_layout_sidebar__ = { Sidebar, SidebarEvents };

function _needsAppLayout(path, loggedIn) {
  // Only authenticated users inside the app get sidebar + topbar
  if (!loggedIn) return false;
  return !NO_LAYOUT_SCREENS.includes(path);
}

let _layoutMounted = false;

function _updateActiveLink() {
  const path = window.location.hash.slice(1).split('?')[0] || '/';
  document.querySelectorAll('.sidebar__link').forEach(link => {
    const active = link.dataset.path === path;
    link.classList.toggle('sidebar__link--active', active);
    link.setAttribute('aria-current', active ? 'page' : 'false');
  });
  const PAGE_KEYS = {
    '/dashboard':        'nav.dashboard',
    '/career':           'nav.career',
    '/roadmap':          'nav.roadmap',
    '/courses':          'nav.courses',
    '/mentorship':       'nav.mentorship',
    '/progress':         'nav.progress',
    '/notifications':    'nav.notifications',
    '/settings':         'nav.settings',
  };
  const { t } = window.__trackup_i18n__ || {};
  const titleEl = document.getElementById('topbar-page-title');
  if (titleEl && t && PAGE_KEYS[path]) titleEl.textContent = t(PAGE_KEYS[path]);
}

function bootstrap() {
  const savedTheme = StorageService.get('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  State.setState('theme', savedTheme);

  const savedLang = StorageService.get('lang') || 'en';
  setLang(savedLang);
  State.setState('lang', savedLang);

  AuthService.restoreSession();

  const testResult = StorageService.get('testResult');
  if (testResult) State.setState('testResult', testResult);

  const onboardingCtx = StorageService.get('onboarding_context');
  if (onboardingCtx) State.setState('onboarding_context', onboardingCtx);

  Router.setGuard((path) => {
    const loggedIn  = !!State.getState('user');
    const hasResult = !!State.getState('testResult');

    // Redirect logged-in users away from auth screens
    if (loggedIn && (path === '/login' || path === '/register')) return '/dashboard';

    // Protected app screens require login
    const isPublic = NO_LAYOUT_SCREENS.includes(path);
    if (!isPublic && !loggedIn) return '/login';

    // BUG-01 FIX: semi-public screens require BOTH no login AND a fresh test result
    // A result from localStorage alone is not enough — must have been set this session
    // We check State (session memory) not just storage
    if (SEMI_PUBLIC.includes(path) && !hasResult) return '/test';

    // BUG-04 FIX: layout only mounts for logged-in users on app screens
    const needsLayout = _needsAppLayout(path, loggedIn);

    if (needsLayout && !_layoutMounted) {
      _layoutMounted = true;
      setTimeout(() => mountLayout(), 0);
    } else if (!needsLayout && _layoutMounted) {
      _layoutMounted = false;
      unmountLayout();
    } else if (needsLayout && _layoutMounted) {
      setTimeout(() => _updateActiveLink(), 0);
    }

    // Journey progress bar
    if (shouldShowJourney(path)) {
      setTimeout(() => mountJourneyProgress(path), 50);
    } else {
      unmountJourneyProgress();
    }

    return null;
  });

  Router.register('/',                  { render: Landing,        after: LandingEvents });
  Router.register('/login',             { render: Login,          after: LoginEvents });
  Router.register('/register',          { render: Register,       after: RegisterEvents });
  Router.register('/onboarding',        { render: Onboarding,     after: OnboardingEvents });
  Router.register('/test',              { render: Test,           after: TestEvents });
  Router.register('/results',           { render: Results,        after: ResultsEvents });
  Router.register('/decision-summary',  { render: DecisionSummary, after: DecisionSummaryEvents });
  Router.register('/pricing',           { render: Pricing,        after: PricingEvents });
  Router.register('/payment',           { render: Payment,        after: PaymentEvents });
  Router.register('/dashboard',         { render: Dashboard,      after: DashboardEvents });
  Router.register('/career',            { render: _careerRender,  after: _careerAfter });
  Router.register('/roadmap',           { render: Roadmap,        after: RoadmapEvents });
  Router.register('/courses',           { render: Courses,        after: CoursesEvents });
  Router.register('/mentorship',        { render: Mentorship,     after: MentorshipEvents });
  Router.register('/progress',          { render: Progress,       after: ProgressEvents });
  Router.register('/notifications',     { render: Notifications,  after: NotificationsEvents });
  Router.register('/settings',          { render: Settings,       after: SettingsEvents });

  Router.init();
}

document.addEventListener('DOMContentLoaded', bootstrap);
