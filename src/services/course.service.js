import State from '../state.js';
import { StorageService } from './storage.service.js';
import { courses } from '../data/mock/courses.js';

export const CourseService = {
  getAllCourses() {
    return courses;
  },

  getCoursesForTrack(trackId) {
    return trackId ? courses.filter(c => c.trackId === trackId) : courses;
  },

  // alias kept for compatibility
  getCoursesByTrack(trackId) {
    return this.getCoursesForTrack(trackId);
  },

  getCourseById(id) {
    return courses.find(c => c.id === id) || null;
  },

  getEnrollments() {
    const state = State.getState('enrollments');
    if (state) return state;
    const saved = StorageService.get('enrollments') || [];
    State.setState('enrollments', saved);
    return saved;
  },

  isEnrolled(courseId) {
    return this.getEnrollments().some(e =>
      typeof e === 'string' ? e === courseId : e.courseId === courseId
    );
  },

  getEnrollmentProgress(courseId) {
    const e = this.getEnrollments().find(en =>
      typeof en === 'string' ? en === courseId : en.courseId === courseId
    );
    if (!e || typeof e === 'string') return 0;
    return e.progress || 0;
  },

  enrollInCourse(courseId) {
    if (this.isEnrolled(courseId)) return { success: false, message: 'Already enrolled' };
    const current = this.getEnrollments();
    const entry = { courseId, progress: 0, status: 'active', enrolledAt: Date.now() };
    const updated = [...current, entry];
    State.setState('enrollments', updated);
    StorageService.set('enrollments', updated);
    return { success: true, message: 'Enrolled successfully' };
  },

  // alias
  enroll(courseId) {
    return this.enrollInCourse(courseId);
  },
};
