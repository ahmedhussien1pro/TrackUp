import { t } from '../../i18n.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

const DEFAULT_NOTIFS = [
  { id: 'n1', text: 'Your roadmap step "HTML Foundations" is ready to start.', time: '2 hours ago', read: false },
  { id: 'n2', text: 'New mentor Karim Saad is available for Frontend sessions.', time: '5 hours ago', read: false },
  { id: 'n3', text: 'You completed your career assessment. Check your results.', time: '1 day ago', read: true },
  { id: 'n4', text: 'Course "JavaScript Zero to Hero" has been updated.', time: '2 days ago', read: true },
];

function _getNotifs() {
  if (!State.getState('notifications')) {
    const saved = StorageService.get('notifications') || DEFAULT_NOTIFS;
    State.setState('notifications', saved);
  }
  return State.getState('notifications') || DEFAULT_NOTIFS;
}

export function Notifications() {
  const notifs = _getNotifs();
  const unread = notifs.filter(n => !n.read).length;

  return `
    <div class="notifications-screen">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-8)">
        <div>
          <h1 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:900;letter-spacing:-0.02em;margin-bottom:var(--space-1)">${t('notifications.title')}</h1>
          <p style="color:var(--color-text-secondary);font-size:var(--text-sm)">${t('notifications.subtitle')}</p>
        </div>
        ${unread > 0 ? `<button class="btn btn--outline btn--sm" id="notif-mark-all">${t('notifications.markAll')}</button>` : ''}
      </div>

      <div class="notifications-list">
        ${notifs.length === 0 ? `<p class="empty-state">${t('notifications.empty')}</p>` : ''}
        ${notifs.map(n => `
          <div class="notification-item${n.read ? '' : ' notification-item--unread'}" data-id="${n.id}">
            <span class="notification-item__dot" aria-hidden="true"></span>
            <div style="flex:1">
              <p class="notification-item__text">${n.text}</p>
              <span class="notification-item__time ltr-text">${n.time}</span>
            </div>
            ${!n.read ? `<button class="btn btn--ghost btn--sm notif-read-btn" data-id="${n.id}" style="flex-shrink:0">&#10003;</button>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function NotificationsEvents() {
  document.getElementById('notif-mark-all')?.addEventListener('click', () => {
    const notifs = _getNotifs().map(n => ({ ...n, read: true }));
    State.setState('notifications', notifs);
    StorageService.set('notifications', notifs);
    // Re-render
    document.getElementById('app-outlet').innerHTML = Notifications();
    NotificationsEvents();
  });

  document.querySelectorAll('.notif-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const notifs = _getNotifs().map(n => n.id === id ? { ...n, read: true } : n);
      State.setState('notifications', notifs);
      StorageService.set('notifications', notifs);
      document.getElementById('app-outlet').innerHTML = Notifications();
      NotificationsEvents();
    });
  });
}
