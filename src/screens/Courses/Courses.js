import { t } from '../../i18n.js';
import State from '../../state.js';
import { CourseService } from '../../services/course.service.js';
import { TrackService } from '../../services/track.service.js';

export function Courses() {
  const user = State.getState('user');
  const activeTrackId = user?.activeTrackId;
  const allCourses = activeTrackId
    ? CourseService.getCoursesForTrack(activeTrackId)
    : CourseService.getAllCourses();

  return `
    <div class="courses-screen">
      <div class="courses-screen__header">
        <h1>${t('courses.title')}</h1>
        <p>${t('courses.subtitle')}</p>
      </div>
      <div class="courses-screen__grid">
        ${allCourses.map(course => {
          const isEnrolled = CourseService.isEnrolled(course.id);
          const progress   = CourseService.getEnrollmentProgress(course.id);
          return `
            <div class="course-card">
              <div class="course-card__header">
                <span class="badge badge--${course.level}">${course.level}</span>
                <span class="badge ${course.free ? 'badge--success' : 'badge--primary'}">
                  ${course.free ? t('courses.free') : t('courses.paid')}
                </span>
              </div>
              <div class="course-card__title">${course.title}</div>
              <div class="course-card__desc">${course.description}</div>
              <div class="course-card__meta">
                <span>${course.lessons} ${t('courses.lessons')}</span>
                <span>${course.duration}</span>
              </div>
              ${isEnrolled ? `
                <div style="margin-top:var(--space-3)">
                  <div style="height:4px;background:var(--color-surface-2);border-radius:var(--radius-full);overflow:hidden">
                    <div style="height:100%;width:${progress}%;background:var(--color-primary);transition:width 0.4s ease"></div>
                  </div>
                  <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-1)">${progress}% complete</div>
                </div>
              ` : ''}
              <button
                class="btn ${isEnrolled ? 'btn--ghost' : 'btn--primary'} btn--sm course-enroll-btn"
                data-course-id="${course.id}"
                style="margin-top:var(--space-3)"
              >
                ${isEnrolled ? t('courses.enrolled') : t('courses.enroll')}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function CoursesEvents() {
  document.querySelectorAll('.course-enroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.courseId;
      if (CourseService.isEnrolled(id)) return;
      const result = CourseService.enrollInCourse(id);
      if (result.success) {
        btn.textContent = t('courses.enrolled');
        btn.classList.replace('btn--primary', 'btn--ghost');
        Toastify({ text: result.message, duration: 2000, gravity: 'bottom', position: 'right', style: { background: 'var(--color-primary)' } }).showToast();
      }
    });
  });
}
