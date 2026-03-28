import { t } from '../../i18n.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

// ── Notification types ───────────────────────────────────────────
const TYPE_META = {
  roadmap:  { color: '#6366f1', bg: '#6366f114', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 7 3 12 8 17"/><line x1="21" y1="6" x2="21" y2="18"/></svg>` },
  mentor:   { color: '#ec4899', bg: '#ec489914', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>` },
  result:   { color: '#10b981', bg: '#10b98114', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
  course:   { color: '#f59e0b', bg: '#f59e0b14', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>` },
  system:   { color: '#64748b', bg: '#64748b14', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>` },
};

const DEFAULT_NOTIFS = [
  { id: 'n1', type: 'roadmap', textKey: 'notif.roadmap', group: 'today',     read: false },
  { id: 'n2', type: 'mentor',  textKey: 'notif.mentor',  group: 'today',     read: false },
  { id: 'n3', type: 'result',  textKey: 'notif.results', group: 'yesterday', read: true  },
  { id: 'n4', type: 'course',  textKey: 'notif.course',  group: 'earlier',   read: true  },
];

const NOTIF_TEXTS = {
  en: {
    'notif.roadmap': 'Your roadmap step "HTML Foundations" is ready to start.',
    'notif.mentor':  'New mentor Karim Saad is available for Frontend sessions.',
    'notif.results': 'You completed your career assessment. Check your results.',
    'notif.course':  'Course "JavaScript Zero to Hero" has been updated.',
  },
  ar: {
    'notif.roadmap': 'خطوة "أساسيات HTML" في مسارك جاهزة للبدء.',
    'notif.mentor':  'المرشد الجديد كريم سعد متاح لجلسات الواجهة الأمامية.',
    'notif.results': 'أكملت تقييم مسارك المهني. تحقق من نتائجك.',
    'notif.course':  'تم تحديث دورة "JavaScript من الصفر إلى الاحتراف".',
  },
};

const GROUP_LABELS = {
  en: { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' },
  ar: { today: 'اليوم', yesterday: 'أمس', earlier: 'سابقاً' },
};

function _getText(key) {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  return NOTIF_TEXTS[lang]?.[key] ?? NOTIF_TEXTS['en'][key] ?? key;
}

function _getNotifs() {
  if (!State.getState('notifications')) {
    const saved = StorageService.get('notifications') || DEFAULT_NOTIFS;
    State.setState('notifications', saved);
  }
  return State.getState('notifications') || DEFAULT_NOTIFS;
}

function _save(notifs) {
  State.setState('notifications', notifs);
  StorageService.set('notifications', notifs);
  const unread = notifs.filter(n => !n.read).length;

  const badge = document.querySelector('#topbar-notif-btn .topbar__badge');
  const btn   = document.getElementById('topbar-notif-btn');
  if (badge) {
    if (unread === 0) badge.remove();
    else badge.textContent = unread;
  } else if (unread > 0 && btn) {
    const span = document.createElement('span');
    span.className = 'topbar__badge';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = unread;
    btn.appendChild(span);
  }

  const sidebarBadge = document.querySelector('.sidebar__link[data-path="/notifications"] .sidebar__badge');
  if (sidebarBadge) {
    if (unread === 0) sidebarBadge.remove();
    else sidebarBadge.textContent = unread;
  }
}

function _renderItem(n, isAr) {
  const meta = TYPE_META[n.type] || TYPE_META.system;
  return `
    <div class="notif-item${n.read ? '' : ' notif-item--unread'}" data-id="${n.id}">
      <div class="notif-item__icon" style="color:${meta.color};background:${meta.bg}">${meta.icon}</div>
      <div class="notif-item__body">
        <p class="notif-item__text">${_getText(n.textKey)}</p>
        <span class="notif-item__group">${GROUP_LABELS[isAr ? 'ar' : 'en'][n.group] || n.group}</span>
      </div>
      ${!n.read ? `
        <button class="notif-read-btn btn btn--ghost btn--sm" data-id="${n.id}" aria-label="${isAr ? 'تم القراءة' : 'Mark read'}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </button>` : `
        <span class="notif-item__read-mark" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </span>`
      }
    </div>`;
}

function _render(filter = 'all') {
  const isAr   = document.documentElement.getAttribute('lang') === 'ar';
  const notifs = _getNotifs();
  const unread = notifs.filter(n => !n.read).length;
  const list   = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  const groups = ['today', 'yesterday', 'earlier'];
  const byGroup = groups
    .map(g => ({ g, items: list.filter(n => n.group === g) }))
    .filter(({ items }) => items.length > 0);

  return `
    <div class="notifications-screen fade-in">

      <div class="notif-header">
        <div>
          <h1 class="notif-header__title">${isAr ? 'الإشعارات' : 'Notifications'}</h1>
          <p class="notif-header__sub">${unread > 0
            ? (isAr ? `لديك ${unread} غير مقروءة` : `${unread} unread`)
            : (isAr ? 'كلشيء تم قراءته' : 'All caught up')
          }</p>
        </div>
        <div class="notif-header__actions">
          <div class="notif-filter" role="tablist">
            <button role="tab" class="notif-filter__btn${filter === 'all' ? ' notif-filter__btn--active' : ''}" data-filter="all">${isAr ? 'الكل' : 'All'}</button>
            <button role="tab" class="notif-filter__btn${filter === 'unread' ? ' notif-filter__btn--active' : ''}" data-filter="unread">
              ${isAr ? 'غير مقروءة' : 'Unread'}
              ${unread > 0 ? `<span class="notif-filter__count">${unread}</span>` : ''}
            </button>
          </div>
          ${unread > 0
            ? `<button class="btn btn--ghost btn--sm" id="notif-mark-all">${isAr ? 'قراءة الكل' : 'Mark all read'}</button>`
            : ''}
        </div>
      </div>

      <div class="notif-list">
        ${list.length === 0
          ? `<div class="empty-state">
               <p>${isAr ? 'لا توجد إشعارات غير مقروءة' : 'No unread notifications'}</p>
             </div>`
          : byGroup.map(({ g, items }) => `
              <div class="notif-group">
                <div class="notif-group__label">${GROUP_LABELS[isAr ? 'ar' : 'en'][g] || g}</div>
                ${items.map(n => _renderItem(n, isAr)).join('')}
              </div>`).join('')
        }
      </div>
    </div>`;
}

export function Notifications() {
  return _render();
}

export function NotificationsEvents() {
  let currentFilter = 'all';

  const _rerender = () => {
    const outlet = document.getElementById('app-outlet');
    if (outlet) {
      outlet.innerHTML = _render(currentFilter);
      _bind();
    }
  };

  const _bind = () => {
    document.querySelectorAll('.notif-filter__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        _rerender();
      });
    });

    document.getElementById('notif-mark-all')?.addEventListener('click', () => {
      const notifs = _getNotifs().map(n => ({ ...n, read: true }));
      _save(notifs);
      _rerender();
    });

    document.querySelectorAll('.notif-read-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const notifs = _getNotifs().map(n =>
          n.id === btn.dataset.id ? { ...n, read: true } : n
        );
        _save(notifs);
        _rerender();
      });
    });
  };

  _bind();
}
