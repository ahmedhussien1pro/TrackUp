// StorageAPI: localStorage → sessionStorage → in-memory fallback
window.memoryStore = {};
window.StorageAPI = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (_) {}
    try {
      const raw = sessionStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (_) {}
    return key in memoryStore ? memoryStore[key] : fallback;
  },
  set(key, value) {
    const serialized = JSON.stringify(value);
    let stored = false;
    try { localStorage.setItem(key, serialized); stored = true; } catch (_) {}
    if (!stored) {
      try { sessionStorage.setItem(key, serialized); stored = true; } catch (_) {}
    }
    if (!stored) memoryStore[key] = value;
  }
};
