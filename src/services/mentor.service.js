import State from '../state.js';
import { MOCK_MENTORS } from '../data/mock/mentors.js';

const _mentors = [...MOCK_MENTORS];

export const MentorService = {
  getAllMentors() {
    return _mentors;
  },

  getMentorsForTrack(trackId) {
    return _mentors.filter(m => m.tracks.includes(trackId));
  },

  getMentorById(id) {
    return _mentors.find(m => m.id === id) || null;
  },

  bookSession(mentorId, slot = null) {
    const mentor = this.getMentorById(mentorId);
    if (!mentor) return { success: false, message: 'Mentor not found.' };
    const bookings = [...(State.getState('bookings') || [])];
    const booking = {
      id: 'b' + Date.now(),
      mentorId,
      mentorName: mentor.name,
      slot: slot || mentor.availability[0],
      status: 'pending',
      bookedAt: Date.now(),
    };
    bookings.push(booking);
    State.setState('bookings', bookings);
    return { success: true, message: 'Session booked successfully.', booking };
  },

  cancelBooking(bookingId) {
    const bookings = (State.getState('bookings') || []).filter(b => b.id !== bookingId);
    State.setState('bookings', bookings);
    return { success: true, message: 'Booking cancelled.' };
  },

  getBookings() {
    return State.getState('bookings') || [];
  },
};
