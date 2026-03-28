import { getState, setState } from '../state.js';
import StorageService from './storage.service.js';
import { MOCK_USERS } from '../data/mock/users.js';

export function login(email, password) {
  const match = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!match) throw new Error('Invalid email or password.');
  const { password: _, ...safe } = match;
  setState('user', safe);
  StorageService.set('session', safe);
  return safe;
}

export function register(name, email, password) {
  if (MOCK_USERS.find(u => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = {
    id:           crypto.randomUUID(),
    name,
    email,
    password,
    role:         'user',
    trackId:      null,
    subscription: 'free',
    xp:           0,
    streak:       0,
  };
  MOCK_USERS.push(newUser);
  const { password: _, ...safe } = newUser;
  setState('user', safe);
  StorageService.set('session', safe);
  return safe;
}

export function logout() {
  setState('user', null);
  StorageService.remove('session');
}

export function restoreSession() {
  const saved = StorageService.get('session');
  if (saved) setState('user', saved);
  return saved;
}

export function getUser() {
  return getState('user');
}
