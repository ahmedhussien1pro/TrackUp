import State from '../state.js';
import { StorageService } from './storage.service.js';
import { tracks } from '../data/mock/tracks.js';

// Auto-create a guest session so the GPS flow works without registration
function _ensureUser() {
  let user = State.getState('user');
  if (user) return user;
  const lang  = document.documentElement.getAttribute('lang') || 'en';
  const isAr  = lang === 'ar';
  user = {
    id:            'guest-' + Date.now(),
    name:          isAr ? 'زائر' : 'Guest',
    email:         '',
    activeTrackId: null,
    isGuest:       true,
    createdAt:     Date.now(),
  };
  State.setState('user', user);
  StorageService.set('user', user);
  return user;
}

export const TrackService = {
  getAllTracks()    { return tracks; },
  getTrackById(id) { return tracks.find(t => t.id === id) || null; },

  enrollInTrack(trackId) {
    const user    = _ensureUser();
    const updated = { ...user, activeTrackId: trackId };
    State.setState('user', updated);
    StorageService.set('user', updated);
  },
};
