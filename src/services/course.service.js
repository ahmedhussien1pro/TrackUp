import State from '../state.js';
import { MOCK_COURSES } from '../data/mock/courses.js';

const _courses = [...MOCK_COURSES];

export const CourseService = {
  getAllCourses() {
    return _courses;
  },

  getCoursesForTrack(trackId) {
    return _courses.filter(c => c.trackId === trackId);
  },

  getCourseById(id) {
    return _courses.find(c => c.id === id) || null;
  },

  enrollInCourse(courseId) {
    const enrollments = [...(State.getState('enrollments') || [])];
    if (enrollments.find(e => e.courseId === courseId))
      return { success: false, message: 'Already enrolled.' };
    enrollments.push({ courseId, progress: 0, status: 'enrolled', enrolledAt: Date.now() });
    State.setState('enrollments', enrollments);
    return { success: true, message: 'Enrolled successfully.' };
  },

  updateProgress(courseId, progress) {
    const enrollments = (State.getState('enrollments') || []).map(e =>
      e.courseId === courseId
        ? { ...e, progress, status: progress >= 100 ? 'completed' : 'enrolled' }
        : e
    );
    State.setState('enrollments', enrollments);
  },

  isEnrolled(courseId) {
    return !!(State.getState('enrollments') || []).find(e => e.courseId === courseId);
  },

  getEnrollmentProgress(courseId) {
    return (State.getState('enrollments') || []).find(e => e.courseId === courseId)?.progress || 0;
  },
};
