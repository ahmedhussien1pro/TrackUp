import State from '../state.js';
import { StorageService } from './storage.service.js';
import { tracks } from '../data/mock/tracks.js';

export const TrackService = {
  getAllTracks() { return tracks; },

  getTrackById(id) { return tracks.find(t => t.id === id) || null; },

  enrollInTrack(trackId) {
    const user = State.getState('user');
    if (!user) return;
    const updated = { ...user, activeTrackId: trackId };
    State.setState('user', updated);
    StorageService.set('user', updated);
  },
};
