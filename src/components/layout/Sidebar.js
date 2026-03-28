import { t } from '../../i18n.js';
import { Router } from '../../router.js';
import State from '../../state.js';

const NAV_ITEMS = [
  { path: '/dashboard',     labelKey: 'nav.dashboard' },
  { path: '/career',        labelKey: 'nav.career' },
  { path: '/roadmap',       labelKey: 'nav.roadmap' },
  { path: '/courses',       labelKey: 'nav.courses' },
  { path: '/mentorship',    labelKey: 'nav.mentorship' },
  { path: '/progress',      labelKey: 'nav.progress' },
  { path: '/notifications', labelKey: 'nav.notifications' },
  { path: '/settings',      labelKey: 'nav.settings' },
];

export function Sidebar() {
  const currentPath = window.location.hash.slice(1).split('?')[0] || '/';
  return `
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <span class="sidebar__logo-text">TrackUp</span>
      </div>
      <nav class="sidebar__nav" role="navigation">
        ${NAV_ITEMS.map(item => `
          <a
            href="#${item.path}"
            class="sidebar__link ${currentPath === item.path ? 'sidebar__link--active' : ''}"
            data-path="${item.path}"
          >
            <span class="sidebar__link-label">${t(item.labelKey)}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__user" id="sidebar-user"></div>
      </div>
    </div>
  `;
}

export function SidebarEvents() {
  const user = State.getState('user');
  const el = document.getElementById('sidebar-user');
  if (el && user) {
    el.innerHTML = `
      <div class="sidebar__avatar">${user.name?.charAt(0).toUpperCase() || 'U'}</div>
      <div class="sidebar__user-info">
        <span class="sidebar__user-name">${user.name}</span>
        <span class="sidebar__user-plan">${user.plan || 'free'}</span>
      </div>
    `;
  }

  // Active link highlight on navigation
  State.subscribe('route', (path) => {
    document.querySelectorAll('.sidebar__link').forEach(link => {
      link.classList.toggle('sidebar__link--active', link.dataset.path === path);
    });
  });
}
