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
    'results.title':        'Your Results',
    'results.eyebrow':      'Your Assessment Results',
    'results.headline':     'Your best-fit track is',
    'results.sub':          'Your answers were analysed across 6 cognitive dimensions to surface your strongest career alignment.',
    'results.bestFit':      'Best Fit',
    'results.whyThis':      'Why this track fits you',
    'results.altTrack':     'Strong alternative',
    'results.startTrack':   'Start Your Track',
    'results.startHint':    'Takes you to your dashboard with a personalised roadmap',
    'results.viewFull':     'View Full Analysis',
    'results.retake':       'Retake Assessment',
    'results.noResult':     'No results yet',
    'results.noResultSub':  'Complete the assessment first to discover your career fit',
    'results.measuringFit': 'Measuring fit across 6 dimensions...',
    'results.rankingResults':'Ranking your results...',

    // Decision Summary
    'decision.title':       'Decision Summary',
    'decision.eyebrow':     'Career Decision Summary',
    'decision.headline':    'Your track:',
    'decision.fitScore':    'Fit Score',
    'decision.confidence':  'Confidence',
    'decision.salary':      'Salary Range',
    'decision.duration':    'Prep Duration',
    'decision.dims':        'Cognitive Dimensions',
    'decision.style':       'Your Work Style',
    'decision.prefs':       'Professional Preferences',
    'decision.prefBuilds':  'You build',
    'decision.prefAvoids':  'You avoid',
    'decision.prefThrives': 'You thrive in',
    'decision.alt':         'Strong Alternative Track',
    'decision.skills':      'Skills You Will Build',
    'decision.ctaHeadline': 'Ready to turn this decision into an action plan?',
    'decision.ctaSub':      'Start your track for free or unlock the full report with a personalised roadmap.',
    'decision.unlockCta':   'Unlock Full Report',
    'decision.startFree':   'Start Track for Free',

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
    'nav.dashboard':      'لوحة التحكم',
    'nav.career':         'المسار المهني',
    'nav.roadmap':        'خارطة الطريق',
    'nav.courses':        'الدورات',
    'nav.mentorship':     'الإرشاد',
    'nav.progress':       'التقدم',
    'nav.notifications':  'الإشعارات',
    'nav.settings':       'الإعدادات',
    'nav.toggleSidebar':  'تبديل القائمة',
    'nav.results':        'نتائجك',
    'nav.decisionSummary':'ملخص القرار',

    // Auth
    'auth.login':      'تسجيل الدخول',
    'auth.register':   'إنشاء حساب',
    'auth.logout':     'تسجيل الخروج',
    'auth.name':       'الاسم الكامل',
    'auth.email':      'البريد الإلكتروني',
    'auth.password':   'كلمة المرور',
    'auth.noAccount':  'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب؟',
    'auth.signUp':     'سجل الآن',
    'auth.signIn':     'سجل دخولك',

    // Landing
    'landing.headline':  'قرّر مسارك بوضوح',
    'landing.sub':       'أجب على 7 أسئلة ذكية. احصل على قرار مهني مخصص مبني على تحليل معرفي.',
    'landing.cta':       'اكتشف مسارك',
    'landing.how':       'كيف يعمل',
    'landing.step1':     'أجب على 7 أسئلة',
    'landing.step1.sub': 'نحلّل أنماط تفكيرك عبر 6 أبعاد معرفية',
    'landing.step2':     'احصل على قرارك',
    'landing.step2.sub': 'توصية مهنية مبنية على دليل لا تخمين',
    'landing.step3':     'نفّذ بتوجيه',
    'landing.step3.sub': 'خارطة طريق ودورات وإرشاد مخصصة لمسارك',

    // Test
    'test.title':        'تقييم المسار المهني',
    'test.headline':     'نبني قرارك المهني',
    'test.exit':         'خروج',
    'test.question':     'سؤال',
    'test.of':           'من',
    'test.analysing':    'نبني قرارك المهني...',
    'test.finalAnalysis':'تحليل نهائي',

    // Results
    'results.title':        'نتائجك',
    'results.eyebrow':      'نتائج تقييمك',
    'results.headline':     'المسار الأنسب لك:',
    'results.sub':          'تم تحليل إجاباتك عبر 6 أبعاد معرفية لتحديد أقوى توافق مهني.',
    'results.bestFit':      'الأنسب لك',
    'results.whyThis':      'لماذا هذا المسار مناسب لك',
    'results.altTrack':     'مسار بديل قوي',
    'results.startTrack':   'ابدأ مسارك',
    'results.startHint':    'سينقلك إلى لوحة التحكم مع خارطة طريقك المخصصة',
    'results.viewFull':     'عرض التحليل الكامل',
    'results.retake':       'إعادة التقييم',
    'results.noResult':     'لا توجد نتائج بعد',
    'results.noResultSub':  'أكمل التقييم أولاً لمعرفة مسارك المهني',
    'results.measuringFit': 'نقيس التوافق عبر 6 أبعاد...',
    'results.rankingResults':'نرتّب نتائجك...',

    // Decision Summary
    'decision.title':       'ملخص القرار',
    'decision.eyebrow':     'ملخص القرار المهني',
    'decision.headline':    'مسارك:',
    'decision.fitScore':    'درجة التوافق',
    'decision.confidence':  'الثقة',
    'decision.salary':      'النطاق المرتبي',
    'decision.duration':    'مدة التحضير',
    'decision.dims':        'أبعادك المعرفية',
    'decision.style':       'أسلوب عملك',
    'decision.prefs':       'تفضيلاتك المهنية',
    'decision.prefBuilds':  'تبني',
    'decision.prefAvoids':  'تتجنب',
    'decision.prefThrives': 'تزدهر في',
    'decision.alt':         'المسار البديل القوي',
    'decision.skills':      'المهارات التي ستبنيها',
    'decision.ctaHeadline': 'جاهز لتحويل هذا القرار إلى خطة عمل؟',
    'decision.ctaSub':      'ابدأ مسارك مجاناً أو افتح التقرير الكامل مع خارطة طريق مخصصة.',
    'decision.unlockCta':   'فتح التقرير الكامل',
    'decision.startFree':   'ابدأ المسار مجاناً',

    // Settings
    'settings.title':       'الإعدادات',
    'settings.profile':     'الملف الشخصي',
    'settings.preferences': 'التفضيلات',
    'settings.theme':       'المظهر',
    'settings.language':    'اللغة',
    'settings.dark':        'الوضع الداكن',
    'settings.light':       'الوضع الفاتح',
    'settings.save':        'حفظ التغييرات',
    'settings.saved':       'تم الحفظ',
    'settings.logout':      'تسجيل الخروج',

    // Notifications
    'notifications.title':    'الإشعارات',
    'notifications.subtitle': 'تابع نشاطك وتحديثاتك',
    'notifications.markAll':  'تعيين الكل كمقروء',
    'notifications.empty':    'لا توجد إشعارات',

    // Progress
    'progress.title':           'التقدم',
    'progress.subtitle':        'تابع رحلة تعلمك',
    'progress.roadmapStatus':   'حالة الخارطة',
    'progress.stats.completed': 'الخطوات المكتملة',
    'progress.stats.enrolled':  'الدورات المسجلة',

    // Career
    'career.title':    'المسارات المهنية',
    'career.subtitle': 'اختر مسارك المهني وابدأ رحلتك',

    // Courses
    'courses.title':         'الدورات',
    'courses.subtitle':      'طور مهاراتك مع دورات متخصصة',
    'courses.free':          'مجاني',
    'courses.paid':          'مدفوع',
    'courses.enroll':        'سجّل',
    'courses.enrolled':      'مسجّل',
    'courses.lessons':       'درس',
    'courses.complete':      'مكتمل',
    'courses.start':         'استمر',
    'courses.enrolled_list': 'الدورات المسجلة',

    // Mentorship
    'mentorship.title':     'الإرشاد',
    'mentorship.subtitle':  'تعلم مباشرة من متخصصين في الصناعة',
    'mentorship.book':      'احجز جلسة',
    'mentorship.booked':    'تم الحجز',
    'mentorship.session':   'جلسة',
    'mentorship.sessions':  'جلسة',
    'mentorship.exp':       'سنوات خبرة',
    'mentorship.available': 'متاح',

    // Roadmap
    'roadmap.title':        'خارطة الطريق',
    'roadmap.selectTrack':  'اختر مساراً لعرض خارطة الطريق',
    'roadmap.step.start':   'ابدأ',
    'roadmap.step.complete':'علّم كمكتمل',
    'roadmap.step.done':    'مكتمل',
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
