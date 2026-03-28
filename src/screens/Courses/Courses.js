import { t } from '../../i18n.js';
import State from '../../state.js';
import { CourseService } from '../../services/course.service.js';

let _search = '';
let _level  = 'all';
let _type   = 'all'; // 'all' | 'free' | 'paid'
let _sort   = 'default';

const LEVEL_AR = { Beginner: 'مبتدئ', Intermediate: 'متوسط', Advanced: 'متقدم' };

function _isAr() {
  return document.documentElement.getAttribute('lang') === 'ar';
}

function _localTitle(course, isAr) {
  return isAr ? (course.titleAr || course.title) : course.title;
}

function _localDesc(course, isAr) {
  return isAr ? (course.descriptionAr || course.description || '') : (course.description || '');
}

function _filtered(courses) {
  let list = [...courses];
  if (_level !== 'all') list = list.filter(c => c.level === _level);
  if (_type  === 'free') list = list.filter(c => c.free);
  if (_type  === 'paid') list = list.filter(c => !c.free);
  if (_search.trim()) {
    const q = _search.toLowerCase();
    list = list.filter(c =>
      c.title.toLowerCase().includes(q) ||
      (c.titleAr || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    );
  }
  if (_sort === 'rating')   list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (_sort === 'duration') list.sort((a, b) => (a.lessons || 0) - (b.lessons || 0));
  return list;
}

function _showDetailModal(course, isAr) {
  const existing = document.getElementById('course-modal');
  if (existing) existing.remove();
  const isEnrolled = CourseService.isEnrolled(course.id);
  const progress   = CourseService.getEnrollmentProgress(course.id);
  const level      = isAr ? (LEVEL_AR[course.level] || course.level) : course.level;

  const modal = document.createElement('div');
  modal.id = 'course-modal';
  modal.className = 'mentor-modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="mentor-modal course-modal">
      <button class="mentor-modal__close" id="cm-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div class="course-modal__header">
        <div class="course-modal__icon" style="background:${course.color || 'var(--color-primary)'}22;color:${course.color || 'var(--color-primary)'}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        </div>
        <div>
          <h3 class="course-modal__title">${_localTitle(course, isAr)}</h3>
          <div class="course-modal__badges">
            <span class="badge badge--${course.level.toLowerCase()}">${level}</span>
            <span class="badge ${course.free ? 'badge--success' : 'badge--primary'}">${course.free ? (isAr ? 'مجاني' : 'Free') : (isAr ? 'مدفوع' : 'Paid')}</span>
            ${isEnrolled ? `<span class="badge badge--active">${isAr ? 'مسجل' : 'Enrolled'}</span>` : ''}
          </div>
        </div>
      </div>

      ${_localDesc(course, isAr) ? `<p class="course-modal__desc">${_localDesc(course, isAr)}</p>` : ''}

      <div class="course-modal__stats">
        <div class="course-modal__stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          <span class="ltr-text">${course.lessons || '?'}</span>
          <span>${isAr ? 'درس' : 'lessons'}</span>
        </div>
        <div class="course-modal__stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="ltr-text">${course.duration}</span>
        </div>
        <div class="course-modal__stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-warning)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span class="ltr-text">${course.rating}</span>
        </div>
        ${course.instructor ? `
          <div class="course-modal__stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span>${course.instructor}</span>
          </div>` : ''}
      </div>

      ${isEnrolled ? `
        <div style="margin-bottom:var(--space-5)">
          <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-2)">
            <span>${isAr ? 'تقدمك' : 'Your progress'}</span>
            <span class="ltr-text">${progress}%</span>
          </div>
          <div class="progress-bar" style="height:8px">
            <div class="progress-bar__fill" data-pct="${progress}" style="width:0%;background:${course.color || 'var(--color-primary)'}"></div>
          </div>
        </div>` : ''
      }

      <div class="mentor-modal__footer">
        <button class="btn btn--ghost btn--sm" id="cm-cancel">${isAr ? 'إغلاق' : 'Close'}</button>
        <button
          class="btn btn--primary btn--sm course-modal-enroll-btn"
          data-course-id="${course.id}"
          ${isEnrolled ? 'disabled' : ''}
        >
          ${isEnrolled ? (isAr ? 'تم التسجيل' : 'Already enrolled') : (isAr ? 'سجّل الآن' : 'Enroll now')}
        </button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('mentor-modal-overlay--in'));

  // Animate bar
  if (isEnrolled) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      modal.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }));
  }

  const _close = () => {
    modal.classList.remove('mentor-modal-overlay--in');
    setTimeout(() => modal.remove(), 200);
  };

  document.getElementById('cm-close').addEventListener('click', _close);
  document.getElementById('cm-cancel').addEventListener('click', _close);
  modal.addEventListener('click', e => { if (e.target === modal) _close(); });
  document.addEventListener('keydown', function _esc(e) {
    if (e.key === 'Escape') { _close(); document.removeEventListener('keydown', _esc); }
  });

  modal.querySelector('.course-modal-enroll-btn:not([disabled])')?.addEventListener('click', () => {
    const result = CourseService.enrollInCourse(course.id);
    if (result.success) {
      _close();
      Toastify({
        text: isAr ? 'تم التسجيل بنجاح' : 'Enrolled successfully',
        duration: 2500, gravity: 'bottom', position: 'right',
        style: { background: 'var(--color-success)' },
      }).showToast();
      _rerender();
    }
  });
}

function _renderCard(course, isAr) {
  const isEnrolled = CourseService.isEnrolled(course.id);
  const progress   = CourseService.getEnrollmentProgress(course.id);
  const level      = isAr ? (LEVEL_AR[course.level] || course.level) : course.level;
  const title      = _localTitle(course, isAr);
  const desc       = _localDesc(course, isAr);

  return `
    <div class="course-card${isEnrolled ? ' course-card--enrolled' : ''}" data-course-id="${course.id}">
      <div class="course-card__top" style="background:${course.color || 'var(--color-primary)'}18">
        <div class="course-card__top-icon" style="color:${course.color || 'var(--color-primary)'}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        </div>
        ${isEnrolled ? `
          <span class="course-card__enrolled-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            ${isAr ? 'مسجّل' : 'Enrolled'}
          </span>` : ''}
      </div>

      <div class="course-card__body">
        <div class="course-card__header">
          <span class="badge badge--${course.level.toLowerCase()}">${level}</span>
          <span class="badge ${course.free ? 'badge--success' : 'badge--primary'}">
            ${course.free ? (isAr ? 'مجاني' : 'Free') : (isAr ? 'مدفوع' : 'Paid')}
          </span>
        </div>
        <div class="course-card__title">${title}</div>
        ${desc ? `<div class="course-card__desc">${desc}</div>` : ''}
        <div class="course-card__meta">
          ${course.lessons ? `<span class="ltr-text">${course.lessons} ${isAr ? 'درس' : 'lessons'}</span>` : ''}
          <span class="ltr-text">${course.duration}</span>
          <span style="display:flex;align-items:center;gap:2px">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-warning)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="ltr-text">${course.rating}</span>
          </span>
        </div>

        ${isEnrolled ? `
          <div class="course-card__progress">
            <div class="progress-bar">
              <div class="progress-bar__fill" data-pct="${progress}" style="width:0%;background:${course.color || 'var(--color-primary)'}"></div>
            </div>
            <div class="progress-bar__meta">
              <span>${isAr ? 'تقدم' : 'Progress'}</span>
              <span class="ltr-text">${progress}%</span>
            </div>
          </div>` : ''}

        <div class="course-card__footer">
          <button class="btn btn--ghost btn--sm course-detail-btn" data-course-id="${course.id}">${isAr ? 'التفاصيل' : 'Details'}</button>
          <button
            class="btn ${isEnrolled ? 'btn--ghost' : 'btn--primary'} btn--sm course-enroll-btn"
            data-course-id="${course.id}"
            ${isEnrolled ? 'disabled' : ''}
          >
            ${isEnrolled ? (isAr ? 'مسجّل' : 'Enrolled') : (isAr ? 'سجّل' : 'Enroll')}
          </button>
        </div>
      </div>
    </div>`;
}

function _render() {
  const isAr       = _isAr();
  const user       = State.getState('user');
  const activeId   = user?.activeTrackId;
  const all        = activeId ? CourseService.getCoursesForTrack(activeId) : CourseService.getAllCourses();
  const filtered   = _filtered(all);
  const enrolledN  = all.filter(c => CourseService.isEnrolled(c.id)).length;
  const freeN      = all.filter(c => c.free).length;
  const levels     = [...new Set(all.map(c => c.level))];

  return `
    <div class="courses-screen fade-in">

      <div class="screen-header">
        <h1>${isAr ? 'الدورات' : 'Courses'}</h1>
        <p>${isAr ? 'تصفح الدورات وسجّل لتطوير مهاراتك' : 'Browse and enroll in courses to build your skills'}</p>
      </div>

      <!-- Stats bar -->
      <div class="courses-stats slide-up" style="animation-delay:0.04s">
        <div class="courses-stat">
          <span class="courses-stat__value">${all.length}</span>
          <span class="courses-stat__label">${isAr ? 'دورة متاحة' : 'Available'}</span>
        </div>
        <div class="courses-stat courses-stat--divider">
          <span class="courses-stat__value" style="color:var(--color-primary)">${enrolledN}</span>
          <span class="courses-stat__label">${isAr ? 'مسجل بها' : 'Enrolled'}</span>
        </div>
        <div class="courses-stat courses-stat--divider">
          <span class="courses-stat__value" style="color:var(--color-success)">${freeN}</span>
          <span class="courses-stat__label">${isAr ? 'مجانية' : 'Free'}</span>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="courses-toolbar slide-up" style="animation-delay:0.08s">
        <div class="mentor-search-wrap" style="flex:1;min-width:180px">
          <svg class="mentor-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="mentor-search" id="course-search" type="search"
            placeholder="${isAr ? 'ابحث عن دورة...' : 'Search courses...'}"
            value="${_search}" autocomplete="off" />
        </div>
        <select class="courses-select" id="course-level">
          <option value="all" ${_level === 'all' ? 'selected' : ''}>${isAr ? 'كل المستويات' : 'All levels'}</option>
          ${levels.map(l => `<option value="${l}" ${_level === l ? 'selected' : ''}>${isAr ? (LEVEL_AR[l] || l) : l}</option>`).join('')}
        </select>
        <select class="courses-select" id="course-type">
          <option value="all"  ${_type === 'all'  ? 'selected' : ''}>${isAr ? 'الكل' : 'All types'}</option>
          <option value="free" ${_type === 'free' ? 'selected' : ''}>${isAr ? 'مجاني' : 'Free'}</option>
          <option value="paid" ${_type === 'paid' ? 'selected' : ''}>${isAr ? 'مدفوع' : 'Paid'}</option>
        </select>
        <select class="courses-select" id="course-sort">
          <option value="default"  ${_sort === 'default'  ? 'selected' : ''}>${isAr ? 'الافتراضي' : 'Default'}</option>
          <option value="rating"   ${_sort === 'rating'   ? 'selected' : ''}>${isAr ? 'الأعلى تقييماً' : 'Top rated'}</option>
          <option value="duration" ${_sort === 'duration' ? 'selected' : ''}>${isAr ? 'الأقصر' : 'Shortest'}</option>
        </select>
      </div>

      <p class="mentor-count slide-up" style="animation-delay:0.1s">
        ${filtered.length} ${isAr ? 'دورة' : 'course'}${filtered.length !== 1 && !isAr ? 's' : ''}
        ${_level !== 'all' || _type !== 'all' || _search ? (isAr ? 'مطابق' : 'found') : ''}
      </p>

      <div class="courses-screen__grid">
        ${filtered.length > 0
          ? filtered.map((c, i) => `<div class="slide-up" style="animation-delay:${0.1 + i * 0.04}s">${_renderCard(c, isAr)}</div>`).join('')
          : `<div class="empty-state" style="grid-column:1/-1">
               <p>${isAr ? 'لا توجد دورات مطابقة' : 'No courses match your filters'}</p>
             </div>`
        }
      </div>
    </div>`;
}

function _rerender() {
  const outlet = document.getElementById('app-outlet');
  if (outlet) { outlet.innerHTML = _render(); CoursesEvents(); }
}

export function Courses() { return _render(); }

export function CoursesEvents() {
  // Animate progress bars
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }));

  const isAr = _isAr();
  const user = State.getState('user');
  const all  = user?.activeTrackId
    ? CourseService.getCoursesForTrack(user.activeTrackId)
    : CourseService.getAllCourses();

  // Search
  let _debounce;
  document.getElementById('course-search')?.addEventListener('input', e => {
    clearTimeout(_debounce);
    _debounce = setTimeout(() => { _search = e.target.value; _rerender(); }, 240);
  });

  // Selects
  document.getElementById('course-level')?.addEventListener('change', e => { _level = e.target.value; _rerender(); });
  document.getElementById('course-type')?.addEventListener('change',  e => { _type  = e.target.value; _rerender(); });
  document.getElementById('course-sort')?.addEventListener('change',  e => { _sort  = e.target.value; _rerender(); });

  // Details modal
  document.querySelectorAll('.course-detail-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const course = all.find(c => String(c.id) === String(btn.dataset.courseId));
      if (course) _showDetailModal(course, isAr);
    });
  });

  // Card click → modal
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.course-enroll-btn') || e.target.closest('.course-detail-btn')) return;
      const course = all.find(c => String(c.id) === String(card.dataset.courseId));
      if (course) _showDetailModal(course, isAr);
    });
  });

  // Enroll
  document.querySelectorAll('.course-enroll-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const result = CourseService.enrollInCourse(btn.dataset.courseId);
      if (result.success) {
        Toastify({
          text: isAr ? 'تم التسجيل بنجاح' : 'Enrolled successfully',
          duration: 2500, gravity: 'bottom', position: 'right',
          style: { background: 'var(--color-success)' },
        }).showToast();
        _rerender();
      }
    });
  });
}
