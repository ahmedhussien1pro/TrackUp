import { getState, setState } from '../state.js';
import { CAREER_TRACKS } from '../data/mock/tracks.js';

export function getTracks() {
  return CAREER_TRACKS;
}

export function getTrackById(id) {
  return CAREER_TRACKS.find(t => t.id === id) || null;
}

export function setActiveTrack(id) {
  setState('activeTrack', getTrackById(id));
}

export function getEnrolledTrack() {
  const user = getState('user');
  return user?.trackId ? getTrackById(user.trackId) : null;
}

export function enrollInTrack(trackId) {
  const user = getState('user');
  if (!user) return false;
  const updated = { ...user, trackId };
  setState('user', updated);
  return true;
}
