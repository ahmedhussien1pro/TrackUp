const NS = 'trackup__';

export const StorageService = {
  get(key) {
    try {
      const v = localStorage.getItem(NS + key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },

  set(key, value) {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); } catch {}
  },

  remove(key) {
    try { localStorage.removeItem(NS + key); } catch {}
  },

  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(NS))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
  },

  keys() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(NS))
      .map(k => k.replace(NS, ''));
  },
};

export default StorageService;
