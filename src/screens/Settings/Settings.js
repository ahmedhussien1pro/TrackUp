import { getLang, setLang } from '../../i18n.js';
import State from '../../state.js';
import { AuthService } from '../../services/auth.service.js';
import { StorageService } from '../../services/storage.service.js';
import { Router } from '../../router.js';
import { unmountLayout, mountLayout } from '../../components/layout/Topbar.js';

const PLAN_LABEL = {
  en: { free: 'Free', pro: 'Pro', elite: 'Elite' },
  ar: { free: 'مجاني', pro: 'احترافي', elite: 'متميز' },
};

function _initials(name) {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function _render() {
  const user  = State.getState('user') || {};
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const lang  = getLang();
  const isAr  = lang === 'ar';
  const plan  = user.plan || 'free';
  const planLabel = PLAN_LABEL[isAr ? 'ar' : 'en'][plan] || plan;

  return `
    <div class="settings-screen fade-in">

      <div class="screen-header">
        <h1>${isAr ? 'الإعدادات' : 'Settings'}</h1>
        <p>${isAr ? 'إدارة حسابك وتفضيلاتك' : 'Manage your account and preferences'}</p>
      </div>

      <!-- Profile -->
      <div class="settings-card slide-up" style="animation-delay:0.04s">
        <div class="settings-card__label">${isAr ? 'الملف الشخصي' : 'Profile'}</div>
        <div class="settings-profile">
          <div class="settings-avatar" id="settings-avatar-preview">${_initials(user.name)}</div>
          <div class="settings-profile__meta">
            <span class="settings-profile__name">${user.name || (isAr ? 'مستخدم' : 'User')}</span>
            <span class="settings-profile__email">${user.email || ''}</span>
            <span class="badge badge--plan">${planLabel}</span>
          </div>
        </div>
        <div class="settings-form">
          <div class="form-group">
            <label class="form-label" for="settings-name">${isAr ? 'الاسم الكامل' : 'Full name'}</label>
            <input class="form-input" id="settings-name" type="text"
                   value="${user.name || ''}" autocomplete="name"
                   placeholder="${isAr ? 'اكتب اسمك' : 'Your name'}" />
          </div>
          <div class="form-group">
            <label class="form-label">${isAr ? 'البريد الإلكتروني' : 'Email'}</label>
            <input class="form-input" type="email" value="${user.email || ''}" disabled
                   style="opacity:0.5;cursor:not-allowed" />
          </div>
          <button class="btn btn--primary btn--sm" id="settings-save">
            ${isAr ? 'حفظ التغييرات' : 'Save changes'}
          </button>
        </div>
      </div>

      <!-- Appearance -->
      <div class="settings-card slide-up" style="animation-delay:0.08s">
        <div class="settings-card__label">${isAr ? 'المظهر' : 'Appearance'}</div>

        <div class="settings-row">
          <div class="settings-row__info">
            <span class="settings-row__title">${isAr ? 'الوضع الليلي' : 'Dark mode'}</span>
            <span class="settings-row__sub">${isAr ? 'تبديل جمالية التطبيق' : 'Switch the app appearance'}</span>
          </div>
          <button
            class="settings-toggle${theme === 'dark' ? ' settings-toggle--on' : ''}"
            id="settings-theme-btn"
            role="switch"
            aria-checked="${theme === 'dark'}"
          >
            <span class="settings-toggle__knob"></span>
          </button>
        </div>

        <div class="settings-row settings-row--border">
          <div class="settings-row__info">
            <span class="settings-row__title">${isAr ? 'اللغة' : 'Language'}</span>
            <span class="settings-row__sub">${isAr ? 'تغيير لغة الواجهة' : 'Change interface language'}</span>
          </div>
          <div class="settings-lang-pills">
            <button class="settings-lang-pill${!isAr ? ' settings-lang-pill--active' : ''}" data-lang="en">EN</button>
            <button class="settings-lang-pill${isAr  ? ' settings-lang-pill--active' : ''}" data-lang="ar">عر</button>
          </div>
        </div>
      </div>

      <!-- Subscription -->
      <div class="settings-card slide-up" style="animation-delay:0.12s">
        <div class="settings-card__label">${isAr ? 'خطة الاشتراك' : 'Subscription'}</div>
        <div class="settings-plan-row">
          <div>
            <span class="settings-plan-row__name">${planLabel}</span>
            <span class="settings-plan-row__hint">${
              plan === 'free'
                ? (isAr ? 'حدّث للحصول على جميع الميزات' : 'Upgrade to unlock all features')
                : (isAr ? 'لديك وصول كامل' : 'Full access active')
            }</span>
          </div>
          ${plan === 'free'
            ? `<a href="#/pricing" class="btn btn--primary btn--sm">${isAr ? 'تحديث' : 'Upgrade'}</a>`
            : `<span class="badge badge--active">${isAr ? 'نشط' : 'Active'}</span>`
          }
        </div>
      </div>

      <!-- Data & Privacy -->
      <div class="settings-card slide-up" style="animation-delay:0.16s">
        <div class="settings-card__label">${isAr ? 'البيانات والخصوصية' : 'Data & Privacy'}</div>

        <div class="settings-row">
          <div class="settings-row__info">
            <span class="settings-row__title">${isAr ? 'إعادة تعيين التقدم' : 'Reset progress'}</span>
            <span class="settings-row__sub">${isAr ? 'حذف جميع بيانات التقدم والالتحاقات' : 'Clear all progress and enrollment data'}</span>
          </div>
          <button class="btn btn--outline btn--sm" id="settings-reset-progress">
            ${isAr ? 'إعادة تعيين' : 'Reset'}
          </button>
        </div>

        <div class="settings-row settings-row--border">
          <div class="settings-row__info">
            <span class="settings-row__title">${isAr ? 'إعادة تعيين الإشعارات' : 'Reset notifications'}</span>
            <span class="settings-row__sub">${isAr ? 'استعادة جميع الإشعارات الافتراضية' : 'Restore all default notifications'}</span>
          </div>
          <button class="btn btn--outline btn--sm" id="settings-reset-notifs">
            ${isAr ? 'استعادة' : 'Restore'}
          </button>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="settings-card settings-card--danger slide-up" style="animation-delay:0.2s">
        <div class="settings-card__label">${isAr ? 'منطقة الخطر' : 'Danger zone'}</div>
        <div class="settings-row">
          <div class="settings-row__info">
            <span class="settings-row__title">${isAr ? 'تسجيل الخروج' : 'Sign out'}</span>
            <span class="settings-row__sub">${isAr ? 'إنهاء الجلسة الحالية' : 'End your current session'}</span>
          </div>
          <button class="btn btn--danger btn--sm" id="settings-logout">
            ${isAr ? 'خروج' : 'Sign out'}
          </button>
        </div>
      </div>

    </div>`;
}

function _rerender() {
  const outlet = document.getElementById('app-outlet');
  if (outlet) { outlet.innerHTML = _render(); SettingsEvents(); }
}

function _toast(msg, color = 'var(--color-success)') {
  Toastify({ text: msg, duration: 2200, gravity: 'bottom', position: 'right', style: { background: color } }).showToast();
}

export function Settings() { return _render(); }

export function SettingsEvents() {
  const isAr = getLang() === 'ar';

  // Live name preview
  document.getElementById('settings-name')?.addEventListener('input', e => {
    const preview = document.getElementById('settings-avatar-preview');
    if (preview) preview.textContent = _initials(e.target.value);
  });

  // Save profile
  document.getElementById('settings-save')?.addEventListener('click', () => {
    const val = document.getElementById('settings-name')?.value.trim();
    if (!val) {
      _toast(isAr ? 'أدخل اسمك' : 'Please enter your name', 'var(--color-danger)');
      return;
    }
    const updatedUser = { ...State.getState('user'), name: val };
    State.setState('user', updatedUser);
    StorageService.set('session', updatedUser);

    // Update sidebar DOM directly
    const sidebarName   = document.querySelector('.sidebar__user-name');
    const sidebarAvatar = document.querySelector('.sidebar__avatar');
    if (sidebarName)   sidebarName.textContent   = val;
    if (sidebarAvatar) sidebarAvatar.textContent = _initials(val);

    _toast(isAr ? 'تم الحفظ بنجاح' : 'Profile saved');
  });

  // Theme toggle
  document.getElementById('settings-theme-btn')?.addEventListener('click', () => {
    const cur  = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    StorageService.set('theme', next);
    _rerender();
  });

  // Language pills
  document.querySelectorAll('.settings-lang-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextLang = btn.dataset.lang;
      if (nextLang === getLang()) return;
      setLang(nextLang);
      StorageService.set('lang', nextLang);
      document.documentElement.setAttribute('lang', nextLang);
      document.documentElement.setAttribute('dir', nextLang === 'ar' ? 'rtl' : 'ltr');
      mountLayout();
      _rerender();
    });
  });

  // Reset progress
  document.getElementById('settings-reset-progress')?.addEventListener('click', () => {
    Swal.fire({
      title:             isAr ? 'إعادة تعيين التقدم?' : 'Reset progress?',
      text:              isAr ? 'سيتم حذف جميع بيانات التسجيل والحجز' : 'All enrollments and bookings will be cleared.',
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonText: isAr ? 'إعادة تعيين' : 'Reset',
      cancelButtonText:  isAr ? 'إلغاء' : 'Cancel',
      confirmButtonColor:'#f59e0b',
    }).then(r => {
      if (!r.isConfirmed) return;
      StorageService.remove('enrollments');
      StorageService.remove('trackup__bookings');
      State.setState('enrollments', []);
      _toast(isAr ? 'تمت إعادة التعيين' : 'Progress reset', 'var(--color-warning)');
    });
  });

  // Reset notifications
  document.getElementById('settings-reset-notifs')?.addEventListener('click', () => {
    StorageService.remove('notifications');
    State.setState('notifications', null);
    _toast(isAr ? 'تمت استعادة الإشعارات' : 'Notifications restored');
  });

  // Logout
  document.getElementById('settings-logout')?.addEventListener('click', () => {
    Swal.fire({
      title:             isAr ? 'تسجيل الخروج؟' : 'Sign out?',
      text:              isAr ? 'سيتم إنهاء جلستك' : 'Your session will end.',
      icon:              'question',
      showCancelButton:  true,
      confirmButtonText: isAr ? 'خروج' : 'Sign out',
      cancelButtonText:  isAr ? 'إلغاء' : 'Cancel',
      confirmButtonColor:'#ef4444',
    }).then(r => {
      if (r.isConfirmed) {
        AuthService.logout();
        unmountLayout();
        Router.navigate('/login');
      }
    });
  });
}
