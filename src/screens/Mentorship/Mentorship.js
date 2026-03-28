import { t } from '../../i18n.js';
import State from '../../state.js';
import { MentorService } from '../../services/mentor.service.js';
import { TrackService } from '../../services/track.service.js';

export function Mentorship() {
  const user = State.getState('user');
  const activeTrackId = user?.activeTrackId;
  const mentors = activeTrackId
    ? MentorService.getMentorsForTrack(activeTrackId)
    : MentorService.getAllMentors();

  return `
    <div class="mentorship-screen">
      <div class="mentorship-screen__header">
        <h1>${t('mentorship.title')}</h1>
        <p>${t('mentorship.subtitle')}</p>
      </div>
      <div class="mentorship-screen__grid">
        ${mentors.map(mentor => `
          <div class="mentor-card">
            <div style="display:flex;gap:var(--space-4);align-items:flex-start">
              <div class="mentor-card__avatar">${mentor.name.charAt(0)}</div>
              <div class="mentor-card__info">
                <h4>${mentor.name}</h4>
                <p>${mentor.title}</p>
              </div>
            </div>
            <p style="font-size:var(--text-sm);color:var(--color-text-secondary)">${mentor.bio}</p>
            <div class="mentor-card__meta">
              <span class="mentor-card__rating">&#9733; ${mentor.rating}</span>
              <span class="mentor-card__price">$${mentor.sessionPrice} / ${t('mentorship.session')}</span>
            </div>
            <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-2)">
              ${mentor.availability.slice(0, 3).map(slot => `<span style="margin-inline-end:var(--space-2)">${slot}</span>`).join('')}
            </div>
            <button class="btn btn--primary btn--sm mentor-book-btn" data-mentor-id="${mentor.id}">
              ${t('mentorship.book')}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function MentorshipEvents() {
  document.querySelectorAll('.mentor-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mentorId = btn.dataset.mentorId;
      const result = MentorService.bookSession(mentorId);
      if (result.success) {
        btn.textContent = t('mentorship.booked');
        btn.disabled = true;
        Toastify({ text: result.message, duration: 2500, gravity: 'bottom', position: 'right', style: { background: 'var(--color-success)' } }).showToast();
      }
    });
  });
}
