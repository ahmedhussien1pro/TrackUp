// Minimal reactive state store
// Usage: State.setState('user', { name: 'Ahmed' })
//        State.getState('user')
//        State.subscribe('user', (val) => { ... })

const _store = {};
const _listeners = {};

const State = {
  setState(key, value) {
    _store[key] = value;
    (_listeners[key] || []).forEach(fn => fn(value));
  },

  getState(key) {
    return _store[key] ?? null;
  },

  subscribe(key, fn) {
    if (!_listeners[key]) _listeners[key] = [];
    _listeners[key].push(fn);
    // Return unsubscribe
    return () => {
      _listeners[key] = _listeners[key].filter(f => f !== fn);
    };
  },
};

export default State;
