window.renderContactView = function renderContactView() {
  const isAr = state.language === 'ar';

  const channels = [
    { icon: 'mail',     labelEn: 'Email',    labelAr: 'البريد',   value: 'trackup.app@gmail.com',       href: 'mailto:trackup.app@gmail.com' },
    { icon: 'linkedin', labelEn: 'LinkedIn', labelAr: 'LinkedIn', value: 'linkedin.com/in/ahmedhussien1', href: 'https://linkedin.com/in/ahmedhussien1' },
    { icon: 'github',   labelEn: 'GitHub',   labelAr: 'GitHub',   value: 'github.com/ahmedhussien1pro',  href: 'https://github.com/ahmedhussien1pro' },
  ];

  return `
    <!-- ── Hero Banner ── -->
    <div style="
      margin: -1.5rem -1.5rem 0;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #1d4ed8 100%);
      text-align: center;
      position: relative;
      overflow: hidden;
    ">
      <!-- decorative blobs -->
      <div style="position:absolute;top:-60px;left:-60px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none;"></div>
      <div style="position:absolute;bottom:-80px;right:-40px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,.04);pointer-events:none;"></div>

      <div style="position:relative;z-index:2;max-width:700px;margin:0 auto;" data-aos="fade-up">
        <div style="display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.12);
          border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:.35rem 1rem;
          font-size:.8rem;font-weight:700;color:#fff;letter-spacing:.06em;margin-bottom:1rem;">
          <i data-lucide="mail" style="width:.85rem;height:.85rem;"></i>
          ${isAr ? 'تواصل معنا' : 'CONTACT US'}
        </div>
        <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;line-height:1.2;margin-bottom:.75rem;">
          ${isAr ? 'نحن هنا للمساعدة' : "We're here to help"}
        </h1>
        <p style="font-size:1rem;color:rgba(255,255,255,.78);line-height:1.8;max-width:560px;margin:0 auto;">
          ${isAr
            ? 'سواء كان عندك سؤال، اقتراح، أو مشكلة تقنية — تواصل معنا وهنرد في أقرب وقت.'
            : 'Whether you have a question, suggestion, or technical issue — reach out and we\'ll get back to you.'}
        </p>
      </div>
    </div>

    <!-- ── Main Content ── -->
    <div style="display:grid;gap:2.5rem;margin-top:2.5rem;">

      <!-- 2-column: info + form -->
      <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:2rem;align-items:start;" class="contact-two-col">

        <!-- LEFT: info + channels -->
        <div style="display:grid;gap:1.25rem;" data-aos="fade-right">

          <!-- headline -->
          <div class="surface-panel section-pad">
            <div style="display:flex;align-items:center;gap:.9rem;margin-bottom:1.25rem;">
              <div style="width:3rem;height:3rem;border-radius:16px;background:var(--accent-soft);
                display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="message-circle" style="width:1.4rem;height:1.4rem;color:var(--accent);"></i>
              </div>
              <div>
                <div style="font-weight:800;font-size:1rem;">${isAr ? 'تحدث معنا مباشرة' : 'Talk to us directly'}</div>
                <div class="text-muted" style="font-size:.82rem;margin-top:.15rem;">${isAr ? 'ردّ خلال 24 ساعة' : 'Reply within 24 hours'}</div>
              </div>
            </div>
            <p class="text-muted" style="font-size:.88rem;line-height:1.75;">
              ${isAr
                ? 'فريق TrackUp مهندسين زيك، بيفهموا تحديات الاختيار والبداية. مفيش سؤال صغير أو كبير.'
                : 'The TrackUp team are engineers like you who understand the challenge of choosing and starting. No question is too small.'}
            </p>
          </div>

          <!-- channels -->
          ${channels.map(ch => `
            <a href="${ch.href}" target="_blank" rel="noopener"
              class="surface-panel section-pad"
              style="display:flex;align-items:center;gap:1rem;text-decoration:none;color:inherit;
                transition:border-color .18s,transform .18s;"
              onmouseover="this.style.borderColor='var(--accent)';this.style.transform='translateY(-2px)'"
              onmouseout="this.style.borderColor='';this.style.transform=''">
              <div style="width:2.75rem;height:2.75rem;border-radius:14px;background:var(--accent-soft);
                display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${ch.icon}" style="width:1.2rem;height:1.2rem;color:var(--accent);"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:.9rem;">${isAr ? ch.labelAr : ch.labelEn}</div>
                <div class="text-muted" style="font-size:.8rem;margin-top:.1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ch.value}</div>
              </div>
              <i data-lucide="arrow-up-right" style="width:1rem;height:1rem;color:var(--text-faint);flex-shrink:0;"></i>
            </a>
          `).join('')}
        </div>

        <!-- RIGHT: form -->
        <div data-aos="fade-left">
          <div class="surface-panel section-pad" style="background:var(--surface-2);">
            <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:1.5rem;">
              ${isAr ? '✉️ أرسل رسالتك' : '✉️ Send a message'}
            </h2>
            <form id="contactForm" onsubmit="submitContact(event)">
              <div style="display:grid;gap:1rem;margin-bottom:1rem;">
                <div class="form-group">
                  <label class="form-label">${isAr ? 'الاسم' : 'Your name'}</label>
                  <input class="form-input" id="contactName" type="text"
                    placeholder="${isAr ? 'مثال: أحمد علي' : 'e.g. Ahmed Ali'}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">${isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input class="form-input" id="contactEmail" type="email"
                    placeholder="name@mail.com" required />
                </div>
                <div class="form-group">
                  <label class="form-label">${isAr ? 'رسالتك' : 'Message'}</label>
                  <textarea class="form-input" id="contactMsg" rows="6"
                    placeholder="${isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...'}" required
                    style="resize:vertical;min-height:140px;"></textarea>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;padding:.9rem;">
                <i data-lucide="send" style="width:1rem;height:1rem;"></i>
                ${isAr ? 'إرسال الرسالة' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>

    <style>
      @media (max-width: 768px) {
        .contact-two-col { grid-template-columns: 1fr !important; }
      }
    </style>
  `;
};

window.submitContact = function submitContact(e) {
  e.preventDefault();
  const name  = document.getElementById('contactName')?.value?.trim();
  const email = document.getElementById('contactEmail')?.value?.trim();
  const msg   = document.getElementById('contactMsg')?.value?.trim();
  if (!name || !email || !msg) return;
  const subject = encodeURIComponent('TrackUp — Message from ' + name);
  const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
  window.open('mailto:trackup.app@gmail.com?subject=' + subject + '&body=' + body);
  showToast(state.language === 'ar' ? '✅ شكراً! جاري فتح بريدك.' : '✅ Thanks! Opening your email...', '#16a34a');
};
