import State from '../state.js';
import { StorageService } from './storage.service.js';
import { MOCK_USERS } from '../data/mock/users.js';

const _users = [...MOCK_USERS];

export const AuthService = {
  login(email, password) {
    const match = _users.find(u => u.email === email && u.password === password);
    if (!match) return { success: false, message: 'Invalid email or password.' };
    const { password: _, ...safe } = match;
    State.setState('user', safe);
    StorageService.set('session', safe);
    return { success: true, user: safe };
  },

  register({ name, email, password }) {
    if (_users.find(u => u.email === email))
      return { success: false, message: 'An account with this email already exists.' };
    const newUser = {
      id: 'u' + Date.now(),
      name,
      email,
      password,
      careerField: null,
      activeTrackId: null,
      plan: 'free',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    _users.push(newUser);
    const { password: _, ...safe } = newUser;
    State.setState('user', safe);
    StorageService.set('session', safe);
    return { success: true, user: safe };
  },

  logout() {
    State.setState('user', null);
    StorageService.remove('session');
  },

  restoreSession() {
    const saved = StorageService.get('session');
    if (saved) State.setState('user', saved);
    return saved || null;
  },

  getUser() {
    return State.getState('user');
  },
};
