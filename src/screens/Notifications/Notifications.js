import { t } from '../../i18n.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

const DEFAULT_NOTIFS = [
  { id: 'n1', textKey: 'notif.roadmap',  timeKey: '2 hours ago',  read: false },
  { id: 'n2', textKey: 'notif.mentor',   timeKey: '5 hours ago',  read: false },
  { id: 'n3', textKey: 'notif.results',  timeKey: '1 day ago',    read: true  },
  { id: 'n4', textKey: 'notif.course',   timeKey: '2 days ago',   read: true  },
];

const NOTIF_TEXTS = {
  en: {
    'notif.roadmap':  'Your roadmap step "HTML Foundations" is ready to start.',
    'notif.mentor':   'New mentor Karim Saad is available for Frontend sessions.',
    'notif.results':  'You completed your career assessment. Check your results.',
    'notif.course':   'Course "JavaScript Zero to Hero" has been updated.',
  },
  ar: {
    'notif.roadmap':  'خطوة "أساسيات HTML" في مسارك جاهزة للبدء.',
    'notif.mentor':   'المرشد الجديد كريم سعد متاح لجلسات الواجهة الأمامية.',
    'notif.results':  'أكملت تقييم مسارك المهني. تحقق من نتائجك.',
    'notif.course':   'تم تحديث دورة "JavaScript من الصفر إلى الاحتراف".',
  },
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

function _render() {
  const notifs = _getNotifs();
  const unread = notifs.filter(n => !n.read).length;

  return `
    <div class="notifications-screen">
      <div class="screen-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-3)">
        <div>
          <h1>${t('notifications.title')}</h1>
          <p>${t('notifications.subtitle')}</p>
        </div>
        ${unread > 0
          ? `<button class="btn btn--outline btn--sm" id="notif-mark-all">${t('notifications.markAll')}</button>`
          : ''}
      </div>

      <div class="notifications-list">
        ${notifs.length === 0
          ? `<div class="empty-state">${t('notifications.empty')}</div>`
          : notifs.map(n => `
            <div class="notification-item${n.read ? '' : ' notification-item--unread'}" data-id="${n.id}">
              <span class="notification-item__dot" aria-hidden="true"></span>
              <div style="flex:1;min-width:0">
                <p class="notification-item__text">${_getText(n.textKey)}</p>
                <span class="notification-item__time">${n.timeKey}</span>
              </div>
              ${!n.read
                ? `<button
                    class="btn btn--ghost btn--sm notif-read-btn"
                    data-id="${n.id}"
                    style="flex-shrink:0"
                    aria-label="Mark as read"
                   >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   </button>`
                : ''}
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

export function Notifications() {
  return _render();
}

function _save(notifs) {
  State.setState('notifications', notifs);
  StorageService.set('notifications', notifs);
  // Update topbar badge
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
  // Update sidebar badge
  const sidebarBadge = document.querySelector('.sidebar__link[data-path="/notifications"] .sidebar__badge');
  if (sidebarBadge) {
    if (unread === 0) sidebarBadge.remove();
    else sidebarBadge.textContent = unread;
  }
}

export function NotificationsEvents() {
  document.getElementById('notif-mark-all')?.addEventListener('click', () => {
    const notifs = _getNotifs().map(n => ({ ...n, read: true }));
    _save(notifs);
    const outlet = document.getElementById('app-outlet');
    if (outlet) { outlet.innerHTML = _render(); NotificationsEvents(); }
  });

  document.querySelectorAll('.notif-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const notifs = _getNotifs().map(n => n.id === id ? { ...n, read: true } : n);
      _save(notifs);
      const outlet = document.getElementById('app-outlet');
      if (outlet) { outlet.innerHTML = _render(); NotificationsEvents(); }
    });
  });
}
