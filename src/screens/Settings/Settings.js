import { t, getLang, setLang } from '../../i18n.js';
import State from '../../state.js';
import { AuthService } from '../../services/auth.service.js';
import { StorageService } from '../../services/storage.service.js';
import { Router } from '../../router.js';
import { unmountLayout, mountLayout } from '../../components/layout/Topbar.js';

const PLAN_META = {
  en: { free: 'Free', pro: 'Pro', elite: 'Elite' },
  ar: { free: 'مجاني', pro: 'احترافي', elite: 'متميز' },
};

export function Settings() {
  const user  = State.getState('user') || {};
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const lang  = getLang();
  const isAr  = lang === 'ar';
  const plan  = user.plan || 'free';
  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return `
    <div class="settings-screen fade-in">

      <div class="screen-header">
        <h1>${isAr ? 'الإعدادات' : 'Settings'}</h1>
        <p>${isAr ? 'إدارة حسابك وتفضيلاتك' : 'Manage your account and preferences'}</p>
      </div>

      <!-- Profile card -->
      <div class="settings-card slide-up" style="animation-delay:0.04s">
        <div class="settings-card__label">${isAr ? 'الملف الشخصي' : 'Profile'}</div>
        <div class="settings-profile">
          <div class="settings-avatar">${initials}</div>
          <div class="settings-profile__meta">
            <span class="settings-profile__name">${user.name || (isAr ? 'مستخدم' : 'User')}</span>
            <span class="settings-profile__email">${user.email || ''}</span>
            <span class="badge badge--plan">${PLAN_META[isAr ? 'ar' : 'en'][plan] || plan}</span>
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
            <input class="form-input" type="email"
                   value="${user.email || ''}" disabled
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
            aria-label="${isAr ? 'الوضع الليلي' : 'Dark mode'}"
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
            <button class="settings-lang-pill${isAr ? ' settings-lang-pill--active' : ''}" data-lang="ar">عر</button>
          </div>
        </div>
      </div>

      <!-- Plan -->
      <div class="settings-card slide-up" style="animation-delay:0.12s">
        <div class="settings-card__label">${isAr ? 'خطة الاشتراك' : 'Subscription'}</div>
        <div class="settings-plan-row">
          <div>
            <span class="settings-plan-row__name">${PLAN_META[isAr ? 'ar' : 'en'][plan] || plan}</span>
            <span class="settings-plan-row__hint">${
              plan === 'free'
                ? (isAr ? 'تحديث للحصول على جميع الميزات' : 'Upgrade to unlock all features')
                : (isAr ? 'لديك وصول كامل' : 'Full access active')
            }</span>
          </div>
          ${plan === 'free'
            ? `<a href="#/pricing" class="btn btn--primary btn--sm">${isAr ? 'تحديث' : 'Upgrade'}</a>`
            : `<span class="badge badge--active">${isAr ? 'نشط' : 'Active'}</span>`
          }
        </div>
      </div>

      <!-- Danger zone -->
      <div class="settings-card settings-card--danger slide-up" style="animation-delay:0.16s">
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
  if (outlet) { outlet.innerHTML = Settings(); SettingsEvents(); }
}

export function SettingsEvents() {
  // Save profile
  document.getElementById('settings-save')?.addEventListener('click', () => {
    const val = document.getElementById('settings-name')?.value.trim();
    if (!val) return;
    const updatedUser = { ...State.getState('user'), name: val };
    State.setState('user', updatedUser);
    StorageService.set('session', updatedUser);
    document.querySelector('.sidebar__avatar')?.let?.(el => el.textContent = val.charAt(0).toUpperCase());
    document.querySelector('.sidebar__user-name')  && (document.querySelector('.sidebar__user-name').textContent = val);
    Toastify({
      text: getLang() === 'ar' ? 'تم الحفظ' : 'Saved',
      duration: 2000, gravity: 'bottom', position: 'right',
      style: { background: 'var(--color-success)' },
    }).showToast();
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
      mountLayout();
      _rerender();
    });
  });

  // Logout
  document.getElementById('settings-logout')?.addEventListener('click', () => {
    const isAr = getLang() === 'ar';
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
