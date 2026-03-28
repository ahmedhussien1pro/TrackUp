import State from '../state.js';
import { StorageService } from './storage.service.js';
import { tracks } from '../data/mock/tracks.js';

export const TrackService = {
  getAllTracks() {
    return tracks;
  },

  getTrackById(id) {
    return tracks.find(t => t.id === id) || null;
  },

  enrollInTrack(trackId) {
    const track = this.getTrackById(trackId);
    if (!track) return { success: false, message: 'Track not found.' };

    const user = State.getState('user');
    if (!user) return { success: false, message: 'Not authenticated.' };

    const updated = { ...user, activeTrackId: trackId };
    State.setState('user', updated);
    StorageService.set('session', updated);

    return { success: true, track };
  },

  getActiveTrack() {
    const user = State.getState('user');
    if (!user?.activeTrackId) return null;
    return this.getTrackById(user.activeTrackId);
  },
};
