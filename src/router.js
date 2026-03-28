// Hash-based SPA router
// Supports: register, navigate, guard, after-render hooks

const _routes = {};
let _guard = null;

export const Router = {
  register(path, { render, after }) {
    _routes[path] = { render, after };
  },

  setGuard(fn) {
    _guard = fn;
  },

  navigate(path) {
    window.location.hash = path;
  },

  _resolve() {
    const raw = window.location.hash.slice(1) || '/';
    const [path, queryStr] = raw.split('?');

    // Parse query string
    const query = {};
    if (queryStr) {
      queryStr.split('&').forEach(p => {
        const [k, v] = p.split('=');
        if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }

    // Auth guard
    if (_guard) {
      const redirect = _guard(path);
      if (redirect && redirect !== path) {
        Router.navigate(redirect);
        return;
      }
    }

    const route = _routes[path];
    if (!route) {
      // Fallback: redirect to /
      Router.navigate('/');
      return;
    }

    const outlet = document.getElementById('app-outlet');
    if (!outlet) return;

    // Render
    outlet.innerHTML = route.render(query);

    // After-render hook (events)
    if (route.after) {
      // Small tick to let DOM settle
      requestAnimationFrame(() => route.after(query));
    }

    // Scroll to top
    outlet.scrollTop = 0;
    window.scrollTo(0, 0);
  },

  init() {
    window.addEventListener('hashchange', () => Router._resolve());
    Router._resolve();
  },
};
