import State from './state.js';

const _routes = {};
let _guard = null;
let _outlet = null;

export const Router = {
  register(path, { render, after } = {}) {
    _routes[path] = { render, after };
  },

  setGuard(fn) {
    _guard = fn;
  },

  navigate(path) {
    window.location.hash = '#' + path;
  },

  init() {
    window.addEventListener('hashchange', () => this._resolve());
    this._resolve();
  },

  _getPath() {
    const hash = window.location.hash.slice(1) || '/';
    const [path] = hash.split('?');
    return path;
  },

  async _resolve() {
    const path = this._getPath();

    if (_guard) {
      const redirect = _guard(path);
      if (redirect) {
        this.navigate(redirect);
        return;
      }
    }

    const route = _routes[path];
    if (!route) {
      this.navigate('/');
      return;
    }

    State.setState('route', path);

    _outlet = _outlet || document.getElementById('app-outlet');
    if (!_outlet) return;

    _outlet.style.opacity = '0';
    _outlet.style.transform = 'translateY(10px)';
    _outlet.style.transition = 'none';

    await new Promise(r => setTimeout(r, 120));

    _outlet.innerHTML = typeof route.render === 'function' ? route.render() : '';

    requestAnimationFrame(() => {
      _outlet.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      _outlet.style.opacity = '1';
      _outlet.style.transform = 'translateY(0)';
    });

    if (typeof route.after === 'function') {
      await new Promise(r => setTimeout(r, 50));
      route.after();
    }
  },
};

export default Router;
