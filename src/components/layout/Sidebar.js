import { t } from '../../i18n.js';
import State from '../../state.js';

// SVG icons — inline, no dependency
const ICONS = {
  dashboard:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  career:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  roadmap:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 7 3 12 8 17"/><line x1="21" y1="6" x2="21" y2="18"/></svg>`,
  courses:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  mentorship:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  progress:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  notifications: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  settings:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
};

const NAV_ITEMS = [
  { path: '/dashboard',     labelKey: 'nav.dashboard',     icon: 'dashboard' },
  { path: '/career',        labelKey: 'nav.career',        icon: 'career' },
  { path: '/roadmap',       labelKey: 'nav.roadmap',       icon: 'roadmap' },
  { path: '/courses',       labelKey: 'nav.courses',       icon: 'courses' },
  { path: '/mentorship',    labelKey: 'nav.mentorship',    icon: 'mentorship' },
  { path: '/progress',      labelKey: 'nav.progress',      icon: 'progress' },
  { path: '/notifications', labelKey: 'nav.notifications', icon: 'notifications' },
  { path: '/settings',      labelKey: 'nav.settings',      icon: 'settings' },
];

function _unreadCount() {
  // Read from state — Notifications screen sets this
  const notifs = State.getState('notifications') || [];
  return notifs.filter(n => !n.read).length;
}

export function Sidebar() {
  const currentPath = window.location.hash.slice(1).split('?')[0] || '/';
  const unread = _unreadCount();
  const user = State.getState('user') || {};

  return `
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <a href="#/dashboard" class="sidebar__logo-link" aria-label="TrackUp — Go to Dashboard">TrackUp</a>
      </div>

      <nav class="sidebar__nav" role="navigation" aria-label="Main navigation">
        ${NAV_ITEMS.map(item => {
          const isActive = currentPath === item.path;
          const badge = item.path === '/notifications' && unread > 0
            ? `<span class="sidebar__badge" aria-label="${unread} unread">${unread}</span>`
            : '';
          return `
            <a
              href="#${item.path}"
              class="sidebar__link${isActive ? ' sidebar__link--active' : ''}"
              data-path="${item.path}"
              aria-current="${isActive ? 'page' : 'false'}"
            >
              <span class="sidebar__link-icon" aria-hidden="true">${ICONS[item.icon] || ''}</span>
              <span class="sidebar__link-label">${t(item.labelKey)}</span>
              ${badge}
            </a>
          `;
        }).join('')}
      </nav>

      <div class="sidebar__footer">
        <div class="sidebar__user" id="sidebar-user">
          <div class="sidebar__avatar">${user.name?.charAt(0).toUpperCase() || 'U'}</div>
          <div class="sidebar__user-info">
            <span class="sidebar__user-name">${user.name || 'User'}</span>
            <span class="sidebar__user-plan">${user.plan || 'free'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function SidebarEvents() {
  // Active link on hashchange
  const _setActive = () => {
    const currentPath = window.location.hash.slice(1).split('?')[0] || '/';
    document.querySelectorAll('.sidebar__link').forEach(link => {
      const active = link.dataset.path === currentPath;
      link.classList.toggle('sidebar__link--active', active);
      link.setAttribute('aria-current', active ? 'page' : 'false');
    });
    // Update topbar page title
    const item = NAV_ITEMS.find(n => n.path === currentPath);
    const titleEl = document.getElementById('topbar-page-title');
    if (titleEl && item) titleEl.textContent = t(item.labelKey);
  };
  window.addEventListener('hashchange', _setActive);

  // Close sidebar on mobile after nav
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) _closeSidebar();
    });
  });
}

export function _closeSidebar() {
  document.getElementById('app-sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
  document.getElementById('topbar-menu-btn')?.setAttribute('aria-expanded', 'false');
}

export function _openSidebar() {
  document.getElementById('app-sidebar')?.classList.add('open');
  document.getElementById('sidebar-overlay')?.classList.add('active');
  document.getElementById('topbar-menu-btn')?.setAttribute('aria-expanded', 'true');
}
