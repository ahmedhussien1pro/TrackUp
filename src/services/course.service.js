import { getState, setState } from '../state.js';
import { COURSES } from '../data/mock/courses.js';

export function getCourses() {
  return COURSES;
}

export function getCoursesForTrack(trackId) {
  return COURSES.filter(c => c.trackId === trackId || c.trackId === 'all');
}

export function getCourseById(id) {
  return COURSES.find(c => c.id === id) || null;
}

export function enrollInCourse(courseId) {
  const enrollments = { ...getState('enrollments') };
  if (!enrollments[courseId]) {
    enrollments[courseId] = {
      progress:   0,
      status:     'enrolled',
      enrolledAt: Date.now(),
    };
    setState('enrollments', enrollments);
  }
}

export function updateCourseProgress(courseId, progress) {
  const enrollments = { ...getState('enrollments') };
  enrollments[courseId] = {
    ...enrollments[courseId],
    progress,
    status: progress >= 100 ? 'completed' : 'enrolled',
  };
  setState('enrollments', enrollments);
}
