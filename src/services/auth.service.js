import State from '../state.js';
import { StorageService } from './storage.service.js';

// Demo account — always works
const DEMO_USER = {
  id: 'demo',
  name: 'Ahmed Hussien',
  email: 'demo@trackup.io',
  password: 'demo1234',
  plan: 'pro',
  activeTrackId: null,
};

function _getUsers() {
  return StorageService.get('users') || [DEMO_USER];
}

function _saveUsers(users) {
  // Don't persist demo user password in storage
  StorageService.set('users', users.filter(u => u.id !== 'demo'));
}

export const AuthService = {
  register({ name, email, password }) {
    const users = _getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const user = {
      id: 'u_' + Date.now(),
      name,
      email,
      password,
      plan: 'free',
      activeTrackId: null,
    };
    _saveUsers([...users, user]);
    const safeUser = { ...user };
    delete safeUser.password;
    State.setState('user', safeUser);
    StorageService.set('session', safeUser);
    return { success: true, user: safeUser };
  },

  login(email, password) {
    const users = _getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Incorrect email or password.' };
    }
    const safeUser = { ...found };
    delete safeUser.password;
    State.setState('user', safeUser);
    StorageService.set('session', safeUser);
    return { success: true, user: safeUser };
  },

  logout() {
    State.setState('user', null);
    State.setState('enrollments', []);
    State.setState('bookings', []);
    StorageService.remove('session');
  },

  restoreSession() {
    const session = StorageService.get('session');
    if (session) {
      State.setState('user', session);
    }
    // Restore enrollments + bookings
    const enrollments = StorageService.get('enrollments') || [];
    const bookings    = StorageService.get('bookings')    || [];
    const roadmapData = StorageService.get('roadmapData') || {};
    State.setState('enrollments', enrollments);
    State.setState('bookings', bookings);
    State.setState('roadmapData', roadmapData);
  },

  getCurrentUser() {
    return State.getState('user');
  },
};
