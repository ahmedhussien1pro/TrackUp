import State from '../state.js';
import { StorageService } from './storage.service.js';
import { mentors } from '../data/mock/mentors.js';

export const MentorService = {
  getAllMentors() {
    return mentors;
  },

  getMentorById(id) {
    return mentors.find(m => m.id === id) || null;
  },

  getMentorsForTrack(trackId) {
    return mentors.filter(m => m.trackIds?.includes(trackId));
  },

  bookSession(mentorId) {
    const mentor = this.getMentorById(mentorId);
    if (!mentor) return { success: false, message: 'Mentor not found.' };

    const booking = {
      id: 'b_' + Date.now(),
      mentorId,
      mentorName: mentor.name,
      bookedAt: Date.now(),
      status: 'confirmed',
    };
    const bookings = [...(State.getState('bookings') || []), booking];
    State.setState('bookings', bookings);
    StorageService.set('bookings', bookings);

    return { success: true, message: `Session booked with ${mentor.name}` };
  },
};
