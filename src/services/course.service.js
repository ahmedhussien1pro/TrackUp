import State from '../state.js';
import { StorageService } from './storage.service.js';
import { courses } from '../data/mock/courses.js';

export const CourseService = {
  getAllCourses() {
    return courses;
  },

  getCourseById(id) {
    return courses.find(c => c.id === id) || null;
  },

  getCoursesForTrack(trackId) {
    return courses.filter(c => c.trackId === trackId || c.trackIds?.includes(trackId));
  },

  isEnrolled(courseId) {
    const enrollments = State.getState('enrollments') || [];
    return enrollments.some(e => e.courseId === courseId);
  },

  getEnrollmentProgress(courseId) {
    const enrollments = State.getState('enrollments') || [];
    const e = enrollments.find(e => e.courseId === courseId);
    return e ? e.progress : 0;
  },

  enrollInCourse(courseId) {
    const course = this.getCourseById(courseId);
    if (!course) return { success: false, message: 'Course not found.' };
    if (this.isEnrolled(courseId)) return { success: false, message: 'Already enrolled.' };

    const enrollment = { courseId, enrolledAt: Date.now(), progress: 0, status: 'active' };
    const enrollments = [...(State.getState('enrollments') || []), enrollment];
    State.setState('enrollments', enrollments);
    StorageService.set('enrollments', enrollments);

    return { success: true, message: `Enrolled in ${course.title}` };
  },
};
