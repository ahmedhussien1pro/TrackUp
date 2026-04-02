window.renderAboutView = function renderAboutView() {
  const isAr = state.language === 'ar';

  const team = [
    { name: isAr ? 'أحمد حسين' : 'Ahmed Hussien',   role: isAr ? 'المؤسس · Full-Stack Developer' : 'Founder · Full-Stack Developer', initials: 'AH', color: '#2563eb' },
  ];

  const values = [
    { icon: 'compass',     en: 'Clarity',     ar: 'الوضوح',     descEn: 'We cut through noise to give students a clear path forward.', descAr: 'نزيل الضبابية ونقدم للطالب مسار واضح.' },
    { icon: 'shield-check',en: 'Trust',       ar: 'الثقة',      descEn: 'Honest recommendations — no filler, no bias.',               descAr: 'توصيات صادقة بلا حشو ولا تحيّز.' },
    { icon: 'zap',         en: 'Speed',       ar: 'السرعة',     descEn: '5 minutes to go from zero to a personalised roadmap.',       descAr: '5 دقائق من الصفر لخارطة طريق شخصية.' },
    { icon: 'users-round', en: 'Community',   ar: 'المجتمع',   descEn: 'Built for Egyptian engineering students, by one of them.',   descAr: 'صُنع لطلاب الهندسة المصريين من أحدهم.' },
  ];

  const stats = [
    { num: '5',  labelEn: 'Questions',      labelAr: 'أسئلة' },
    { num: '12', labelEn: 'Tracks',         labelAr: 'مسار' },
    { num: '8+', labelEn: 'Platforms',      labelAr: 'منصة' },
    { num: '1',  labelEn: 'Clear roadmap',  labelAr: 'خارطة واضحة' },
  ];

  return `
    <div style="display:grid;gap:1.75rem;">

      <!-- Hero -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.5rem;">${isAr ? 'من نحن' : 'About Us'}</div>
        <h1 style="font-size:clamp(1.6rem,3.5vw,2.2rem);font-weight:900;line-height:1.15;letter-spacing:-.03em;">
          ${isAr ? 'مش بس اختيار تخصص —<br>ده بداية مسارك الصح' : 'Not just picking a major —<br>it\'s the start of your real path'}
        </h1>
        <p class="text-muted" style="margin-top:.85rem;max-width:580px;line-height:1.8;font-size:.95rem;">
          ${isAr
            ? 'TrackUp اتبنى لأن كتير من طلاب الهندسة مش عارفين يختاروا تخصصهم أو يعرفوا يبدأوا من فين. الـ platform دي بتجمع تقييم ذكي + خارطة طريق + توجيه من خبراء — كل ده في مكان واحد.'
            : 'TrackUp was built because too many engineering students don\'t know how to choose their specialisation or where to start. We combine a smart assessment, a step-by-step roadmap, and expert mentorship — all in one place.'}
        </p>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;" data-aos="fade-up">
        ${stats.map(s => `
          <div class="kpi-card" style="text-align:center;">
            <div style="font-size:1.75rem;font-weight:900;color:var(--accent);">${s.num}</div>
            <div class="text-muted" style="font-size:.78rem;margin-top:.2rem;">${isAr ? s.labelAr : s.labelEn}</div>
          </div>
        `).join('')}
      </div>

      <!-- Values -->
      <div data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:1rem;">${isAr ? 'قيمنا' : 'Our Values'}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
          ${values.map(v => `
            <div class="surface-panel section-pad">
              <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
                <i data-lucide="${v.icon}" style="width:1.1rem;height:1.1rem;color:var(--accent);"></i>
                <span style="font-weight:800;font-size:.95rem;">${isAr ? v.ar : v.en}</span>
              </div>
              <p class="text-muted" style="font-size:.84rem;line-height:1.7;">${isAr ? v.descAr : v.descEn}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Team -->
      <div data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:1rem;">${isAr ? 'الفريق' : 'Team'}</div>
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;">
          ${team.map(m => `
            <div class="surface-panel section-pad" style="display:flex;align-items:center;gap:.9rem;min-width:240px;">
              <div style="width:2.8rem;height:2.8rem;border-radius:50%;background:${m.color}18;border:2px solid ${m.color}44;
                display:flex;align-items:center;justify-content:center;font-weight:900;color:${m.color};font-size:.95rem;flex-shrink:0;">
                ${m.initials}
              </div>
              <div>
                <div style="font-weight:800;font-size:.95rem;">${m.name}</div>
                <div class="text-muted" style="font-size:.78rem;margin-top:.15rem;">${m.role}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- CTA -->
      <div class="surface-panel section-pad" style="text-align:center;" data-aos="fade-up">
        <div style="font-weight:800;font-size:1.05rem;margin-bottom:.5rem;">${isAr ? 'جاهز تبدأ؟' : 'Ready to start?'}</div>
        <p class="text-muted" style="font-size:.88rem;margin-bottom:.9rem;">${isAr ? 'خلي التقييم يحدد مسارك في 5 دقائق.' : 'Let the assessment define your path in 5 minutes.'}</p>
        <button class="btn btn-primary" onclick="navigateTo('profile')">
          <i data-lucide="play" style="width:.9rem;height:.9rem;"></i>
          ${isAr ? 'ابدأ دلوقتي' : 'Start Now'}
        </button>
      </div>

    </div>
  `;
};
