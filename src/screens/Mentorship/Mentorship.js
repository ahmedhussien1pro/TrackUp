import { t } from '../../i18n.js';
import { MentorService } from '../../services/mentor.service.js';
import State from '../../state.js';
import { showToast } from '../../utils.js';

export function Mentorship() {
  const track = State.getState('activeTrack');
  const mentors = track
    ? MentorService.getMentorsForTrack(track.id)
    : MentorService.getAllMentors();
  return `
    <div class="mentorship-screen">
      <div class="mentorship-screen__header">
        <h2>${t('mentorship.title')}</h2>
        <p>${t('mentorship.subtitle')}</p>
      </div>
      <div class="mentorship-screen__grid">
        ${mentors.map(mentor => `
          <div class="mentor-card">
            <div class="mentor-card__avatar">
              <span>${mentor.name.charAt(0)}</span>
            </div>
            <div class="mentor-card__info">
              <h4>${mentor.name}</h4>
              <p>${mentor.title}</p>
              <div class="mentor-card__tags">
                ${mentor.tracks.map(tr => `<span class="badge badge--neutral">${tr}</span>`).join('')}
              </div>
            </div>
            <div class="mentor-card__meta">
              <span class="mentor-card__rating">&#9733; ${mentor.rating}</span>
              <span class="mentor-card__price">$${mentor.sessionPrice} / ${t('mentorship.session')}</span>
            </div>
            <button
              class="btn btn--primary btn--full btn--sm"
              data-mentor-id="${mentor.id}">
              ${t('mentorship.book')}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function MentorshipEvents() {
  document.querySelectorAll('[data-mentor-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mentorId = btn.dataset.mentorId;
      const result = MentorService.bookSession(mentorId);
      showToast(result.message, result.success ? 'success' : 'error');
    });
  });
}
