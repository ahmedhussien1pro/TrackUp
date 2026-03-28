import State from './state.js';
import { Router } from './router.js';
import { setLang } from './i18n.js';
import { StorageService } from './services/storage.service.js';
import { AuthService } from './services/auth.service.js';
import { Sidebar, SidebarEvents } from './components/layout/Sidebar.js';
import { mountLayout, unmountLayout } from './components/layout/Topbar.js';

import { Landing }                            from './screens/Landing/Landing.js';
import { Login, LoginEvents }                 from './screens/Auth/Login.js';
import { Register, RegisterEvents }           from './screens/Auth/Register.js';
import { Onboarding, OnboardingEvents }       from './screens/Onboarding/Onboarding.js';
import { Test, TestEvents }                   from './screens/Test/Test.js';
import { Results, ResultsEvents }             from './screens/Results/Results.js';
import { Pricing, PricingEvents }             from './screens/Pricing/Pricing.js';
import { Payment, PaymentEvents }             from './screens/Payment/Payment.js';
import { Dashboard }                          from './screens/Dashboard/Dashboard.js';
import { Career, CareerEvents }               from './screens/Career/Career.js';
import { Roadmap, RoadmapEvents }             from './screens/Roadmap/Roadmap.js';
import { Courses, CoursesEvents }             from './screens/Courses/Courses.js';
import { Mentorship, MentorshipEvents }       from './screens/Mentorship/Mentorship.js';
import { Progress }                           from './screens/Progress/Progress.js';
import { Notifications, NotificationsEvents } from './screens/Notifications/Notifications.js';
import { Settings, SettingsEvents }           from './screens/Settings/Settings.js';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/pricing', '/test', '/results', '/onboarding'];

window.__trackup_layout_sidebar__ = { Sidebar, SidebarEvents };

function isPublic(path) {
  return PUBLIC_ROUTES.includes(path);
}

let _layoutMounted = false;

function bootstrap() {
  // Theme
  const savedTheme = StorageService.get('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  State.setState('theme', savedTheme);

  // Language
  const savedLang = StorageService.get('lang') || 'en';
  setLang(savedLang);
  State.setState('lang', savedLang);

  // Session restore
  AuthService.restoreSession();
  // Restore testResult
  const testResult = StorageService.get('testResult');
  if (testResult) State.setState('testResult', testResult);

  // Guard
  Router.setGuard((path) => {
    const loggedIn = !!State.getState('user');

    if (!isPublic(path) && !loggedIn) return '/login';
    if (loggedIn && (path === '/login' || path === '/register')) return '/dashboard';

    // Mount / unmount layout — only when auth state changes
    const needsLayout = !isPublic(path) && loggedIn;
    if (needsLayout && !_layoutMounted) {
      _layoutMounted = true;
      // defer so outlet render happens first
      setTimeout(() => mountLayout(), 0);
    } else if (!needsLayout && _layoutMounted) {
      _layoutMounted = false;
      unmountLayout();
    } else if (needsLayout && _layoutMounted) {
      // refresh sidebar active link on every navigation
      setTimeout(() => mountLayout(), 0);
    }

    return null;
  });

  // Routes
  Router.register('/',               { render: Landing });
  Router.register('/login',          { render: Login,          after: LoginEvents });
  Router.register('/register',       { render: Register,       after: RegisterEvents });
  Router.register('/onboarding',     { render: Onboarding,     after: OnboardingEvents });
  Router.register('/test',           { render: Test,           after: TestEvents });
  Router.register('/results',        { render: Results,        after: ResultsEvents });
  Router.register('/pricing',        { render: Pricing,        after: PricingEvents });
  Router.register('/payment',        { render: Payment,        after: PaymentEvents });
  Router.register('/dashboard',      { render: Dashboard });
  Router.register('/career',         { render: Career,         after: CareerEvents });
  Router.register('/roadmap',        { render: Roadmap,        after: RoadmapEvents });
  Router.register('/courses',        { render: Courses,        after: CoursesEvents });
  Router.register('/mentorship',     { render: Mentorship,     after: MentorshipEvents });
  Router.register('/progress',       { render: Progress });
  Router.register('/notifications',  { render: Notifications,  after: NotificationsEvents });
  Router.register('/settings',       { render: Settings,       after: SettingsEvents });

  Router.init();
}

document.addEventListener('DOMContentLoaded', bootstrap);
