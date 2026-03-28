/**
 * TRACKUP GLOBAL STATE STORE
 * Pub/sub pattern — no framework dependency.
 * All mutations MUST go through setState().
 */

const _state = {
  user: null,
  theme: 'light',
  lang: 'en',
  route: null,
  sidebarOpen: true,

  // Career domain
  tracks: [],
  activeTrack: null,
  roadmapSteps: [],
  courses: [],
  enrollments: {},
  mentors: [],
  bookings: [],
  testSession: null,
  testResult: null,

  // App
  loading: false,
  error: null,
  notifications: [],
};

const _subs = {};

export function subscribe(key, cb) {
  if (!_subs[key]) _subs[key] = [];
  _subs[key].push(cb);
  return () => { _subs[key] = _subs[key].filter(f => f !== cb); };
}

export function getState(key) {
  return _state[key];
}

export function setState(key, value) {
  const prev = _state[key];
  _state[key] = value;
  (_subs[key] || []).forEach(cb => cb(value, prev));
}

export function patchState(updates) {
  Object.entries(updates).forEach(([k, v]) => setState(k, v));
}

export function getSnapshot() {
  return { ..._state };
}

export default { getState, setState, patchState, subscribe, getSnapshot };
