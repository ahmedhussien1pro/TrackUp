import { t } from '../../i18n.js';
import State from '../../state.js';

export function Notifications() {
  const notifications = State.getState('notifications') || [];
  return `
    <div class="notifications-screen">
      <div class="notifications-screen__header">
        <h2>${t('notifications.title')}</h2>
        ${notifications.length > 0 ? `
          <button class="btn btn--ghost btn--sm" id="mark-all-read">
            ${t('notifications.markAllRead')}
          </button>
        ` : ''}
      </div>
      <div class="notifications-screen__list">
        ${notifications.length === 0
          ? `<div class="empty-state"><p>${t('notifications.empty')}</p></div>`
          : notifications.map(n => `
            <div class="notification-item ${n.read ? '' : 'notification-item--unread'}" data-id="${n.id}">
              <div class="notification-item__dot"></div>
              <div class="notification-item__body">
                <p class="notification-item__text">${n.message}</p>
                <span class="notification-item__time">${n.time}</span>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

export function NotificationsEvents() {
  document.getElementById('mark-all-read')?.addEventListener('click', () => {
    const updated = (State.getState('notifications') || []).map(n => ({ ...n, read: true }));
    State.setState('notifications', updated);
    document.querySelectorAll('.notification-item--unread').forEach(el => {
      el.classList.remove('notification-item--unread');
    });
  });
}
