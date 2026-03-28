import { StorageService } from './services/storage.service.js';

const STRINGS = {
  en: {
    // Navigation
    'nav.dashboard':      'Dashboard',
    'nav.career':         'Career',
    'nav.roadmap':        'Roadmap',
    'nav.courses':        'Courses',
    'nav.mentorship':     'Mentorship',
    'nav.progress':       'Progress',
    'nav.notifications':  'Notifications',
    'nav.settings':       'Settings',
    'nav.toggleSidebar':  'Toggle sidebar',
    'nav.results':        'Your Results',
    'nav.decisionSummary':'Decision Summary',

    // Auth
    'auth.login':      'Sign In',
    'auth.register':   'Create Account',
    'auth.logout':     'Sign Out',
    'auth.name':       'Full Name',
    'auth.email':      'Email Address',
    'auth.password':   'Password',
    'auth.noAccount':  'No account?',
    'auth.hasAccount': 'Have an account?',
    'auth.signUp':     'Sign up',
    'auth.signIn':     'Sign in',

    // Landing
    'landing.headline':  'Decide your career with clarity',
    'landing.sub':       'Answer 7 smart questions. Get a personalised career decision backed by cognitive analysis.',
    'landing.cta':       'Discover Your Path',
    'landing.how':       'How it works',
    'landing.step1':     'Answer 7 questions',
    'landing.step1.sub': 'We analyse your thinking patterns across 6 cognitive dimensions',
    'landing.step2':     'Get your decision',
    'landing.step2.sub': 'A career recommendation built on evidence, not guesswork',
    'landing.step3':     'Execute with guidance',
    'landing.step3.sub': 'Roadmap, courses, and mentorship tailored to your chosen track',

    // Test
    'test.title':        'Career Assessment',
    'test.headline':     'We are building your career decision',
    'test.exit':         'Exit',
    'test.question':     'Question',
    'test.of':           'of',
    'test.analysing':    'Building your career decision...',
    'test.finalAnalysis':'Final analysis',

    // Results
    'results.title':     'Your Results',
    'results.eyebrow':   'Your Assessment Results',
    'results.headline':  'Your best-fit track is',
    'results.sub':       'Your answers were analysed across 7 cognitive dimensions to surface your strongest career alignment.',
    'results.bestFit':   'Best Fit',
    'results.whyThis':   'Why this result?',
    'results.startTrack':'Start Your Track',
    'results.startHint': 'Takes you to your dashboard with a personalised roadmap',
    'results.viewFull':  'View Full Analysis',
    'results.retake':    'Retake Assessment',
    'results.noResult':  'No results yet',
    'results.noResultSub':'Complete the assessment first to discover your career fit',

    // Decision Summary
    'decision.title':    'Decision Summary',
    'decision.eyebrow':  'Career Decision Summary',
    'decision.headline': 'Your track:',
    'decision.fitScore': 'Fit Score',
    'decision.confidence':'Confidence',
    'decision.salary':   'Salary Range',
    'decision.duration': 'Prep Duration',
    'decision.dims':     'Cognitive Dimensions',
    'decision.style':    'Your Work Style',
    'decision.prefs':    'Professional Preferences',
    'decision.alt':      'Strong Alternative Track',
    'decision.skills':   'Skills You Will Build',
    'decision.unlockCta':'Unlock Full Report',
    'decision.startFree':'Start Track for Free',

    // Settings
    'settings.title':       'Settings',
    'settings.profile':     'Profile',
    'settings.preferences': 'Preferences',
    'settings.theme':       'Theme',
    'settings.language':    'Language',
    'settings.dark':        'Dark mode',
    'settings.light':       'Light mode',
    'settings.save':        'Save changes',
    'settings.saved':       'Changes saved',
    'settings.logout':      'Sign out',

    // Notifications
    'notifications.title':    'Notifications',
    'notifications.subtitle': 'Stay up to date with your activity',
    'notifications.markAll':  'Mark all as read',
    'notifications.empty':    'No notifications yet',

    // Progress
    'progress.title':           'Progress',
    'progress.subtitle':        'Track your learning journey',
    'progress.roadmapStatus':   'Roadmap status',
    'progress.stats.completed': 'Steps Completed',
    'progress.stats.enrolled':  'Courses Enrolled',

    // Career
    'career.title':    'Career Tracks',
    'career.subtitle': 'Choose your career track and start your journey',

    // Courses
    'courses.title':         'Courses',
    'courses.subtitle':      'Expand your skills with expert-led courses',
    'courses.free':          'Free',
    'courses.paid':          'Pro',
    'courses.enroll':        'Enroll',
    'courses.enrolled':      'Enrolled',
    'courses.lessons':       'lessons',
    'courses.complete':      'complete',
    'courses.start':         'Continue',
    'courses.enrolled_list': 'Enrolled Courses',

    // Mentorship
    'mentorship.title':     'Mentorship',
    'mentorship.subtitle':  'Learn directly from industry professionals',
    'mentorship.book':      'Book a session',
    'mentorship.booked':    'Session booked',
    'mentorship.session':   'session',
    'mentorship.sessions':  'sessions',
    'mentorship.exp':       'yr exp',
    'mentorship.available': 'Available',

    // Roadmap
    'roadmap.title':        'Roadmap',
    'roadmap.selectTrack':  'Select a career track to view your roadmap',
    'roadmap.step.start':   'Start',
    'roadmap.step.complete':'Mark Complete',
    'roadmap.step.done':    'Done',
  },

  ar: {
    // Navigation
    'nav.dashboard':      '\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645',
    'nav.career':         '\u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0645\u0647\u0646\u064a',
    'nav.roadmap':        '\u062e\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064a\u0642',
    'nav.courses':        '\u0627\u0644\u062f\u0648\u0631\u0627\u062a',
    'nav.mentorship':     '\u0627\u0644\u0625\u0631\u0634\u0627\u062f',
    'nav.progress':       '\u0627\u0644\u062a\u0642\u062f\u0645',
    'nav.notifications':  '\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a',
    'nav.settings':       '\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',
    'nav.toggleSidebar':  '\u062a\u0628\u062f\u064a\u0644 \u0627\u0644\u0642\u0627\u0626\u0645\u0629',
    'nav.results':        '\u0646\u062a\u0627\u0626\u062c\u0643',
    'nav.decisionSummary':'\u0645\u0644\u062e\u0635 \u0627\u0644\u0642\u0631\u0627\u0631',

    // Auth
    'auth.login':      '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644',
    'auth.register':   '\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628',
    'auth.logout':     '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c',
    'auth.name':       '\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644',
    'auth.email':      '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
    'auth.password':   '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
    'auth.noAccount':  '\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f',
    'auth.hasAccount': '\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f',
    'auth.signUp':     '\u0633\u062c\u0644 \u0627\u0644\u0622\u0646',
    'auth.signIn':     '\u0633\u062c\u0644 \u062f\u062e\u0648\u0644\u0643',

    // Landing
    'landing.headline':  '\u0642\u0631\u0651\u0631 \u0645\u0633\u0627\u0631\u0643 \u0628\u0648\u0636\u0648\u062d',
    'landing.sub':       '\u0623\u062c\u0628 \u0639\u0644\u0649 7 \u0623\u0633\u0626\u0644\u0629 \u0630\u0643\u064a\u0629. \u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0642\u0631\u0627\u0631 \u0645\u0647\u0646\u064a \u0645\u062e\u0635\u0635 \u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u062a\u062d\u0644\u064a\u0644 \u0645\u0639\u0631\u0641\u064a.',
    'landing.cta':       '\u0627\u0643\u062a\u0634\u0641 \u0645\u0633\u0627\u0631\u0643',
    'landing.how':       '\u0643\u064a\u0641 \u064a\u0639\u0645\u0644',
    'landing.step1':     '\u0623\u062c\u0628 \u0639\u0644\u0649 7 \u0623\u0633\u0626\u0644\u0629',
    'landing.step1.sub': '\u0646\u062d\u0644\u0651\u0644 \u0623\u0646\u0645\u0627\u0637 تفكيرك عبر 6 أبعاد معرفية',
    'landing.step2':     '\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0642\u0631\u0627\u0631\u0643',
    'landing.step2.sub': '\u062a\u0648\u0635\u064a\u0629 \u0645\u0647\u0646\u064a\u0629 \u0645\u0628\u0646\u064a\u0629 \u0639\u0644\u0649 \u062f\u0644\u064a\u0644 \u0644\u0627 \u062a\u062e\u0645\u064a\u0646',
    'landing.step3':     '\u0646\u0641\u0651\u0630 \u0628\u062a\u0648\u062c\u064a\u0647',
    'landing.step3.sub': '\u062e\u0627\u0631\u0637\u0629 \u0637\u0631\u064a\u0642 \u0648\u062f\u0648\u0631\u0627\u062a \u0648\u0625\u0631\u0634\u0627\u062f \u0645\u062e\u0635\u0635\u0629 \u0644\u0645\u0633\u0627\u0631\u0643',

    // Test
    'test.title':        '\u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0645\u0647\u0646\u064a',
    'test.headline':     '\u0646\u0628\u0646\u064a \u0642\u0631\u0627\u0631\u0643 \u0627\u0644\u0645\u0647\u0646\u064a',
    'test.exit':         '\u062e\u0631\u0648\u062c',
    'test.question':     '\u0633\u0624\u0627\u0644',
    'test.of':           '\u0645\u0646',
    'test.analysing':    '\u0646\u0628\u0646\u064a \u0642\u0631\u0627\u0631\u0643 \u0627\u0644\u0645\u0647\u0646\u064a...',
    'test.finalAnalysis':'\u062a\u062d\u0644\u064a\u0644 \u0646\u0647\u0627\u0626\u064a',

    // Results
    'results.title':     '\u0646\u062a\u0627\u0626\u062c\u0643',
    'results.eyebrow':   '\u0646\u062a\u0627\u0626\u062c \u062a\u0642\u064a\u064a\u0645\u0643',
    'results.headline':  '\u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643:',
    'results.sub':       '\u062a\u0645 \u062a\u062d\u0644\u064a\u0644 \u0625\u062c\u0627\u0628\u0627\u062a\u0643 \u0639\u0628\u0631 7 \u0623\u0628\u0639\u0627\u062f \u0645\u0639\u0631\u0641\u064a\u0629 \u0644\u062a\u062d\u062f\u064a\u062f \u0623\u0642\u0648\u0649 \u062a\u0648\u0627\u0641\u0642 \u0645\u0647\u0646\u064a',
    'results.bestFit':   '\u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643',
    'results.whyThis':   '\u0644\u0645\u0627\u0630\u0627 \u0647\u0630\u0647 \u0627\u0644\u0646\u062a\u064a\u062c\u0629\u061f',
    'results.startTrack':'\u0627\u0628\u062f\u0623 \u0645\u0633\u0627\u0631\u0643',
    'results.startHint': '\u0633\u064a\u0646\u0642\u0644\u0643 \u0625\u0644\u0649 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645 \u0645\u0639 \u062e\u0627\u0631\u0637\u0629 \u0637\u0631\u064a\u0642\u0643 \u0627\u0644\u0645\u062e\u0635\u0635\u0629',
    'results.viewFull':  '\u0639\u0631\u0636 \u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0643\u0627\u0645\u0644',
    'results.retake':    '\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u062a\u0642\u064a\u064a\u0645',
    'results.noResult':  '\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u062a\u0627\u0626\u062c \u0628\u0639\u062f',
    'results.noResultSub':'\u0623\u0643\u0645\u0644 \u0627\u0644\u062a\u0642\u064a\u064a\u0645 \u0623\u0648\u0644\u0627\u064b \u0644\u0645\u0639\u0631\u0641\u0629 \u0645\u0633\u0627\u0631\u0643 \u0627\u0644\u0645\u0647\u0646\u064a',

    // Decision Summary
    'decision.title':    '\u0645\u0644\u062e\u0635 \u0627\u0644\u0642\u0631\u0627\u0631',
    'decision.eyebrow':  '\u0645\u0644\u062e\u0635 \u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0645\u0647\u0646\u064a',
    'decision.headline': '\u0645\u0633\u0627\u0631\u0643:',
    'decision.fitScore': '\u062f\u0631\u062c\u0629 \u0627\u0644\u062a\u0648\u0627\u0641\u0642',
    'decision.confidence':'\u0627\u0644\u062b\u0642\u0629',
    'decision.salary':   '\u0627\u0644\u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u0631\u062a\u0628\u064a',
    'decision.duration': '\u0645\u062f\u0629 \u0627\u0644\u062a\u062d\u0636\u064a\u0631',
    'decision.dims':     '\u0623\u0628\u0639\u0627\u062f\u0643 \u0627\u0644\u0645\u0639\u0631\u0641\u064a\u0629',
    'decision.style':    '\u0623\u0633\u0644\u0648\u0628 \u0639\u0645\u0644\u0643',
    'decision.prefs':    '\u062a\u0641\u0636\u064a\u0644\u0627\u062a\u0643 \u0627\u0644\u0645\u0647\u0646\u064a\u0629',
    'decision.alt':      '\u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0628\u062f\u064a\u0644 \u0627\u0644\u0642\u0648\u064a',
    'decision.skills':   '\u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062a \u0627\u0644\u062a\u064a \u0633\u062a\u0628\u0646\u064a\u0647\u0627',
    'decision.unlockCta':'\u0641\u062a\u062d \u0627\u0644\u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0643\u0627\u0645\u0644',
    'decision.startFree':'\u0627\u0628\u062f\u0623 \u0627\u0644\u0645\u0633\u0627\u0631 \u0645\u062c\u0627\u0646\u0627\u064b',

    // Settings
    'settings.title':       '\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',
    'settings.profile':     '\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a',
    'settings.preferences': '\u0627\u0644\u062a\u0641\u0636\u064a\u0644\u0627\u062a',
    'settings.theme':       '\u0627\u0644\u0645\u0638\u0647\u0631',
    'settings.language':    '\u0627\u0644\u0644\u063a\u0629',
    'settings.dark':        '\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062f\u0627\u0643\u0646',
    'settings.light':       '\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062a\u062d',
    'settings.save':        '\u062d\u0641\u0638 \u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a',
    'settings.saved':       '\u062a\u0645 \u0627\u0644\u062d\u0641\u0638',
    'settings.logout':      '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c',

    // Notifications
    'notifications.title':    '\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a',
    'notifications.subtitle': '\u062a\u0627\u0628\u0639 \u0646\u0634\u0627\u0637\u0643 \u0648\u062a\u062d\u062f\u064a\u062b\u0627\u062a\u0643',
    'notifications.markAll':  '\u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u0643\u0644 \u0643\u0645\u0642\u0631\u0648\u0621',
    'notifications.empty':    '\u0644\u0627 \u062a\u0648\u062c\u062f \u0625\u0634\u0639\u0627\u0631\u0627\u062a',

    // Progress
    'progress.title':           '\u0627\u0644\u062a\u0642\u062f\u0645',
    'progress.subtitle':        '\u062a\u0627\u0628\u0639 \u0631\u062d\u0644\u0629 \u062a\u0639\u0644\u0645\u0643',
    'progress.roadmapStatus':   '\u062d\u0627\u0644\u0629 \u0627\u0644\u062e\u0627\u0631\u0637\u0629',
    'progress.stats.completed': '\u0627\u0644\u062e\u0637\u0648\u0627\u062a \u0627\u0644\u0645\u0643\u062a\u0645\u0644\u0629',
    'progress.stats.enrolled':  '\u0627\u0644\u062f\u0648\u0631\u0627\u062a \u0627\u0644\u0645\u0633\u062c\u0644\u0629',

    // Career
    'career.title':    '\u0627\u0644\u0645\u0633\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0647\u0646\u064a\u0629',
    'career.subtitle': '\u0627\u062e\u062a\u0631 \u0645\u0633\u0627\u0631\u0643 \u0627\u0644\u0645\u0647\u0646\u064a \u0648\u0627\u0628\u062f\u0623 \u0631\u062d\u0644\u062a\u0643',

    // Courses
    'courses.title':         '\u0627\u0644\u062f\u0648\u0631\u0627\u062a',
    'courses.subtitle':      '\u0637\u0648\u0631 \u0645\u0647\u0627\u0631\u0627\u062a\u0643 \u0645\u0639 \u062f\u0648\u0631\u0627\u062a \u0645\u062a\u062e\u0635\u0635\u0629',
    'courses.free':          '\u0645\u062c\u0627\u0646\u064a',
    'courses.paid':          '\u0645\u062f\u0641\u0648\u0639',
    'courses.enroll':        '\u0633\u062c\u0651\u0644',
    'courses.enrolled':      '\u0645\u0633\u062c\u0651\u0644',
    'courses.lessons':       '\u062f\u0631\u0633',
    'courses.complete':      '\u0645\u0643\u062a\u0645\u0644',
    'courses.start':         '\u0627\u0633\u062a\u0645\u0631',
    'courses.enrolled_list': '\u0627\u0644\u062f\u0648\u0631\u0627\u062a \u0627\u0644\u0645\u0633\u062c\u0644\u0629',

    // Mentorship
    'mentorship.title':     '\u0627\u0644\u0625\u0631\u0634\u0627\u062f',
    'mentorship.subtitle':  '\u062a\u0639\u0644\u0645 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u0645\u062a\u062e\u0635\u0635\u064a\u0646 \u0641\u064a \u0627\u0644\u0635\u0646\u0627\u0639\u0629',
    'mentorship.book':      '\u0627\u062d\u062c\u0632 \u062c\u0644\u0633\u0629',
    'mentorship.booked':    '\u062a\u0645 \u0627\u0644\u062d\u062c\u0632',
    'mentorship.session':   '\u062c\u0644\u0633\u0629',
    'mentorship.sessions':  '\u062c\u0644\u0633\u0629',
    'mentorship.exp':       '\u0633\u0646\u0648\u0627\u062a \u062e\u0628\u0631\u0629',
    'mentorship.available': '\u0645\u062a\u0627\u062d',

    // Roadmap
    'roadmap.title':        '\u062e\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064a\u0642',
    'roadmap.selectTrack':  '\u0627\u062e\u062a\u0631 \u0645\u0633\u0627\u0631\u064b\u0627 \u0644\u0639\u0631\u0636 \u062e\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064a\u0642',
    'roadmap.step.start':   '\u0627\u0628\u062f\u0623',
    'roadmap.step.complete':'\u0639\u0644\u0651\u0645 \u0643\u0645\u0643\u062a\u0645\u0644',
    'roadmap.step.done':    '\u0645\u0643\u062a\u0645\u0644',
  },
};

let _lang = 'en';

export function getLang() { return _lang; }

export function setLang(lang) {
  _lang = lang;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}

export function t(key) {
  return STRINGS[_lang]?.[key] ?? STRINGS['en']?.[key] ?? key;
}

_lang = StorageService.get('lang') || 'en';
setLang(_lang);

window.__trackup_i18n__ = { t };
