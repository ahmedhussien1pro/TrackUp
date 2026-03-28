import { t } from '../../i18n.js';
import State from '../../state.js';
import { TrackService } from '../../services/track.service.js';
import { RoadmapService } from '../../services/roadmap.service.js';
import { CourseService } from '../../services/course.service.js';
import { MentorService } from '../../services/mentor.service.js';

export function Dashboard() {
  const user        = State.getState('user') || {};
  const lang        = document.documentElement.getAttribute('lang') || 'en';
  const isAr        = lang === 'ar';
  const firstName   = user.name?.split(' ')[0] || (isAr ? '\u0645\u0633\u062a\u062e\u062f\u0645' : 'there');
  const track       = user.activeTrackId ? TrackService.getTrackById(user.activeTrackId) : null;
  const prog        = track ? RoadmapService.getProgressForTrack(track.id) : null;
  const enrollments = CourseService.getEnrollments();
  const bookings    = MentorService.getBookings();
  const allTracks   = TrackService.getAllTracks();

  const hour     = new Date().getHours();
  const greeting = isAr
    ? (hour < 12 ? '\u0635\u0628\u0627\u062d \u0627\u0644\u062e\u064a\u0631' : '\u0645\u0633\u0627\u0621 \u0627\u0644\u062e\u064a\u0631')
    : (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');

  return `
    <div class="dashboard fade-in">

      <!-- Hero -->
      <div class="dashboard-hero">
        <div class="dashboard-hero__text">
          <p class="dashboard-hero__greeting">${greeting},</p>
          <h1 class="dashboard-hero__name">${firstName}</h1>
          <p class="dashboard-hero__sub">
            ${track
              ? (isAr
                  ? `\u0623\u0646\u062a \u0639\u0644\u0649 \u0645\u0633\u0627\u0631 <strong>${track.nameAr || track.name}</strong>`
                  : `You are on the <strong>${track.name}</strong> track`)
              : (isAr
                  ? '\u0644\u0645 \u062a\u062d\u062f\u062f \u0645\u0633\u0627\u0631\u0643 \u0628\u0639\u062f. \u0627\u0628\u062f\u0623 \u0628\u0627\u0644\u062a\u0642\u064a\u064a\u0645'
                  : 'No career track selected yet. Start the assessment.')
            }
          </p>
        </div>
        ${!track ? `
          <a href="#/test" class="btn btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            ${isAr ? '\u0627\u0628\u062f\u0623 \u0627\u0644\u062a\u0642\u064a\u064a\u0645' : 'Take Assessment'}
          </a>` : ''}
      </div>

      <!-- Stats -->
      <div class="dashboard-stats">
        <div class="stat-card slide-up" style="animation-delay:0.05s">
          <div class="stat-card__icon" style="background:#6366f122;color:#6366f1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${track ? '1' : '0'}</span>
            <span class="stat-card__label">${isAr ? '\u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0646\u0634\u0637' : 'Active Track'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.1s">
          <div class="stat-card__icon" style="background:#10b98122;color:#10b981">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value ltr-text">${prog ? prog.percent + '%' : '0%'}</span>
            <span class="stat-card__label">${isAr ? '\u0627\u0644\u062a\u0642\u062f\u0645 \u0641\u064a \u0627\u0644\u0645\u0633\u0627\u0631' : 'Track Progress'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.15s">
          <div class="stat-card__icon" style="background:#f59e0b22;color:#f59e0b">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${enrollments.length}</span>
            <span class="stat-card__label">${isAr ? '\u0627\u0644\u062f\u0648\u0631\u0627\u062a \u0627\u0644\u0645\u0633\u062c\u0644\u0629' : 'Courses Enrolled'}</span>
          </div>
        </div>
        <div class="stat-card slide-up" style="animation-delay:0.2s">
          <div class="stat-card__icon" style="background:#ec489922;color:#ec4899">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>
          </div>
          <div class="stat-card__body">
            <span class="stat-card__value">${bookings.length}</span>
            <span class="stat-card__label">${isAr ? '\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u0625\u0631\u0634\u0627\u062f' : 'Mentor Sessions'}</span>
          </div>
        </div>
      </div>

      <!-- Active Track Progress -->
      ${track ? `
        <div class="card dashboard-track-card slide-up" style="animation-delay:0.25s">
          <div class="dashboard-track-card__header">
            <div class="dashboard-track-card__icon" style="background:${track.color}22;color:${track.color}">${track.icon}</div>
            <div style="flex:1;min-width:0">
              <h3 class="dashboard-track-card__name">${isAr ? (track.nameAr || track.name) : track.name}</h3>
              <p class="dashboard-track-card__desc">${isAr ? (track.descriptionAr || track.description) : track.description}</p>
            </div>
            <a href="#/roadmap" class="btn btn--outline btn--sm" style="white-space:nowrap;flex-shrink:0">
              ${isAr ? '\u0639\u0631\u0636 \u0627\u0644\u062e\u0627\u0631\u0637\u0629' : 'View Roadmap'}
            </a>
          </div>
          <div class="dashboard-track-card__progress">
            <div class="progress-bar">
              <div class="progress-bar__fill"
                   data-pct="${prog?.percent || 0}"
                   style="width:0%;background:${track.color}">
              </div>
            </div>
            <div class="progress-bar__meta">
              <span class="ltr-text">${prog?.completed || 0} ${isAr ? '\u0645\u0643\u062a\u0645\u0644' : 'completed'}</span>
              <span class="ltr-text">${prog?.percent || 0}%</span>
            </div>
          </div>
        </div>`
      : `
        <div class="card dashboard-cta-card slide-up" style="animation-delay:0.25s">
          <div class="dashboard-cta-card__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <h3>${isAr ? '\u0644\u0645 \u062a\u062d\u062f\u062f \u0645\u0633\u0627\u0631\u0643 \u0628\u0639\u062f' : 'No career track yet'}</h3>
          <p>${isAr ? '\u0627\u062e\u0636\u0639 \u0627\u0644\u062a\u0642\u064a\u064a\u0645 \u0648\u0633\u0646\u062e\u0628\u0631\u0643 \u0623\u0646\u0633\u0628 \u0645\u0633\u0627\u0631 \u0644\u0643' : 'Take the smart assessment and we will find your strongest career match'}</p>
          <a href="#/test" class="btn btn--primary">${isAr ? '\u0627\u0628\u062f\u0623 \u0627\u0644\u0622\u0646' : 'Start Now'}</a>
        </div>`
      }

      <!-- Track Explorer -->
      <div class="dashboard-section slide-up" style="animation-delay:0.3s">
        <div class="section-header">
          <h2 class="section-header__title">${isAr ? '\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u0645\u0633\u0627\u0631\u0627\u062a' : 'Explore Tracks'}</h2>
          <a href="#/career" class="section-header__link">${isAr ? '\u0639\u0631\u0636 \u0627\u0644\u0643\u0644' : 'View all'}</a>
        </div>
        <div class="tracks-grid">
          ${allTracks.map((tr, i) => `
            <div class="track-card slide-up" style="animation-delay:${0.35 + i * 0.06}s">
              <div class="track-card__top">
                <div class="track-card__icon" style="background:${tr.color}22;color:${tr.color}">${tr.icon}</div>
                ${track?.id === tr.id ? `<span class="badge badge--active">${isAr ? '\u0646\u0634\u0637' : 'Active'}</span>` : ''}
              </div>
              <div class="track-card__name">${isAr ? (tr.nameAr || tr.name) : tr.name}</div>
              <div class="track-card__desc">${isAr ? (tr.descriptionAr || tr.description) : tr.description}</div>
              <div class="track-card__footer">
                <span class="badge">${tr.level}</span>
                <span class="badge ltr-text">${isAr ? (tr.durationAr || tr.duration) : tr.duration}</span>
              </div>
              <a href="#/career" class="track-card__cta">${isAr ? '\u062a\u0641\u0627\u0635\u064a\u0644' : 'Details'}</a>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

export function DashboardEvents() {
  // Animate progress bar fill after DOM paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.progress-bar__fill[data-pct]').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    });
  });
}
