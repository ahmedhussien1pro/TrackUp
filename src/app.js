import State from './state.js';
import { Router } from './router.js';
import { setLang } from './i18n.js';
import { StorageService } from './services/storage.service.js';
import { AuthService } from './services/auth.service.js';

import { Landing } from './screens/Landing/Landing.js';
import { Login, LoginEvents } from './screens/Auth/Login.js';
import { Register, RegisterEvents } from './screens/Auth/Register.js';
import { Onboarding, OnboardingEvents } from './screens/Onboarding/Onboarding.js';
import { Test, TestEvents } from './screens/Test/Test.js';
import { Results } from './screens/Results/Results.js';
import { Pricing, PricingEvents } from './screens/Pricing/Pricing.js';
import { Payment, PaymentEvents } from './screens/Payment/Payment.js';
import { Dashboard } from './screens/Dashboard/Dashboard.js';
import { Career, CareerEvents } from './screens/Career/Career.js';
import { Roadmap, RoadmapEvents } from './screens/Roadmap/Roadmap.js';
import { Courses, CoursesEvents } from './screens/Courses/Courses.js';
import { Mentorship, MentorshipEvents } from './screens/Mentorship/Mentorship.js';
import { Progress } from './screens/Progress/Progress.js';
import { Notifications, NotificationsEvents } from './screens/Notifications/Notifications.js';
import { Settings, SettingsEvents } from './screens/Settings/Settings.js';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/pricing', '/test', '/results'];

function bootstrap() {
  // Theme
  const savedTheme = StorageService.get('theme') || 'light';
  State.setState('theme', savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Language
  const savedLang = StorageService.get('lang') || 'en';
  State.setState('lang', savedLang);
  setLang(savedLang);
  document.documentElement.setAttribute('lang', savedLang);
  document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');

  // Session
  AuthService.restoreSession();

  // Auth guard
  Router.setGuard((path) => {
    const isPublic = PUBLIC_ROUTES.some(r => path === r || path.startsWith(r + '?'));
    const isLoggedIn = !!State.getState('user');
    if (!isPublic && !isLoggedIn) return '/login';
    if (isLoggedIn && (path === '/login' || path === '/register')) return '/dashboard';
    return null;
  });

  // Routes
  Router.register('/', { render: Landing });
  Router.register('/login', { render: Login, after: LoginEvents });
  Router.register('/register', { render: Register, after: RegisterEvents });
  Router.register('/onboarding', { render: Onboarding, after: OnboardingEvents });
  Router.register('/test', { render: Test, after: TestEvents });
  Router.register('/results', { render: Results });
  Router.register('/pricing', { render: Pricing, after: PricingEvents });
  Router.register('/payment', { render: Payment, after: PaymentEvents });
  Router.register('/dashboard', { render: Dashboard });
  Router.register('/career', { render: Career, after: CareerEvents });
  Router.register('/roadmap', { render: Roadmap, after: RoadmapEvents });
  Router.register('/courses', { render: Courses, after: CoursesEvents });
  Router.register('/mentorship', { render: Mentorship, after: MentorshipEvents });
  Router.register('/progress', { render: Progress });
  Router.register('/notifications', { render: Notifications, after: NotificationsEvents });
  Router.register('/settings', { render: Settings, after: SettingsEvents });

  Router.init();
}

document.addEventListener('DOMContentLoaded', bootstrap);
