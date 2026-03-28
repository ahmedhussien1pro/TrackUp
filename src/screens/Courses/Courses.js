import { t } from '../../i18n.js';
import { CourseService } from '../../services/course.service.js';
import State from '../../state.js';
import { showToast } from '../../utils.js';

export function Courses() {
  const track = State.getState('activeTrack');
  const courses = track
    ? CourseService.getCoursesForTrack(track.id)
    : CourseService.getAllCourses();
  return `
    <div class="courses-screen">
      <div class="courses-screen__header">
        <h2>${t('courses.title')}</h2>
        <p>${t('courses.subtitle')}</p>
      </div>
      <div class="courses-screen__grid">
        ${courses.map(course => `
          <div class="course-card">
            <div class="course-card__header">
              <span class="badge badge--${course.free ? 'success' : 'primary'}">
                ${course.free ? t('courses.free') : t('courses.paid')}
              </span>
              <span class="badge badge--neutral">${course.level}</span>
            </div>
            <h4 class="course-card__title">${course.title}</h4>
            <p class="course-card__desc">${course.description}</p>
            <div class="course-card__meta">
              <span>${course.lessons} ${t('courses.lessons')}</span>
              <span>${course.duration}</span>
            </div>
            <button
              class="btn btn--primary btn--full btn--sm"
              data-course-id="${course.id}">
              ${t('courses.enroll')}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function CoursesEvents() {
  document.querySelectorAll('[data-course-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.dataset.courseId;
      const result = CourseService.enrollInCourse(courseId);
      if (result.success) {
        showToast(result.message, 'success');
        btn.textContent = btn.closest('.course-card').querySelector('.badge--success') ? '' : '';
        btn.disabled = true;
      } else {
        showToast(result.message, 'error');
      }
    });
  });
}
