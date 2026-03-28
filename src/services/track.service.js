import State from '../state.js';
import { StorageService } from './storage.service.js';
import { MOCK_TRACKS } from '../data/mock/tracks.js';

const _tracks = [...MOCK_TRACKS];

export const TrackService = {
  getAllTracks() {
    return _tracks;
  },

  getTrackById(id) {
    return _tracks.find(t => t.id === id) || null;
  },

  setActiveTrack(id) {
    const track = this.getTrackById(id);
    State.setState('activeTrack', track);
    StorageService.set('activeTrackId', id);
    return track;
  },

  restoreActiveTrack() {
    const id = StorageService.get('activeTrackId');
    if (id) this.setActiveTrack(id);
  },

  enrollInTrack(trackId) {
    const user = State.getState('user');
    if (!user) return { success: false, message: 'Not authenticated.' };
    const track = this.getTrackById(trackId);
    if (!track) return { success: false, message: 'Track not found.' };
    const updated = { ...user, activeTrackId: trackId };
    State.setState('user', updated);
    StorageService.set('session', updated);
    this.setActiveTrack(trackId);
    return { success: true, track };
  },

  getTracksByCategory(category) {
    return _tracks.filter(t => t.category === category);
  },
};
