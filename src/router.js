const _routes = {};
let _guard = null;
let _rendering = false;

export const Router = {
  register(path, { render, after } = {}) {
    _routes[path] = { render, after };
  },

  setGuard(fn) {
    _guard = fn;
  },

  navigate(path) {
    window.location.hash = path;
  },

  _resolve() {
    if (_rendering) return;
    _rendering = true;

    const raw  = window.location.hash.slice(1) || '/';
    const [path, queryStr] = raw.split('?');

    const query = {};
    if (queryStr) {
      queryStr.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }

    // Run guard — but never during the redirect itself
    if (_guard) {
      const redirect = _guard(path);
      if (redirect && redirect !== path) {
        _rendering = false;
        Router.navigate(redirect);
        return;
      }
    }

    const route = _routes[path];
    if (!route) {
      _rendering = false;
      Router.navigate('/');
      return;
    }

    const outlet = document.getElementById('app-outlet');
    if (!outlet) { _rendering = false; return; }

    try {
      outlet.innerHTML = route.render(query);
    } catch (err) {
      console.error('[Router] render error on', path, err);
      outlet.innerHTML = `<div class="empty-state">Something went wrong loading this page.</div>`;
    }

    _rendering = false;

    if (route.after) {
      requestAnimationFrame(() => {
        try { route.after(query); } catch (err) { console.error('[Router] after error on', path, err); }
      });
    }

    window.scrollTo(0, 0);
  },

  init() {
    window.addEventListener('hashchange', () => Router._resolve());
    Router._resolve();
  },
};
