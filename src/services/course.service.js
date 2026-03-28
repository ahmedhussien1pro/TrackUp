import State from '../state.js';
import { StorageService } from './storage.service.js';
import { courses } from '../data/mock/courses.js';

export const CourseService = {
  getAllCourses() { return courses; },

  getCoursesByTrack(trackId) {
    return trackId ? courses.filter(c => c.trackId === trackId) : courses;
  },

  getEnrollments() {
    return State.getState('enrollments') || StorageService.get('enrollments') || [];
  },

  enroll(courseId) {
    const current = this.getEnrollments();
    if (current.includes(courseId)) return;
    const updated = [...current, courseId];
    State.setState('enrollments', updated);
    StorageService.set('enrollments', updated);
  },

  isEnrolled(courseId) {
    return this.getEnrollments().includes(courseId);
  },
};
