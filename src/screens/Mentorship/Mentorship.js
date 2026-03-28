import { t } from '../../i18n.js';
import State from '../../state.js';
import { MentorService } from '../../services/mentor.service.js';

const SPECIALTY_AR = {
  'React':'React','TypeScript':'TypeScript','Performance':'الأداء',
  'CSS Architecture':'هيكلة CSS','Node.js':'Node.js',
  'System Design':'تصميم الأنظمة','PostgreSQL':'PostgreSQL',
  'Microservices':'الخدمات المصغرة','SQL':'SQL','Python':'Python',
  'Tableau':'Tableau','Data Storytelling':'سرد البيانات',
  'Figma':'Figma','User Research':'بحث المستخدم',
  'Design Systems':'أنظمة التصميم','Prototyping':'النماذج الأولية',
  'Docker':'Docker','Kubernetes':'Kubernetes','AWS':'AWS','CI/CD':'CI/CD','Terraform':'Terraform',
};

// ── State ──────────────────────────────────────────────────────────
let _search  = '';
let _filter  = 'all'; // 'all' | specialty slug
let _view    = 'grid'; // 'grid' | 'list'

// ── Helpers ──────────────────────────────────────────────────────
function _name(m, isAr)  { return isAr ? (m.nameAr  || m.name)  : m.name; }
function _title(m, isAr) { return isAr ? (m.titleAr || m.title) : m.title; }
function _bio(m, isAr)   { return isAr ? (m.bioAr   || m.bio)   : m.bio; }
function _price(m)       { return m.price || m.sessionPrice || 0; }

function _allSpecialties(mentors) {
  return [...new Set(mentors.flatMap(m => m.specialties || []))];
}

function _applyFilters(mentors) {
  let list = mentors;
  if (_filter !== 'all') list = list.filter(m => (m.specialties || []).includes(_filter));
  if (_search.trim()) {
    const q = _search.toLowerCase();
    list = list.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.title || '').toLowerCase().includes(q) ||
      (m.specialties || []).some(s => s.toLowerCase().includes(q))
    );
  }
  return list;
}

// ── Star rating ────────────────────────────────────────────────────
function _stars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const star  = (type) => `<svg width="11" height="11" viewBox="0 0 24 24" fill="${type !== 'empty' ? 'var(--color-warning)' : 'none'}" stroke="var(--color-warning)" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  return Array(full).fill(star('full')).concat(half ? [star('half')] : [], Array(empty).fill(star('empty'))).join('');
}

// ── Mentor card ──────────────────────────────────────────────────
function _renderCard(mentor, isAr) {
  const isBooked = MentorService.isBooked(mentor.id);
  return `
    <div class="mentor-card${_view === 'list' ? ' mentor-card--list' : ''}" data-mentor-id="${mentor.id}">
      <div class="mentor-card__top">
        <div class="mentor-card__avatar">${mentor.avatar || _name(mentor, false).slice(0,2).toUpperCase()}</div>
        <div class="mentor-card__info">
          <h4 class="mentor-card__name">${_name(mentor, isAr)}</h4>
          <p class="mentor-card__role">${_title(mentor, isAr)}</p>
          <p class="mentor-card__company">${mentor.company || ''}</p>
        </div>
        <div class="mentor-card__rating">
          <div class="mentor-card__stars">${_stars(mentor.rating)}</div>
          <span class="ltr-text">${mentor.rating}</span>
          <span class="mentor-card__sessions">${mentor.sessions || mentor.yearsExp} ${mentor.sessions ? (isAr ? 'جلسة' : 'sessions') : (isAr ? 'سنة' : 'yrs')}</span>
        </div>
      </div>

      <p class="mentor-card__bio">${_bio(mentor, isAr)}</p>

      <div class="mentor-card__specialties">
        ${(mentor.specialties || []).slice(0, 4).map(s =>
          `<span class="badge badge--neutral">${isAr ? (SPECIALTY_AR[s] || s) : s}</span>`
        ).join('')}
      </div>

      <div class="mentor-card__footer">
        <span class="mentor-card__price">
          <span class="ltr-text">$${_price(mentor)}</span> / ${isAr ? 'جلسة' : 'session'}
        </span>
        <div style="display:flex;gap:var(--space-2)">
          <button class="btn btn--ghost btn--sm mentor-view-btn" data-mentor-id="${mentor.id}">
            ${isAr ? 'التفاصيل' : 'Details'}
          </button>
          <button
            class="btn ${isBooked ? 'btn--ghost' : 'btn--primary'} btn--sm mentor-book-btn"
            data-mentor-id="${mentor.id}"
            ${isBooked ? 'disabled' : ''}
          >
            ${isBooked ? (isAr ? 'تم الحجز' : 'Booked') : (isAr ? 'حجز' : 'Book')}
          </button>
        </div>
      </div>
    </div>`;
}

// ── Mentor detail modal ───────────────────────────────────────────
function _showModal(mentor, isAr) {
  const isBooked = MentorService.isBooked(mentor.id);
  const existing = document.getElementById('mentor-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'mentor-modal';
  modal.className = 'mentor-modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="mentor-modal">
      <button class="mentor-modal__close" id="mentor-modal-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div class="mentor-modal__head">
        <div class="mentor-modal__avatar">${mentor.avatar || _name(mentor, false).slice(0,2).toUpperCase()}</div>
        <div>
          <h3 class="mentor-modal__name">${_name(mentor, isAr)}</h3>
          <p class="mentor-modal__role">${_title(mentor, isAr)}</p>
          <p class="mentor-modal__company">${mentor.company || ''}</p>
          <div class="mentor-modal__stars">${_stars(mentor.rating)} <span class="ltr-text">${mentor.rating}</span> &bull; ${mentor.sessions || mentor.yearsExp} ${mentor.sessions ? (isAr ? 'جلسة' : 'sessions') : (isAr ? 'سنوات' : 'years exp')}</div>
        </div>
      </div>

      <p class="mentor-modal__bio">${_bio(mentor, isAr)}</p>

      <div class="mentor-modal__section-label">${isAr ? 'تخصصات' : 'Specialties'}</div>
      <div class="mentor-card__specialties" style="margin-bottom:var(--space-5)">
        ${(mentor.specialties || []).map(s =>
          `<span class="badge badge--neutral">${isAr ? (SPECIALTY_AR[s] || s) : s}</span>`
        ).join('')}
      </div>

      <div class="mentor-modal__section-label">${isAr ? 'التوافر' : 'Availability'}</div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-5)">
        ${(mentor.availability || []).map(slot =>
          `<span class="badge badge--neutral ltr-text">${slot}</span>`
        ).join('')}
      </div>

      <div class="mentor-modal__footer">
        <div>
          <span class="mentor-modal__price">$${_price(mentor)}</span>
          <span class="mentor-modal__price-label"> / ${isAr ? 'جلسة' : 'session'}</span>
        </div>
        <button
          class="btn ${isBooked ? 'btn--ghost' : 'btn--primary'} btn--sm mentor-book-btn"
          data-mentor-id="${mentor.id}"
          ${isBooked ? 'disabled' : ''}
          id="modal-book-btn"
        >
          ${isBooked ? (isAr ? 'تم الحجز' : 'Already booked') : (isAr ? 'حجز جلسة' : 'Book session')}
        </button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('mentor-modal-overlay--in'));

  // close
  const _close = () => {
    modal.classList.remove('mentor-modal-overlay--in');
    setTimeout(() => modal.remove(), 200);
  };
  document.getElementById('mentor-modal-close').addEventListener('click', _close);
  modal.addEventListener('click', e => { if (e.target === modal) _close(); });
  document.addEventListener('keydown', function _esc(e) {
    if (e.key === 'Escape') { _close(); document.removeEventListener('keydown', _esc); }
  });

  // book inside modal
  document.getElementById('modal-book-btn')?.addEventListener('click', () => {
    const result = MentorService.bookSession(mentor.id);
    if (result.success) {
      _close();
      Toastify({
        text: result.message,
        duration: 2500, gravity: 'bottom', position: 'right',
        style: { background: 'var(--color-success)' },
      }).showToast();
      const outlet = document.getElementById('app-outlet');
      if (outlet) { outlet.innerHTML = _render(); _bindEvents(); }
    }
  });
}

// ── Main render ────────────────────────────────────────────────────
function _render() {
  const user     = State.getState('user');
  const isAr     = document.documentElement.getAttribute('lang') === 'ar';
  const activeId = user?.activeTrackId;
  const all      = activeId ? MentorService.getMentorsForTrack(activeId) : MentorService.getAllMentors();
  const specs    = _allSpecialties(all);
  const filtered = _applyFilters(all);

  return `
    <div class="mentorship-screen fade-in">

      <div class="screen-header">
        <h1>${isAr ? 'المرشدون' : 'Mentors'}</h1>
        <p>${isAr ? 'تواصل مع خبراء يساعدونك على التقدم في مسارك' : 'Connect with experts who help you grow in your track'}</p>
      </div>

      <!-- Toolbar -->
      <div class="mentor-toolbar slide-up" style="animation-delay:0.04s">
        <div class="mentor-search-wrap">
          <svg class="mentor-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            class="mentor-search"
            id="mentor-search"
            type="search"
            placeholder="${isAr ? 'ابحث عن مرشد أو تخصص‌‌...' : 'Search mentor or specialty...'}"
            value="${_search}"
            autocomplete="off"
          />
        </div>
        <div class="mentor-view-btns">
          <button class="mentor-view-btn${_view === 'grid' ? ' mentor-view-btn--active' : ''}" data-view="grid" aria-label="Grid">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </button>
          <button class="mentor-view-btn${_view === 'list' ? ' mentor-view-btn--active' : ''}" data-view="list" aria-label="List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Specialty filter chips -->
      <div class="mentor-chips slide-up" style="animation-delay:0.07s" id="mentor-chips">
        <button class="mentor-chip${_filter === 'all' ? ' mentor-chip--active' : ''}" data-spec="all">
          ${isAr ? 'الكل' : 'All'}
        </button>
        ${specs.map(s => `
          <button class="mentor-chip${_filter === s ? ' mentor-chip--active' : ''}" data-spec="${s}">
            ${isAr ? (SPECIALTY_AR[s] || s) : s}
          </button>`).join('')}
      </div>

      <!-- Results count -->
      <p class="mentor-count slide-up" style="animation-delay:0.1s">
        ${filtered.length} ${isAr ? 'مرشد' : 'mentor'}${filtered.length !== 1 && !isAr ? 's' : ''}
        ${_filter !== 'all' || _search ? (isAr ? 'مطابق' : 'found') : ''}
      </p>

      <!-- Grid / List -->
      <div class="mentorship-screen__grid${_view === 'list' ? ' mentorship-screen__grid--list' : ''}" id="mentor-grid">
        ${filtered.length > 0
          ? filtered.map(m => _renderCard(m, isAr)).join('')
          : `<div class="empty-state" style="grid-column:1/-1">
               <p>${isAr ? 'لا يوجد مرشدون مطابقون' : 'No mentors match your search'}</p>
             </div>`
        }
      </div>
    </div>`;
}

// ── Events ───────────────────────────────────────────────────────────
function _rerender() {
  const outlet = document.getElementById('app-outlet');
  if (outlet) { outlet.innerHTML = _render(); _bindEvents(); }
}

function _bindEvents() {
  const isAr = document.documentElement.getAttribute('lang') === 'ar';
  const all  = (() => {
    const user = State.getState('user');
    return user?.activeTrackId
      ? MentorService.getMentorsForTrack(user.activeTrackId)
      : MentorService.getAllMentors();
  })();

  // Search
  let _debounce;
  document.getElementById('mentor-search')?.addEventListener('input', e => {
    clearTimeout(_debounce);
    _debounce = setTimeout(() => {
      _search = e.target.value;
      _rerender();
    }, 250);
  });

  // Filter chips
  document.querySelectorAll('.mentor-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      _filter = btn.dataset.spec;
      _rerender();
    });
  });

  // View toggle
  document.querySelectorAll('.mentor-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _view = btn.dataset.view;
      _rerender();
    });
  });

  // Detail modal
  document.querySelectorAll('.mentor-view-btn[data-view]').forEach(() => {}); // view toggles handled above
  document.querySelectorAll('.mentor-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.mentor-book-btn') || e.target.closest('.mentor-view-btn[data-view]')) return;
      if (e.target.closest('.mentor-view-btn')) return;
      const id = card.dataset.mentorId;
      const mentor = all.find(m => String(m.id) === String(id));
      if (mentor) _showModal(mentor, isAr);
    });
  });

  // View buttons (Details)
  document.querySelectorAll('.mentor-view-btn[data-mentor-id]');
  document.querySelectorAll('button.mentor-view-btn').forEach(btn => {
    if (!btn.dataset.mentorId) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const mentor = all.find(m => String(m.id) === String(btn.dataset.mentorId));
      if (mentor) _showModal(mentor, isAr);
    });
  });

  // Book
  document.querySelectorAll('.mentor-book-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const result = MentorService.bookSession(btn.dataset.mentorId);
      if (result.success) {
        Toastify({
          text: result.message,
          duration: 2500, gravity: 'bottom', position: 'right',
          style: { background: 'var(--color-success)' },
        }).showToast();
        _rerender();
      }
    });
  });
}

export function Mentorship() { return _render(); }
export function MentorshipEvents() { _bindEvents(); }
