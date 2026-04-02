window.renderContactView = function renderContactView() {
  const isAr = state.language === 'ar';

  const channels = [
    { icon: 'mail',        labelEn: 'Email',    labelAr: 'البريد',   value: 'trackup.app@gmail.com',        href: 'mailto:trackup.app@gmail.com' },
    { icon: 'linkedin',    labelEn: 'LinkedIn', labelAr: 'LinkedIn', value: 'linkedin.com/in/ahmedhussien1',  href: 'https://linkedin.com/in/ahmedhussien1' },
    { icon: 'github',      labelEn: 'GitHub',   labelAr: 'GitHub',   value: 'github.com/ahmedhussien1pro',   href: 'https://github.com/ahmedhussien1pro' },
  ];

  return `
    <div style="display:grid;gap:1.5rem;max-width:640px;margin:0 auto;">

      <div class="page-header" data-aos="fade-up">
        <div>
          <div class="eyebrow">${isAr ? 'تواصل معنا' : 'Contact'}</div>
          <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'نحن هنا للمساعدة' : 'We\'re here to help'}</h2>
          <p class="text-muted" style="font-size:.88rem;margin-top:.4rem;line-height:1.7;">
            ${isAr ? 'سواء كان عندك سؤال أو اقتراح أو مشكلة تقنية — تواصل معنا وهنرد في أقرب وقت.' : 'Whether you have a question, suggestion, or technical issue — reach out and we\'ll get back to you.'}
          </p>
        </div>
      </div>

      <!-- Channels -->
      <div style="display:grid;gap:.65rem;" data-aos="fade-up">
        ${channels.map(ch => `
          <a href="${ch.href}" target="_blank" rel="noopener"
            class="surface-panel section-pad"
            style="display:flex;align-items:center;gap:.9rem;text-decoration:none;color:inherit;transition:border-color .15s;"
            onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor=''">
            <div style="width:2.2rem;height:2.2rem;border-radius:10px;background:var(--accent-soft);
              display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="${ch.icon}" style="width:1.1rem;height:1.1rem;color:var(--accent);"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:.88rem;">${isAr ? ch.labelAr : ch.labelEn}</div>
              <div class="text-muted" style="font-size:.8rem;margin-top:.1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ch.value}</div>
            </div>
            <i data-lucide="arrow-up-right" style="width:.9rem;height:.9rem;color:var(--text-faint);flex-shrink:0;"></i>
          </a>
        `).join('')}
      </div>

      <!-- Quick message form -->
      <div class="surface-panel section-pad" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:1rem;">${isAr ? 'أرسل رسالة سريعة' : 'Send a quick message'}</div>
        <form id="contactForm" onsubmit="submitContact(event)">
          <div class="form-group" style="margin-bottom:.75rem;">
            <label class="form-label">${isAr ? 'اسمك' : 'Your name'}</label>
            <input class="form-input" id="contactName" type="text"
              placeholder="${isAr ? 'مثال: أحمد علي' : 'e.g. Ahmed Ali'}" required />
          </div>
          <div class="form-group" style="margin-bottom:.75rem;">
            <label class="form-label">${isAr ? 'بريدك الإلكتروني' : 'Your email'}</label>
            <input class="form-input" id="contactEmail" type="email"
              placeholder="name@mail.com" required />
          </div>
          <div class="form-group" style="margin-bottom:.75rem;">
            <label class="form-label">${isAr ? 'رسالتك' : 'Message'}</label>
            <textarea class="form-input" id="contactMsg" rows="4"
              placeholder="${isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...'}" required
              style="resize:vertical;min-height:90px;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">
            <i data-lucide="send" style="width:.9rem;height:.9rem;"></i>
            ${isAr ? 'إرسال' : 'Send'}
          </button>
        </form>
      </div>

    </div>
  `;
};

window.submitContact = function submitContact(e) {
  e.preventDefault();
  const name  = document.getElementById('contactName')?.value?.trim();
  const email = document.getElementById('contactEmail')?.value?.trim();
  const msg   = document.getElementById('contactMsg')?.value?.trim();
  if (!name || !email || !msg) return;
  // mailto fallback (no backend)
  const subject = encodeURIComponent('TrackUp — Message from ' + name);
  const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
  window.open('mailto:trackup.app@gmail.com?subject=' + subject + '&body=' + body);
  showToast(state.language === 'ar' ? 'شكراً! جاري فتح بريدك.' : 'Opening your email client…', '#16a34a');
};
