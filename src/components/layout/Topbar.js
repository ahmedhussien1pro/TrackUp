import { t, getLang, setLang } from '../../i18n.js';
import State from '../../state.js';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '../../router.js';
import { StorageService } from '../../services/storage.service.js';

export function Topbar() {
  const user = State.getState('user');
  return `
    <div class="topbar__start">
      <button class="topbar__menu-btn btn btn--ghost btn--sm" id="topbar-menu-btn" aria-label="Toggle menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="topbar__end">
      <button class="btn btn--ghost btn--sm" id="topbar-lang-btn" title="Toggle Language">
        ${getLang() === 'ar' ? 'EN' : 'AR'}
      </button>
      <button class="btn btn--ghost btn--sm" id="topbar-theme-btn" title="Toggle Theme">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>
      <div class="topbar__user" id="topbar-user-menu">
        <button class="topbar__avatar" id="topbar-avatar-btn">
          ${user?.name?.charAt(0).toUpperCase() || 'U'}
        </button>
      </div>
    </div>
  `;
}

export function TopbarEvents() {
  // Theme toggle
  document.getElementById('topbar-theme-btn')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    StorageService.set('theme', next);
  });

  // Language toggle
  document.getElementById('topbar-lang-btn')?.addEventListener('click', () => {
    const next = getLang() === 'ar' ? 'en' : 'ar';
    setLang(next);
    StorageService.set('lang', next);
    // Re-render current route
    const path = window.location.hash.slice(1).split('?')[0] || '/';
    Router._resolve();
    // Re-render layout
    mountLayout();
  });

  // Mobile sidebar toggle
  document.getElementById('topbar-menu-btn')?.addEventListener('click', () => {
    document.getElementById('app-sidebar')?.classList.toggle('open');
  });

  // Avatar: dropdown logout
  document.getElementById('topbar-avatar-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    let dropdown = document.getElementById('topbar-dropdown');
    if (dropdown) { dropdown.remove(); return; }
    const user = State.getState('user');
    dropdown = document.createElement('div');
    dropdown.id = 'topbar-dropdown';
    dropdown.className = 'topbar__dropdown';
    dropdown.innerHTML = `
      <div class="topbar__dropdown-user">
        <strong>${user?.name || 'User'}</strong>
        <span>${user?.email || ''}</span>
      </div>
      <hr class="topbar__dropdown-divider">
      <button class="topbar__dropdown-item" id="topbar-logout">Sign out</button>
    `;
    document.getElementById('topbar-user-menu')?.appendChild(dropdown);

    document.getElementById('topbar-logout')?.addEventListener('click', () => {
      AuthService.logout();
      Router.navigate('/login');
      unmountLayout();
    });

    setTimeout(() => {
      document.addEventListener('click', () => dropdown?.remove(), { once: true });
    }, 0);
  });
}

export function mountLayout() {
  const sidebar  = document.getElementById('app-sidebar');
  const topbar   = document.getElementById('app-topbar');
  const appBody  = document.getElementById('app-body');

  if (!sidebar || !topbar) return;

  const { Sidebar, SidebarEvents } = window.__trackup_layout_sidebar__ || {};
  sidebar.innerHTML  = Sidebar?.() || '';
  topbar.innerHTML   = Topbar();

  sidebar.removeAttribute('aria-hidden');
  topbar.removeAttribute('aria-hidden');
  appBody?.classList.remove('no-sidebar');

  SidebarEvents?.();
  TopbarEvents();
}

export function unmountLayout() {
  const sidebar = document.getElementById('app-sidebar');
  const topbar  = document.getElementById('app-topbar');
  if (sidebar) { sidebar.innerHTML = ''; sidebar.setAttribute('aria-hidden', 'true'); }
  if (topbar)  { topbar.innerHTML  = ''; topbar.setAttribute('aria-hidden',  'true'); }
}
