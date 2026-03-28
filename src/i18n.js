// ============================================================
// TrackUp i18n — minimal, fast, tree-shakeable
// ============================================================
import { StorageService } from './services/storage.service.js';

const STRINGS = {
  en: {
    'nav.dashboard':     'Dashboard',
    'nav.career':        'Career',
    'nav.roadmap':       'Roadmap',
    'nav.courses':       'Courses',
    'nav.mentorship':    'Mentorship',
    'nav.progress':      'Progress',
    'nav.notifications': 'Notifications',
    'nav.settings':      'Settings',
    'nav.toggleSidebar': 'Toggle sidebar',

    'auth.login':        'Sign In',
    'auth.register':     'Create Account',
    'auth.logout':       'Sign Out',
    'auth.name':         'Full Name',
    'auth.email':        'Email Address',
    'auth.password':     'Password',
    'auth.noAccount':    'No account?',
    'auth.hasAccount':   'Have an account?',
    'auth.signUp':       'Sign up',
    'auth.signIn':       'Sign in',

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

    'notifications.title':   'Notifications',
    'notifications.subtitle':'Stay up to date with your activity',
    'notifications.markAll': 'Mark all as read',
    'notifications.empty':   'No notifications yet',

    'progress.title':           'Progress',
    'progress.subtitle':        'Track your learning journey',
    'progress.roadmapStatus':   'Roadmap status',
    'progress.stats.completed': 'Steps Completed',
    'progress.stats.enrolled':  'Courses Enrolled',

    'career.title':  'Career Tracks',
    'courses.enrolled': 'Enrolled Courses',
    'roadmap.title': 'Roadmap',
    'roadmap.selectTrack': 'Select a career track to view your roadmap',
    'roadmap.step.start': 'Start',
    'roadmap.step.complete': 'Mark Complete',
    'roadmap.step.done': 'Done',
  },
  ar: {
    'nav.dashboard':     'لوحة التحكم',
    'nav.career':        'المسار المهني',
    'nav.roadmap':       'خارطة الطريق',
    'nav.courses':       'الدورات',
    'nav.mentorship':    'الإرشاد',
    'nav.progress':      'التقدم',
    'nav.notifications': 'الإشعارات',
    'nav.settings':      'الإعدادات',
    'nav.toggleSidebar': 'تبديل القائمة',

    'auth.login':        'تسجيل الدخول',
    'auth.register':     'إنشاء حساب',
    'auth.logout':       'تسجيل الخروج',
    'auth.name':         'الاسم الكامل',
    'auth.email':        'البريد الإلكتروني',
    'auth.password':     'كلمة المرور',
    'auth.noAccount':    'ليس لديك حساب؟',
    'auth.hasAccount':   'لديك حساب؟',
    'auth.signUp':       'سجل الآن',
    'auth.signIn':       'سجل دخولك',

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

    'notifications.title':   'الإشعارات',
    'notifications.subtitle':'تابع نشاطك وتحديثاتك',
    'notifications.markAll': 'تعيين الكل كمقروء',
    'notifications.empty':   'لا توجد إشعارات',

    'progress.title':           'التقدم',
    'progress.subtitle':        'تابع رحلة تعلمك',
    'progress.roadmapStatus':   'حالة الخارطة',
    'progress.stats.completed': 'الخطوات المكتملة',
    'progress.stats.enrolled':  'الدورات المسجلة',

    'career.title':  'المسارات المهنية',
    'courses.enrolled': 'الدورات المسجلة',
    'roadmap.title': 'خارطة الطريق',
    'roadmap.selectTrack': 'اختر مسارًا لعرض خارطة الطريق',
    'roadmap.step.start': 'ابدأ',
    'roadmap.step.complete': 'علّم كمكتمل',
    'roadmap.step.done': 'مكتمل',
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

// ---- init from storage ----
_lang = StorageService.get('lang') || 'en';
setLang(_lang);

// ---- window bridge for app.js _updateActiveLink ----
window.__trackup_i18n__ = { t };
