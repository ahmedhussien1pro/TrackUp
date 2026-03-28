import { t } from '../../i18n.js';
import State from '../../state.js';
import { CourseService } from '../../services/course.service.js';

function _render() {
  const user        = State.getState('user');
  const lang        = document.documentElement.getAttribute('lang') || 'en';
  const isAr        = lang === 'ar';
  const activeId    = user?.activeTrackId;
  const allCourses  = activeId
    ? CourseService.getCoursesForTrack(activeId)
    : CourseService.getAllCourses();

  // Group by trackId for better browsing when no track selected
  return `
    <div class="courses-screen fade-in">
      <div class="screen-header">
        <h1>${t('courses.title')}</h1>
        <p>${t('courses.subtitle')}</p>
      </div>

      <div class="courses-screen__grid">
        ${allCourses.map(course => {
          const isEnrolled = CourseService.isEnrolled(course.id);
          const progress   = CourseService.getEnrollmentProgress(course.id);
          const title      = isAr ? (course.titleAr || course.title) : course.title;
          const desc       = isAr ? (course.descriptionAr || course.description || '') : (course.description || '');

          return `
            <div class="course-card${isEnrolled ? ' course-card--enrolled' : ''}">
              <div class="course-card__header">
                <span class="badge badge--${course.level.toLowerCase()}">${
                  isAr
                    ? (course.level === 'Beginner' ? '\u0645\u0628\u062a\u062f\u0626'
                      : course.level === 'Intermediate' ? '\u0645\u062a\u0648\u0633\u0637'
                      : '\u0645\u062a\u0642\u062f\u0645')
                    : course.level
                }</span>
                <span class="badge ${course.free ? 'badge--success' : 'badge--primary'}">
                  ${course.free ? t('courses.free') : t('courses.paid')}
                </span>
              </div>

              <div class="course-card__title">${title}</div>
              ${desc ? `<div class="course-card__desc">${desc}</div>` : ''}

              <div class="course-card__meta">
                ${course.lessons ? `<span class="ltr-text">${course.lessons} ${t('courses.lessons')}</span>` : ''}
                <span class="ltr-text">${course.duration}</span>
                <span style="display:flex;align-items:center;gap:2px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-warning)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span class="ltr-text">${course.rating}</span>
                </span>
              </div>

              ${isEnrolled ? `
                <div style="margin-top:var(--space-3)">
                  <div class="progress-bar">
                    <div class="progress-bar__fill" data-pct="${progress}" style="width:0%"></div>
                  </div>
                  <div class="progress-bar__meta">
                    <span>${t('courses.complete')}</span>
                    <span class="ltr-text">${progress}%</span>
                  </div>
                </div>
              ` : ''}

              <button
                class="btn ${isEnrolled ? 'btn--ghost' : 'btn--primary'} btn--sm course-enroll-btn"
                data-course-id="${course.id}"
                style="margin-top:var(--space-4);width:100%"
                ${isEnrolled ? 'disabled' : ''}
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

export function Courses() {
  return _render();
}

export function CoursesEvents() {
  // Animate progress bars
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    });
  });

  document.querySelectorAll('.course-enroll-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = btn.dataset.courseId;
      const result = CourseService.enrollInCourse(id);
      if (result.success) {
        Toastify({
          text: document.documentElement.getAttribute('lang') === 'ar'
            ? '\u062a\u0645 \u0627\u0644\u062a\u0633\u062c\u064a\u0644 \u0628\u0646\u062c\u0627\u062d'
            : 'Enrolled successfully',
          duration: 2500,
          gravity: 'bottom',
          position: 'right',
          style: { background: 'var(--color-primary)' },
        }).showToast();
        const outlet = document.getElementById('app-outlet');
        if (outlet) { outlet.innerHTML = _render(); CoursesEvents(); }
      }
    });
  });
}
