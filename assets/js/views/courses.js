window.renderCoursesView = function renderCoursesView() {
  if (!ensureResultsOrPrompt()) return '';
  const track = getCurrentTrack();
  const list = COURSES[state.selectedTrack];
  return `
    <section class="surface-panel section-pad">
      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${t('coursesTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${track.title[state.language]} — ${t('coursesTitle')}</h2>
          <p class="text-muted" style="margin-top:.8rem;">${t('startLearning')}</p>
        </div>
        <button class="btn btn-secondary" onclick="navigateTo('progress')">${t('viewProgress')}</button>
      </div>
      <div style="display:grid;gap:1rem;margin-top:1.4rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
        ${list.map((course, idx) => {
          const cid = `${state.selectedTrack}_${idx}`;
          const started = state.startedCourseIds.includes(cid);
          return `
            <div class="surface-soft section-pad" data-aos="fade-up" data-aos-delay="${idx * 70}">
              <div class="page-header">
                <div>
                  <div class="eyebrow">${course.level}</div>
                  <div style="font-weight:800;font-size:1.1rem;margin-top:.5rem;">${course.name[state.language]}</div>
                </div>
                <span class="badge ${course.badge === 'Free' ? 'badge-success' : 'badge-accent'}">${course.badge === 'Free' ? t('free') : t('premium')}</span>
              </div>
              <p class="text-muted" style="margin-top:.8rem;line-height:1.8;">${course.note[state.language]}</p>
              <button class="btn ${started ? 'btn-secondary' : 'btn-primary'}" style="margin-top:1rem;width:100%;" onclick="startCourse('${cid}')">${started ? t('completed') : t('startLearning')}</button>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
};
