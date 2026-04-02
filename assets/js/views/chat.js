window.renderChatView = function renderChatView() {
  const isAr = state.language === 'ar';

  if (!state.premiumUnlocked) {
    return `
      <div class="surface-panel section-pad" style="text-align:center;max-width:520px;margin:0 auto;" data-aos="fade-up">
        <div style="width:3rem;height:3rem;border-radius:12px;background:var(--accent-soft,rgba(37,99,235,.1));display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <i data-lucide="lock" style="width:1.3rem;height:1.3rem;color:var(--accent);"></i>
        </div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:.5rem;">
          ${isAr ? 'المحادثة متاحة للأعضاء المدفوعين' : 'Chat is for Premium Members'}
        </div>
        <p class="text-muted" style="font-size:.9rem;line-height:1.7;margin-bottom:1.2rem;">
          ${isAr
            ? 'اشترك في الباقة المدفوعة للتواصل مع مرشدك المقيم وإرسال أسئلتك في أي وقت.'
            : 'Upgrade to Premium to message your Resident Mentor and get async guidance anytime.'}
        </p>
        <button class="btn btn-primary" onclick="navigateTo('pricing')">
          ${isAr ? 'اشترك الآن' : 'Upgrade to Premium'}
        </button>
      </div>
    `;
  }

  const trackToMentor = {
    power: 'mentor-1', embedded: 'mentor-1', communications: 'mentor-1'
  };
  const topTrack = state.rankedTracks?.[0]?.id || 'embedded';
  const residentId = trackToMentor[topTrack] || 'mentor-1';
  const mentor = MENTORS.find(m => m.id === residentId) || MENTORS[0];

  if (!state.chatMessages) state.chatMessages = [
    {
      role: 'mentor',
      text: isAr
        ? `أهلًا! أنا ${mentor.nameAr}. اسألني أي سؤال عن مسارك أو تخصصك وهرد عليك في أقرب وقت.`
        : `Hi! I'm ${mentor.nameEn}. Ask me anything about your track or specialization — I'll reply as soon as I can.`,
      time: '10:00 AM'
    }
  ];

  const messages = state.chatMessages;

  const bubbles = messages.map(msg => {
    const isUser = msg.role === 'user';
    return `
      <div style="display:flex;flex-direction:column;align-items:${isUser ? (isAr ? 'flex-start' : 'flex-end') : (isAr ? 'flex-end' : 'flex-start')};gap:.25rem;">
        <div style="
          max-width:75%;
          padding:.65rem 1rem;
          border-radius:${isUser ? '12px 12px ' + (isAr ? '12px 3px' : '3px 12px') : '12px 12px ' + (isAr ? '3px 12px' : '12px 3px')};
          background:${isUser ? 'var(--accent)' : 'var(--surface-2,var(--surface))'};
          color:${isUser ? '#fff' : 'inherit'};
          font-size:.9rem;
          line-height:1.6;
          border:${isUser ? 'none' : '1px solid var(--border)'};
        ">${msg.text}</div>
        <div style="font-size:.72rem;color:var(--text-muted);padding:0 .25rem;">${msg.time}</div>
      </div>
    `;
  }).join('');

  const suggestedQs = [
    { en: 'Which sub-track should I focus on first?',  ar: 'أيه التخصص الدقيق اللي أبدأ بيه؟' },
    { en: 'What courses do you recommend to start?',   ar: 'أيه الكورسات اللي تنصح بيها للبداية؟' },
    { en: 'How long does it take to get job-ready?',   ar: 'بياخد قد إيه حتى أكون جاهز للسوق؟' },
    { en: 'What tools should I learn first?',          ar: 'أيه الأدوات اللي أتعلمها الأول؟' }
  ];

  return `
    <div class="page-header" data-aos="fade-up">
      <div>
        <div class="eyebrow">${isAr ? 'المرشد المقيم' : 'Resident Mentor Chat'}</div>
        <h2 class="section-title" style="margin-top:.4rem;">${isAr ? 'تواصل مع مرشدك' : 'Message Your Mentor'}</h2>
        <p class="text-muted" style="font-size:.88rem;margin-top:.4rem;">
          ${isAr
            ? 'اسأل، ناقش، واحصل على إجابات حقيقية من مرشدك المتخصص.'
            : 'Ask questions, discuss your progress, and get real answers from your dedicated mentor.'}
        </p>
      </div>
    </div>

    <div class="surface-soft section-pad" style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;" data-aos="fade-up">
      <div style="width:3rem;height:3rem;border-radius:50%;background:${mentor.color};display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;flex-shrink:0;">${mentor.avatar}</div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:.95rem;">${isAr ? mentor.nameAr : mentor.nameEn}</div>
        <div class="text-muted" style="font-size:.8rem;">${isAr ? mentor.titleAr : mentor.titleEn}</div>
      </div>
      <div style="display:flex;align-items:center;gap:.35rem;font-size:.78rem;color:#16a34a;font-weight:600;">
        <div style="width:.55rem;height:.55rem;border-radius:50%;background:#16a34a;"></div>
        ${isAr ? 'متاح' : 'Available'}
      </div>
    </div>

    <div
      id="chat-window"
      class="surface-panel"
      style="min-height:340px;max-height:420px;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:1rem;margin-bottom:.75rem;"
      data-aos="fade-up">
      ${bubbles}
    </div>

    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.75rem;" data-aos="fade-up">
      ${suggestedQs.map(q => `
        <button
          class="btn btn-secondary"
          style="font-size:.78rem;padding:.3rem .8rem;"
          onclick="sendSuggestedMessage(\`${isAr ? q.ar : q.en}\`)">
          ${isAr ? q.ar : q.en}
        </button>
      `).join('')}
    </div>

    <div class="surface-panel" style="display:flex;gap:.75rem;align-items:center;padding:.75rem 1rem;" data-aos="fade-up">
      <input
        id="chat-input"
        type="text"
        class="form-input"
        style="flex:1;border:none;background:transparent;outline:none;font-size:.9rem;"
        placeholder="${isAr ? 'اكتب سؤالك هنا...' : 'Type your question here...'}"
        onkeydown="if(event.key==='Enter')sendChatMessage()"
        dir="${isAr ? 'rtl' : 'ltr'}" />
      <button class="btn btn-primary" style="padding:.5rem 1rem;" onclick="sendChatMessage()">
        <i data-lucide="send" style="width:.9rem;height:.9rem;"></i>
      </button>
    </div>

    <p class="text-muted" style="font-size:.75rem;text-align:center;margin-top:.75rem;" data-aos="fade-up">
      <i data-lucide="clock" style="width:.7rem;height:.7rem;vertical-align:middle;"></i>
      ${isAr
        ? 'الردود تصلك خلال 24 ساعة عادةً. المحادثة محفوظة في ملفك.'
        : 'Replies typically arrive within 24 hours. All messages are saved to your profile.'}
    </p>
  `;
};

window.sendChatMessage = function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  _pushChatMessage('user', text);
  input.value = '';
  setTimeout(() => _simulateMentorReply(text), 900);
};

window.sendSuggestedMessage = function sendSuggestedMessage(text) {
  _pushChatMessage('user', text);
  setTimeout(() => _simulateMentorReply(text), 900);
};

function _pushChatMessage(role, text) {
  const isAr = state.language === 'ar';
  const now  = new Date();
  const time = now.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  if (!state.chatMessages) state.chatMessages = [];
  state.chatMessages.push({ role, text, time });
  persistState();
  renderMainOnly();
  setTimeout(() => {
    const win = document.getElementById('chat-window');
    if (win) win.scrollTop = win.scrollHeight;
  }, 80);
}

function _simulateMentorReply(question) {
  const isAr = state.language === 'ar';
  const replies = isAr
    ? [
        'سؤال ممتاز! سأرد عليك بتفصيل خلال اليوم.',
        'شكرًا على سؤالك، خد راحتك وأنا هراجع وأرد.',
        'هذا سؤال مهم، سأرسل لك رد مفصّل قريبًا.',
        'جيد جدًا إنك سألت عن ده — متابعني وهرد قريبًا.'
      ]
    : [
        'Great question! I will reply with full details later today.',
        'Thanks for asking — I will review and get back to you soon.',
        'That is an important point, I will send you a detailed reply shortly.',
        'Good that you asked — stay tuned, I will reply soon.'
      ];
  const text = replies[Math.floor(Math.random() * replies.length)];
  _pushChatMessage('mentor', text);
}
