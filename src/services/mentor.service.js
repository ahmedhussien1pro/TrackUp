import State from '../state.js';
import { StorageService } from './storage.service.js';
import { mentors } from '../data/mock/mentors.js';

export const MentorService = {
  getAllMentors() { return mentors; },

  getMentorsByTrack(trackId) {
    return trackId ? mentors.filter(m => m.trackId === trackId) : mentors;
  },

  getMentorById(id) { return mentors.find(m => m.id === id) || null; },

  bookSession(mentorId, slot) {
    const bookings = StorageService.get('bookings') || [];
    const booking = { id: `b${Date.now()}`, mentorId, slot, bookedAt: Date.now() };
    bookings.push(booking);
    StorageService.set('bookings', bookings);
    State.setState('bookings', bookings);
    return booking;
  },

  getBookings() {
    return State.getState('bookings') || StorageService.get('bookings') || [];
  },
};
