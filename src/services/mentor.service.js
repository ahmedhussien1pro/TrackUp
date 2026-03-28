import State from '../state.js';
import { StorageService } from './storage.service.js';
import { mentors } from '../data/mock/mentors.js';

export const MentorService = {
  getAllMentors() {
    return mentors;
  },

  getMentorsForTrack(trackId) {
    return trackId ? mentors.filter(m => m.trackId === trackId) : mentors;
  },

  getMentorById(id) {
    return mentors.find(m => m.id === id) || null;
  },

  getBookings() {
    const state = State.getState('bookings');
    if (state) return state;
    const saved = StorageService.get('bookings') || [];
    State.setState('bookings', saved);
    return saved;
  },

  isBooked(mentorId) {
    return this.getBookings().some(b => b.mentorId === mentorId);
  },

  bookSession(mentorId) {
    if (this.isBooked(mentorId)) return { success: false, message: 'Already booked' };
    const mentor  = this.getMentorById(mentorId);
    const current = this.getBookings();
    const entry   = { mentorId, mentorName: mentor?.name || '', bookedAt: Date.now(), status: 'confirmed' };
    const updated  = [...current, entry];
    State.setState('bookings', updated);
    StorageService.set('bookings', updated);
    return { success: true, message: `Session with ${mentor?.name || 'mentor'} booked!` };
  },
};
