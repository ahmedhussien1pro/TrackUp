import { t } from '../../i18n.js';
import State from '../../state.js';

const MOCK_NOTIFICATIONS = [
  { id: 'n1', text: 'You have a new mentor session booked with Karim Saad.',     time: '2 hours ago',  read: false },
  { id: 'n2', text: 'Step 2 on your Frontend roadmap is now available.',         time: '1 day ago',    read: false },
  { id: 'n3', text: 'Your Pro plan was activated successfully.',                  time: '3 days ago',   read: true  },
  { id: 'n4', text: 'New course added: React from Scratch by Karim Saad.',       time: '5 days ago',   read: true  },
];

export function Notifications() {
  const notes = State.getState('notifications') || MOCK_NOTIFICATIONS;
  const unread = notes.filter(n => !n.read).length;

  return `
    <div class="notifications-screen">
      <div class="notifications-screen__header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-6)">
        <div>
          <h1>${t('notifications.title')}</h1>
          ${unread > 0 ? `<p>${unread} unread</p>` : ''}
        </div>
        ${unread > 0 ? `
          <button class="btn btn--ghost btn--sm" id="notif-mark-all">
            ${t('notifications.markAllRead')}
          </button>
        ` : ''}
      </div>
      <div class="notifications-list">
        ${notes.length === 0 ? `<div class="empty-state">${t('notifications.empty')}</div>` : ''}
        ${notes.map(n => `
          <div class="notification-item ${n.read ? '' : 'notification-item--unread'}" data-notif-id="${n.id}">
            <div class="notification-item__dot"></div>
            <div style="flex:1">
              <div class="notification-item__text">${n.text}</div>
              <div class="notification-item__time">${n.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function NotificationsEvents() {
  document.getElementById('notif-mark-all')?.addEventListener('click', () => {
    const notes = (State.getState('notifications') || MOCK_NOTIFICATIONS).map(n => ({ ...n, read: true }));
    State.setState('notifications', notes);
    document.querySelectorAll('.notification-item--unread').forEach(el => el.classList.remove('notification-item--unread'));
    document.getElementById('notif-mark-all')?.remove();
  });
}
