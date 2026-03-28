import { t } from '../../i18n.js';
import State from '../../state.js';
import { MentorService } from '../../services/mentor.service.js';

const SPECIALTY_AR = {
  'React': 'React', 'TypeScript': 'TypeScript', 'Performance': '\u0627\u0644\u0623\u062f\u0627\u0621',
  'CSS Architecture': '\u0647\u064a\u0643\u0644\u0629 CSS', 'Node.js': 'Node.js',
  'System Design': '\u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0623\u0646\u0638\u0645\u0629',
  'PostgreSQL': 'PostgreSQL', 'Microservices': '\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0635\u063a\u0631\u0629',
  'SQL': 'SQL', 'Python': 'Python', 'Tableau': 'Tableau',
  'Data Storytelling': '\u0633\u0631\u062f \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',
  'Figma': 'Figma', 'User Research': '\u0628\u062d\u062b \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645',
  'Design Systems': '\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062a\u0635\u0645\u064a\u0645', 'Prototyping': '\u0627\u0644\u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0623\u0648\u0644\u064a\u0629',
  'Docker': 'Docker', 'Kubernetes': 'Kubernetes', 'AWS': 'AWS', 'CI/CD': 'CI/CD', 'Terraform': 'Terraform',
};

function _renderMentor(mentor, isAr) {
  const isBooked = MentorService.isBooked(mentor.id);
  const name     = isAr ? (mentor.nameAr  || mentor.name)  : mentor.name;
  const title    = isAr ? (mentor.titleAr || mentor.title) : mentor.title;
  const bio      = isAr ? (mentor.bioAr   || mentor.bio)   : mentor.bio;

  return `
    <div class="mentor-card">
      <div class="mentor-card__top">
        <div class="mentor-card__avatar">${mentor.avatar || mentor.name.slice(0,2).toUpperCase()}</div>
        <div class="mentor-card__info">
          <h4 class="mentor-card__name">${name}</h4>
          <p class="mentor-card__role">${title}</p>
          <p class="mentor-card__company" style="font-size:var(--text-xs);color:var(--color-text-muted)">${mentor.company || ''}</p>
        </div>
        <div style="margin-inline-start:auto;text-align:end;flex-shrink:0">
          <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--color-warning)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style="font-size:var(--text-sm);font-weight:var(--weight-semi)" class="ltr-text">${mentor.rating}</span>
          </div>
          <div style="font-size:var(--text-xs);color:var(--color-text-muted)" class="ltr-text">
            ${mentor.sessions || mentor.yearsExp} ${mentor.sessions ? t('mentorship.sessions') : t('mentorship.exp')}
          </div>
        </div>
      </div>

      <p class="mentor-card__bio">${bio}</p>

      <div class="mentor-card__specialties">
        ${(mentor.specialties || []).slice(0, 4).map(s =>
          `<span class="badge badge--neutral">${isAr ? (SPECIALTY_AR[s] || s) : s}</span>`
        ).join('')}
      </div>

      <div class="mentor-card__availability">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>${t('mentorship.available')}:</span>
        ${(mentor.availability || []).slice(0, 3).map(slot =>
          `<span class="badge badge--neutral ltr-text">${slot}</span>`
        ).join('')}
      </div>

      <div class="mentor-card__footer">
        <span class="mentor-card__price">
          <span class="ltr-text">$${mentor.price || mentor.sessionPrice || 0}</span>
          / ${t('mentorship.session')}
        </span>
        <button
          class="btn ${isBooked ? 'btn--ghost' : 'btn--primary'} btn--sm mentor-book-btn"
          data-mentor-id="${mentor.id}"
          ${isBooked ? 'disabled' : ''}
        >
          ${isBooked ? t('mentorship.booked') : t('mentorship.book')}
        </button>
      </div>
    </div>
  `;
}

function _render() {
  const user        = State.getState('user');
  const lang        = document.documentElement.getAttribute('lang') || 'en';
  const isAr        = lang === 'ar';
  const activeId    = user?.activeTrackId;
  const mentors     = activeId
    ? MentorService.getMentorsForTrack(activeId)
    : MentorService.getAllMentors();

  return `
    <div class="mentorship-screen fade-in">
      <div class="screen-header">
        <h1>${t('mentorship.title')}</h1>
        <p>${t('mentorship.subtitle')}</p>
      </div>
      <div class="mentorship-screen__grid">
        ${mentors.map(m => _renderMentor(m, isAr)).join('')}
      </div>
    </div>
  `;
}

export function Mentorship() {
  return _render();
}

export function MentorshipEvents() {
  document.querySelectorAll('.mentor-book-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = btn.dataset.mentorId;
      const result = MentorService.bookSession(id);
      if (result.success) {
        Toastify({
          text: result.message,
          duration: 2500,
          gravity: 'bottom',
          position: 'right',
          style: { background: 'var(--color-success)' },
        }).showToast();
        const outlet = document.getElementById('app-outlet');
        if (outlet) { outlet.innerHTML = _render(); MentorshipEvents(); }
      }
    });
  });
}
