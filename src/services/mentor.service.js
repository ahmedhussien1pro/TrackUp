import { getState, setState } from '../state.js';
import { MENTORS } from '../data/mock/mentors.js';

export function getMentors() {
  return MENTORS;
}

export function getMentorsForTrack(trackId) {
  return MENTORS.filter(m => m.tracks.includes(trackId) || m.tracks.includes('all'));
}

export function getMentorById(id) {
  return MENTORS.find(m => m.id === id) || null;
}

export function bookSession(mentorId, slot) {
  const bookings = [...(getState('bookings') || [])];
  const booking = {
    id:        crypto.randomUUID(),
    mentorId,
    slot,
    status:    'pending',
    bookedAt:  Date.now(),
  };
  bookings.push(booking);
  setState('bookings', bookings);
  return booking;
}

export function cancelBooking(bookingId) {
  const bookings = (getState('bookings') || []).filter(b => b.id !== bookingId);
  setState('bookings', bookings);
}
