import { t } from '../../i18n.js';
import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

const ICONS = {
  dashboard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  roadmap:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 7 3 12 8 17"/><line x1="21" y1="6" x2="21" y2="18"/></svg>`,
  results:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  settings:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
};

// Core nav — only 3 primary items.
// Results appears only when testResult exists.
function _buildNavItems() {
  const hasResult = !!(State.getState('testResult') || StorageService.get('testResult'));
  const items = [
    { path: '/dashboard', labelKey: 'nav.dashboard', icon: 'dashboard' },
    { path: '/roadmap',   labelKey: 'nav.roadmap',   icon: 'roadmap'   },
  ];
  if (hasResult) {
    items.push({ path: '/results', labelKey: 'nav.results', icon: 'results' });
  }
  // Settings always last, always present
  items.push({ path: '/settings', labelKey: 'nav.settings', icon: 'settings' });
  return items;
}

export function Sidebar() {
  const currentPath = window.location.hash.slice(1).split('?')[0] || '/';
  const user        = State.getState('user') || {};
  const navItems    = _buildNavItems();

  return `
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <a href="#/dashboard" class="sidebar__logo-link" aria-label="TrackUp">‪TrackUp‬</a>
      </div>

      <nav class="sidebar__nav" role="navigation" aria-label="Main navigation">
        ${navItems.map(item => {
          const isActive = currentPath === item.path;
          return `
            <a
              href="#${item.path}"
              class="sidebar__link${isActive ? ' sidebar__link--active' : ''}"
              data-path="${item.path}"
              aria-current="${isActive ? 'page' : 'false'}"
            >
              <span class="sidebar__link-icon" aria-hidden="true">${ICONS[item.icon] || ''}</span>
              <span class="sidebar__link-label">${t(item.labelKey)}</span>
            </a>`;
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
    </div>`;
}

export function SidebarEvents() {
  const _setActive = () => {
    const currentPath = window.location.hash.slice(1).split('?')[0] || '/';
    document.querySelectorAll('.sidebar__link').forEach(link => {
      const active = link.dataset.path === currentPath;
      link.classList.toggle('sidebar__link--active', active);
      link.setAttribute('aria-current', active ? 'page' : 'false');
    });
    const navItems = _buildNavItems();
    const item     = navItems.find(n => n.path === currentPath);
    const titleEl  = document.getElementById('topbar-page-title');
    if (titleEl && item) titleEl.textContent = t(item.labelKey);
  };
  window.addEventListener('hashchange', _setActive);

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
