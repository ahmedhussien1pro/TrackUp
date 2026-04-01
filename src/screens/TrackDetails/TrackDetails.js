import { tracks }   from '../../data/mock/tracks.js';
import { roadmaps } from '../../data/mock/roadmaps.js';
import { courses }  from '../../data/mock/courses.js';
import { TrackService } from '../../services/track.service.js';
import { Router } from '../../router.js';
import State from '../../state.js';

const WORK_STYLE_ICON = {
  field:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  office: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  hybrid: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>`,
};

// MVP video placeholders — one per track, expandable later
const TRACK_VIDEOS = {
  power: [
    { titleEn: 'What is Power Engineering?',       titleAr: 'إيه هي هندسة القوى؟',              ytId: 'lENE9l3LMXY' },
    { titleEn: 'A Day in the Life — Power Engineer', titleAr: 'يوم في حياة مهندس قوى',      ytId: 'ZM8ECpBuQYE' },
    { titleEn: 'Pros and Cons of Power Systems',   titleAr: 'مميزات وعيوب مسار القوى',  ytId: 'AWhDJkMvZis' },
  ],
  embedded: [
    { titleEn: 'What is Embedded Systems?',        titleAr: 'إيه هي الأنظمة المدمجة؟',     ytId: 'mGPBu9kXnhU' },
    { titleEn: 'A Day in the Life — Embedded Engineer', titleAr: 'يوم في حياة مهندس مدمج', ytId: '3l3Z3MNJNB4' },
    { titleEn: 'Pros and Cons of Embedded Systems', titleAr: 'مميزات وعيوب مسار المدمج',  ytId: 'OvLZoFIBRBQ' },
  ],
  communications: [
    { titleEn: 'What is Communications Engineering?', titleAr: 'إيه هي هندسة الاتصالات؟',   ytId: 'tHc1_SiJeNs' },
    { titleEn: 'A Day in the Life — Comms Engineer', titleAr: 'يوم في حياة مهندس اتصالات', ytId: 'ZVHysmIJiaU' },
    { titleEn: 'Pros and Cons of Communications',    titleAr: 'مميزات وعيوب مسار الاتصالات', ytId: 'MWk3T-aE8Ic' },
  ],
  'career-shift': [
    { titleEn: 'How to Shift into Engineering',      titleAr: 'كيف تحوّل لمسار هندسي؟',       ytId: 'W5NQ55JLHKQ' },
    { titleEn: 'A Day in the Life — Career Changer', titleAr: 'يوم في حياة محوّل مسار',         ytId: 'dQw4w9WgXcQ' },
    { titleEn: 'Pros and Cons of Career Shifting',   titleAr: 'مميزات وعيوب تحويل المسار',  ytId: 'dQw4w9WgXcQ' },
  ],
};

export function TrackDetails(query = {}) {
  const id   = query.id || '';
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const isAr = lang === 'ar';

  const track = tracks.find(t => t.id === id);
  if (!track) {
    return `<div class="empty-state">${isAr ? 'المسار غير موجود' : 'Track not found'}</div>`;
  }

  const user     = State.getState('user') || {};
  const isActive = user.activeTrackId === track.id;
  const name     = isAr ? (track.nameAr || track.name) : track.name;
  const desc     = isAr ? (track.descriptionAr || track.description) : track.description;
  const future   = isAr ? (track.futureOutlookAr || track.futureOutlook) : track.futureOutlook;
  const wsLabel  = isAr ? (track.workStyleAr || track.workStyle) : track.workStyle;

  const trackCourses = courses.filter(c => c.trackId === track.id).slice(0, 3);
  const roadmapSteps = (roadmaps[track.id] || []).slice(0, 4);
  const videos       = TRACK_VIDEOS[track.id] || [];

  const ctaLabel = isActive
    ? (isAr ? 'عرض الخارطة' : 'View Roadmap')
    : (isAr ? 'ابدأ هذا المسار' : 'Start this Track');

  return `
    <div class="track-details fade-in" data-track-id="${track.id}">

      <!-- HEADER -->
      <div class="track-details__header" style="--track-color:${track.color}">
        <div class="track-details__header-inner">
          <button class="btn btn--ghost btn--sm td-back-btn" style="margin-bottom:var(--space-4)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            ${isAr ? 'رجوع' : 'Back'}
          </button>
          <div style="display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap">
            <div class="track-details__icon" style="background:${track.color}20;color:${track.color}">${track.icon}</div>
            <div>
              <h1 class="track-details__name">${name}</h1>
              <div class="track-details__meta">
                <span class="badge" style="background:${track.color}20;color:${track.color}">${track.demandLevel} ${isAr ? 'طلب' : 'Demand'}</span>
                <span class="badge badge--neutral ltr-text">${isAr ? track.durationAr : track.duration}</span>
                <span class="badge badge--neutral">
                  ${WORK_STYLE_ICON[track.workStyle] || ''}
                  ${wsLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="track-details__body">

        <!-- DESCRIPTION -->
        <section class="td-section">
          <p class="td-description">${desc}</p>
        </section>

        <!-- SALARY -->
        <section class="td-section td-salary">
          <div class="td-section__label">${isAr ? 'نطاق الراتب' : 'Salary Range'}</div>
          <div class="td-salary__value ltr-text">${track.salaryRange}</div>
        </section>

        <!-- SKILLS -->
        <section class="td-section">
          <h2 class="td-section__title">${isAr ? 'المهارات المطلوبة' : 'Required Skills'}</h2>
          <div class="td-chips">
            ${(track.skills || []).map(s => `<span class="td-chip">${s}</span>`).join('')}
          </div>
        </section>

        <!-- PROS & CONS -->
        <section class="td-section td-pros-cons">
          <div class="td-pros">
            <h3 class="td-section__title td-section__title--green">${isAr ? 'المميزات' : 'Pros'}</h3>
            <ul>
              ${(track.pros || []).map(p => `
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ${isAr ? p.ar : p.en}
                </li>`).join('')}
            </ul>
          </div>
          <div class="td-cons">
            <h3 class="td-section__title td-section__title--red">${isAr ? 'التحديات' : 'Challenges'}</h3>
            <ul>
              ${(track.cons || []).map(c => `
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  ${isAr ? c.ar : c.en}
                </li>`).join('')}
            </ul>
          </div>
        </section>

        <!-- FUTURE OUTLOOK -->
        <section class="td-section">
          <h2 class="td-section__title">${isAr ? 'مستقبل المجال' : 'Future of the Field'}</h2>
          <p class="td-future">${future}</p>
        </section>

        <!-- INTRO VIDEOS (MVP Placeholders) -->
        ${videos.length ? `
          <section class="td-section">
            <h2 class="td-section__title">${isAr ? 'فيديوهات تعريفية' : 'Intro Videos'}</h2>
            <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-4)">
              ${isAr ? 'شاهد قبل ما تبدأ — فيديوهات قصيرة بتعطيك تصور كامل' : 'Watch before you start — short videos that give you the full picture'}
            </p>
            <div class="td-videos">
              ${videos.map((v, i) => `
                <a
                  href="https://www.youtube.com/watch?v=${v.ytId}"
                  target="_blank"
                  rel="noopener"
                  class="td-video-card"
                >
                  <div class="td-video-card__thumb" style="background:${track.color}14">
                    <img
                      src="https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg"
                      alt="${isAr ? v.titleAr : v.titleEn}"
                      loading="lazy"
                      onerror="this.style.display='none'"
                    />
                    <div class="td-video-card__play" style="background:${track.color}">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <span class="td-video-card__num" style="background:${track.color}">${i + 1}</span>
                  </div>
                  <div class="td-video-card__info">
                    <div class="td-video-card__title">${isAr ? v.titleAr : v.titleEn}</div>
                    <div class="td-video-card__sub">${isAr ? 'فيديو تعريفي' : 'Intro video'}</div>
                  </div>
                </a>`).join('')}
            </div>
          </section>` : ''}

        <!-- ROADMAP PREVIEW -->
        ${roadmapSteps.length ? `
          <section class="td-section">
            <h2 class="td-section__title">${isAr ? 'نظرة على خارطة الطريق' : 'Roadmap Preview'}</h2>
            <div class="td-roadmap-preview">
              ${roadmapSteps.map((step, i) => `
                <div class="td-roadmap-step">
                  <div class="td-roadmap-step__num" style="background:${track.color}20;color:${track.color}">${i + 1}</div>
                  <div>
                    <div class="td-roadmap-step__phase">${step.phase}</div>
                    <div class="td-roadmap-step__title">${step.title}</div>
                  </div>
                </div>`).join('')}
              <div class="td-roadmap-more">
                ${isAr ? `+ ${(roadmaps[track.id] || []).length - 4} خطوات أخرى` : `+ ${(roadmaps[track.id] || []).length - 4} more steps`}
              </div>
            </div>
          </section>` : ''}

        <!-- TOP COURSES -->
        ${trackCourses.length ? `
          <section class="td-section">
            <h2 class="td-section__title">${isAr ? 'أبرز الكورسات' : 'Top Courses'}</h2>
            <div class="td-courses">
              ${trackCourses.map(c => `
                <div class="td-course">
                  <div class="td-course__info">
                    <div class="td-course__name">${isAr && c.titleAr ? c.titleAr : c.title}</div>
                    <div class="td-course__meta">
                      <span class="badge badge--neutral">${c.provider}</span>
                      <span class="badge badge--neutral ltr-text">${c.duration}</span>
                      <span class="badge ${c.free ? 'badge--success' : 'badge--neutral'}">${c.free ? (isAr ? 'مجاني' : 'Free') : (isAr ? 'مدفوع' : 'Paid')}</span>
                    </div>
                  </div>
                  <a
                    href="${c.url || '#/courses'}"
                    target="${c.url && c.url.startsWith('http') ? '_blank' : '_self'}"
                    rel="noopener"
                    class="btn btn--primary btn--sm"
                    style="background:${track.color};border-color:${track.color};white-space:nowrap;flex-shrink:0"
                  >
                    ${isAr ? 'ابدأ' : 'Start'}
                  </a>
                </div>`).join('')}
            </div>
          </section>` : ''}

        <!-- ROLES AFTER -->
        <section class="td-section">
          <h2 class="td-section__title">${isAr ? 'وظائف بعد هذا المسار' : 'Roles After This Track'}</h2>
          <div class="td-chips">
            ${(track.rolesAfter || []).map(r => `<span class="td-chip td-chip--role">${r}</span>`).join('')}
          </div>
        </section>

        <!-- LIVE SESSION (Optional MVP — disabled) -->
        <section class="td-section">
          <div class="td-live-session">
            <div class="td-live-session__info">
              <div class="td-live-session__icon" style="background:${track.color}14;color:${track.color}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>
              </div>
              <div>
                <div class="td-live-session__title">${isAr ? 'جلسة لايف مع مَنْتور' : 'Live Q&A with a Mentor'}</div>
                <div class="td-live-session__sub">${isAr ? 'اسأل أي حاجة قبل ما تبدأ — متاح بعد اختيار المسار' : 'Ask anything before you commit — available after you pick a track'}</div>
              </div>
            </div>
            <button class="btn btn--outline btn--sm td-live-btn" disabled style="opacity:0.5;cursor:not-allowed">
              ${isAr ? 'قريباً' : 'Coming Soon'}
            </button>
          </div>
        </section>

        <!-- PRIMARY CTA -->
        <div class="td-cta">
          <button
            class="btn btn--primary btn--lg td-enroll-btn"
            data-id="${track.id}"
            data-active="${isActive}"
            style="--btn-color:${track.color}"
          >
            ${ctaLabel}
          </button>
          <a href="#/career" class="btn btn--ghost btn--lg">
            ${isAr ? 'عرض كل المسارات' : 'View All Tracks'}
          </a>
        </div>

      </div>
    </div>
  `;
}

export function TrackDetailsEvents(query = {}) {
  const isAr = document.documentElement.getAttribute('lang') === 'ar';

  document.querySelector('.td-back-btn')?.addEventListener('click', () => {
    Router.navigate('/career');
  });

  document.querySelector('.td-enroll-btn')?.addEventListener('click', (e) => {
    const id       = e.currentTarget.dataset.id;
    const isActive = e.currentTarget.dataset.active === 'true';

    if (isActive) {
      Router.navigate('/roadmap');
      return;
    }

    TrackService.enrollInTrack(id);

    if (window.Toastify) {
      Toastify({
        text:     isAr ? 'تم تحديد مسارك. جاري تحميل خارطة الطريق...' : 'Track selected. Loading your roadmap...',
        duration: 2000,
        gravity:  'bottom',
        position: 'right',
        style:    { background: 'var(--color-success)' },
      }).showToast();
    }

    setTimeout(() => Router.navigate('/roadmap'), 400);
  });
}
