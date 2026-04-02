window.renderTestView = function renderTestView() {
  if (!state.completedMilestones.profileCompleted) {
    return `
      <section class="surface-panel section-pad">
        <h2 class="section-title">${t('testTitle')}</h2>
        <p class="text-muted" style="margin-top:.8rem;">${t('profileNeeded')}</p>
        <button class="btn btn-primary" style="margin-top:1rem;" onclick="navigateTo('profile')">${t('profileTitle')}</button>
      </section>
    `;
  }
  const q = QUESTIONS[state.currentQuestionIndex];
  const answer = state.testAnswers[q.id];
  return `
    <section class="surface-panel section-pad" data-aos="fade-up">
      <div class="page-header">
        <div>
          <div class="eyebrow">${t('testTitle')}</div>
          <h2 class="section-title" style="margin-top:.6rem;">${t('testTitle')}</h2>
          <p class="text-muted" style="margin-top:.8rem;">${t('testDesc')}</p>
        </div>
        <div class="surface-soft section-pad" style="min-width:160px;">
          <div class="eyebrow">${t('question')}</div>
          <div style="font-weight:800;font-size:1.2rem;margin-top:.45rem;">${state.currentQuestionIndex + 1}/${QUESTIONS.length}</div>
        </div>
      </div>
      <div class="progress-bar" style="margin-top:1.2rem;"><span style="width:${((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100}%"></span></div>
      <div class="surface-soft section-pad fade-up-soft" style="margin-top:1.4rem;">
        <div class="eyebrow">${t('question')} ${state.currentQuestionIndex + 1}</div>
        <div style="font-size:1.5rem;font-weight:800;margin-top:.6rem;">${q.text[state.language]}</div>
        <div style="display:grid;gap:.75rem;margin-top:1.2rem;">
          ${q.options.map(option => `
            <button class="answer-option ${answer === option.id ? 'selected' : ''}" onclick="selectAnswer('${q.id}','${option.id}')">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;">
                <span style="font-weight:600;">${option.text[state.language]}</span>
                <i data-lucide="${answer === option.id ? 'check-circle-2' : 'circle'}" style="width:18px;height:18px;"></i>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.4rem;">
        <button class="btn btn-secondary" onclick="prevQuestion()">${t('back')}</button>
        ${state.currentQuestionIndex < QUESTIONS.length - 1
          ? `<button class="btn btn-primary" onclick="nextQuestion()">${t('next')}</button>`
          : `<button class="btn btn-primary" onclick="submitAssessment()">${t('submitAssessment')}</button>`}
      </div>
    </section>
  `;
};
