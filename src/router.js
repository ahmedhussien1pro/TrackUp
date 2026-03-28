/**
 * TRACKUP SPA ROUTER
 * Hash-based routing with auth guard and fade transition.
 */

import { setState } from './state.js';

const _routes = {};
let _guard = null;
let _outlet = null;
let _fallbackRedirect = '/login';

export function register(path, screenFn, meta = {}) {
  _routes[path] = { screenFn, meta };
}

export function setGuard(fn) {
  _guard = fn;
}

export function setOutlet(el) {
  _outlet = el;
}

export function navigate(path) {
  window.location.hash = path;
}

async function _resolve(path) {
  const route = _routes[path];

  if (!route) {
    navigate('/');
    return;
  }

  if (_guard && !_guard(path, route.meta)) {
    navigate(_fallbackRedirect);
    return;
  }

  setState('route', path);

  if (!_outlet) return;

  _outlet.style.opacity = '0';
  _outlet.style.transform = 'translateY(8px)';

  await new Promise(r => setTimeout(r, 130));

  _outlet.innerHTML = '';
  const screen = await route.screenFn({});
  if (screen) _outlet.appendChild(screen);

  requestAnimationFrame(() => {
    _outlet.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
    _outlet.style.opacity = '1';
    _outlet.style.transform = 'translateY(0)';
  });
}

export function start(fallback = '/') {
  _fallbackRedirect = '/login';
  const initial = window.location.hash.slice(1) || fallback;

  window.addEventListener('hashchange', () => {
    const path = window.location.hash.slice(1) || fallback;
    _resolve(path);
  });

  _resolve(initial);
}

export default { register, setGuard, setOutlet, navigate, start };
