import { t, getLang, setLang } from '../../i18n.js';
import State from '../../state.js';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '../../router.js';
import { StorageService } from '../../services/storage.service.js';
import { _closeSidebar, _openSidebar } from './Sidebar.js';

const PAGE_TITLES = {
  '/dashboard':     'nav.dashboard',
  '/career':        'nav.career',
  '/roadmap':       'nav.roadmap',
  '/courses':       'nav.courses',
  '/mentorship':    'nav.mentorship',
  '/progress':      'nav.progress',
  '/notifications': 'nav.notifications',
  '/settings':      'nav.settings',
};

function _currentTitle() {
  const path = window.location.hash.slice(1).split('?')[0] || '/';
  const key = PAGE_TITLES[path];
  return key ? t(key) : '';
}

function _unreadCount() {
  const notifs = State.getState('notifications') || [];
  return notifs.filter(n => !n.read).length;
}

export function Topbar() {
  const user   = State.getState('user');
  const lang   = getLang();
  const unread = _unreadCount();
  const title  = _currentTitle();

  return `
    <div class="topbar__start">
      <button
        class="topbar__menu-btn btn btn--ghost btn--sm"
        id="topbar-menu-btn"
        aria-label="${t('nav.toggleSidebar')}"
        aria-expanded="false"
        aria-controls="app-sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      ${title ? `<span id="topbar-page-title" class="topbar__page-title">${title}</span>` : '<span id="topbar-page-title" class="topbar__page-title"></span>'}
    </div>

    <div class="topbar__end">
      <a
        href="#/notifications"
        class="topbar__icon-btn"
        id="topbar-notif-btn"
        aria-label="${t('nav.notifications')}${unread > 0 ? ` (${unread} unread)` : ''}"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        ${unread > 0 ? `<span class="topbar__badge" aria-hidden="true">${unread}</span>` : ''}
      </a>

      <button
        class="btn btn--ghost btn--sm topbar__lang-btn"
        id="topbar-lang-btn"
        aria-label="Switch to ${lang === 'ar' ? 'English' : 'Arabic'}"
        title="${lang === 'ar' ? 'Switch to English' : 'Switch to Arabic'}"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>${lang === 'ar' ? 'EN' : 'AR'}</span>
      </button>

      <button
        class="btn btn--ghost btn--sm"
        id="topbar-theme-btn"
        aria-label="${t('settings.theme')}"
        title="Toggle Theme"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="topbar-theme-icon">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>

      <div class="topbar__user" id="topbar-user-menu">
        <button
          class="topbar__avatar"
          id="topbar-avatar-btn"
          aria-label="${user?.name || 'User'} — Account menu"
          aria-haspopup="true"
          aria-expanded="false"
        >
          ${user?.name?.charAt(0).toUpperCase() || 'U'}
        </button>
      </div>
    </div>
  `;
}

export function TopbarEvents() {
  // ---- Theme toggle ----
  document.getElementById('topbar-theme-btn')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    StorageService.set('theme', next);
  });

  // ---- Language toggle ----
  document.getElementById('topbar-lang-btn')?.addEventListener('click', () => {
    const next = getLang() === 'ar' ? 'en' : 'ar';
    setLang(next);
    StorageService.set('lang', next);
    mountLayout();
    Router._resolve();
  });

  // ---- Hamburger: Desktop collapse + Mobile open ----
  document.getElementById('topbar-menu-btn')?.addEventListener('click', () => {
    const sidebar  = document.getElementById('app-sidebar');
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const isOpen = sidebar.classList.contains('open');
      isOpen ? _closeSidebar() : _openSidebar();
    } else {
      // Desktop: toggle collapsed
      const isCollapsed = sidebar.classList.contains('collapsed');
      sidebar.classList.toggle('collapsed');
      document.getElementById('topbar-menu-btn')
        ?.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
      StorageService.set('sidebarCollapsed', !isCollapsed);
    }
  });

  // ---- Restore desktop collapse state ----
  const wasCollapsed = StorageService.get('sidebarCollapsed');
  if (wasCollapsed && window.innerWidth >= 768) {
    document.getElementById('app-sidebar')?.classList.add('collapsed');
  }

  // ---- Overlay click closes mobile sidebar ----
  document.getElementById('sidebar-overlay')?.addEventListener('click', _closeSidebar);

  // ---- Avatar dropdown ----
  const avatarBtn = document.getElementById('topbar-avatar-btn');
  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const existing = document.getElementById('topbar-dropdown');
    if (existing) {
      existing.remove();
      avatarBtn.setAttribute('aria-expanded', 'false');
      return;
    }
    _buildDropdown(avatarBtn);
  });

  // ---- Escape closes dropdown ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const dd = document.getElementById('topbar-dropdown');
      if (dd) {
        dd.remove();
        document.getElementById('topbar-avatar-btn')?.setAttribute('aria-expanded', 'false');
        document.getElementById('topbar-avatar-btn')?.focus();
      }
    }
  });
}

function _buildDropdown(btn) {
  const user = State.getState('user');
  const dropdown = document.createElement('div');
  dropdown.id = 'topbar-dropdown';
  dropdown.className = 'topbar__dropdown';
  dropdown.setAttribute('role', 'menu');
  dropdown.innerHTML = `
    <div class="topbar__dropdown-user">
      <strong>${user?.name || 'User'}</strong>
      <span>${user?.email || ''}</span>
      <span class="badge" style="margin-top:4px;width:fit-content">${user?.plan || 'free'}</span>
    </div>
    <hr class="topbar__dropdown-divider">
    <a href="#/settings" class="topbar__dropdown-item" role="menuitem">${t('nav.settings')}</a>
    <a href="#/notifications" class="topbar__dropdown-item" role="menuitem">${t('nav.notifications')}</a>
    <hr class="topbar__dropdown-divider">
    <button class="topbar__dropdown-item topbar__dropdown-item--danger" id="topbar-logout" role="menuitem">
      ${t('auth.logout')}
    </button>
  `;
  document.getElementById('topbar-user-menu')?.appendChild(dropdown);
  btn.setAttribute('aria-expanded', 'true');

  document.getElementById('topbar-logout')?.addEventListener('click', () => {
    AuthService.logout();
    Router.navigate('/login');
    unmountLayout();
  });

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function _close() {
      dropdown?.remove();
      btn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', _close);
    });
  }, 0);
}

export function mountLayout() {
  const sidebar = document.getElementById('app-sidebar');
  const topbar  = document.getElementById('app-topbar');
  const appBody = document.getElementById('app-body');
  if (!sidebar || !topbar) return;

  const { Sidebar, SidebarEvents } = window.__trackup_layout_sidebar__ || {};

  sidebar.innerHTML = Sidebar?.() || '';
  topbar.innerHTML  = Topbar();

  sidebar.removeAttribute('aria-hidden');
  topbar.removeAttribute('aria-hidden');
  appBody?.classList.remove('no-sidebar');

  SidebarEvents?.();
  TopbarEvents();
}

export function unmountLayout() {
  const sidebar = document.getElementById('app-sidebar');
  const topbar  = document.getElementById('app-topbar');
  const appBody = document.getElementById('app-body');
  if (sidebar) { sidebar.innerHTML = ''; sidebar.setAttribute('aria-hidden', 'true'); }
  if (topbar)  { topbar.innerHTML  = ''; topbar.setAttribute('aria-hidden',  'true'); }
  appBody?.classList.add('no-sidebar');
}
