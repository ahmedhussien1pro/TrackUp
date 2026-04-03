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

  // Track + subtrack context for smarter replies
  const trackLabel = state.selectedTrack || topTrack;
  const subLabel   = state.subTrackResult || null;

  if (!state.chatMessages || !state.chatMessages.length) {
    state.chatMessages = [
      {
        role: 'mentor',
        text: isAr
          ? `أهلًا! أنا ${mentor.nameAr}. اسألني أي سؤال عن مسار ${trackLabel}${subLabel ? ' / ' + subLabel : ''} وهرد عليك في أقرب وقت.`
          : `Hi! I'm ${mentor.nameEn}. Ask me anything about the ${trackLabel}${subLabel ? ' / ' + subLabel : ''} track — I'll reply as soon as I can.`,
        time: _chatTime()
      }
    ];
    persistState();
  }

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

  // Suggested questions derived from user's current state
  const suggestedQs = _buildSuggestedQs(isAr, trackLabel, subLabel);

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
          onclick="sendSuggestedMessage(\`${q}\`)">
          ${q}
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

function _chatTime() {
  const isAr = state.language === 'ar';
  return new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}

function _buildSuggestedQs(isAr, track, sub) {
  const byTrack = {
    embedded: {
      en: ['Best way to learn RTOS as a beginner?', 'Which sub-track should I focus on first?', 'What tools do I need for Embedded?'],
      ar: ['أفضل طريقة أتعلم RTOS من الصفر؟', 'أيه التخصص الدقيق اللي أبدأ بيه؟', 'أيه الأدوات اللازمة لـ Embedded؟']
    },
    power: {
      en: ['What certifications matter most in Power Systems?', 'How long to be job-ready in Power?', 'SCADA or protection engineering — which to start?'],
      ar: ['أيه الشهادات الأهم في هندسة القوى؟', 'بياخد قد إيه أكون جاهز لسوق العمل؟', 'SCADA ولا حماية — أيهما أبدأ بيه؟']
    },
    communications: {
      en: ['4G vs 5G — which has more demand now?', 'Best path to become an RF engineer?', 'What simulation tools are used in Telecom?'],
      ar: ['4G ولا 5G — أيهما أكثر طلباً الآن؟', 'أفضل مسار أبقى مهندس RF؟', 'أيه أدوات المحاكاة المستخدمة في Telecom؟']
    }
  };
  const generic = {
    en: ['Which sub-track should I focus on first?', 'What courses do you recommend to start?', 'How long does it take to get job-ready?'],
    ar: ['أيه التخصص الدقيق اللي أبدأ بيه؟', 'أيه الكورسات اللي تنصح بيها للبداية؟', 'بياخد قد إيه حتى أكون جاهز للسوق؟']
  };
  const pool = (byTrack[track] || generic)[isAr ? 'ar' : 'en'];
  // If sub-track known, prepend a sub-track specific question
  if (sub) {
    const subQ = isAr ? `ما أول خطوة في مسار ${sub}؟` : `What's the first step in the ${sub} path?`;
    return [subQ, ...pool.slice(0, 2)];
  }
  return pool.slice(0, 3);
}

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
  if (!state.chatMessages) state.chatMessages = [];
  state.chatMessages.push({ role, text, time: _chatTime() });
  persistState();
  renderMainOnly();
  setTimeout(() => {
    const win = document.getElementById('chat-window');
    if (win) win.scrollTop = win.scrollHeight;
  }, 80);
}

function _simulateMentorReply(question) {
  const isAr  = state.language === 'ar';
  const track = state.selectedTrack || 'embedded';
  const sub   = state.subTrackResult || null;
  const q     = question.toLowerCase();

  // Context-aware replies
  const reply = _pickReply(isAr, q, track, sub);
  _pushChatMessage('mentor', reply);
}

function _pickReply(isAr, q, track, sub) {
  // keyword → smart reply
  const rules = [
    { keys: ['rtos','firmware','embedded firmware'],
      en: 'For RTOS, start with FreeRTOS on an STM32 board. It covers tasks, queues, and semaphores — the core of any embedded firmware role.',
      ar: 'لـ RTOS، ابدأ بـ FreeRTOS على لوحة STM32. تغطي Tasks, Queues, و Semaphores — أساس أي وظيفة Embedded Firmware.' },
    { keys: ['salary','راتب','رواتب','money'],
      en: `In the ${track} track, junior engineers typically earn EGP 12,000–20,000/month in Egypt. Senior roles can reach EGP 40,000+.`,
      ar: `في مسار ${track}، المهندس الجونيور يكسب عادةً 12,000–20,000 جنيه/شهر في مصر. الأدوار السينيور تصل لـ 40,000+.` },
    { keys: ['course','كورس','learn','تعلم','start','أبدأ'],
      en: `For ${track}, I recommend starting with the free courses first to build your foundation, then moving to the premium resources. Udemy and YouTube are your best friends early on.`,
      ar: `لمسار ${track}، أنصح بالبدء بالكورسات المجانية لبناء الأساس، ثم الانتقال للمصادر المدفوعة. Udemy و YouTube هما صديقك الأول.` },
    { keys: ['job','وظيفة','ready','جاهز','market','سوق'],
      en: `Realistically, 8–12 focused months will get you job-ready in ${track}. Consistency matters more than speed.`,
      ar: `بشكل واقعي، 8–12 شهر من التركيز ستجعلك جاهزاً لسوق العمل في مسار ${track}. الاستمرارية أهم من السرعة.` },
    { keys: ['sub','تخصص','speciali'],
      en: sub
        ? `You're already in the ${sub} path — great choice! Focus on the core tools and build 2–3 portfolio projects before applying.`
        : `Take the Sub-track Test after your session — it will pinpoint your exact specialization so you don't waste time on the wrong path.`,
      ar: sub
        ? `أنت بالفعل في مسار ${sub} — اختيار ممتاز! ركز على الأدوات الأساسية وابنِ 2–3 مشاريع للبورتفوليو قبل التقديم.`
        : `خذ اختبار التخصص الدقيق بعد جلستك — سيحدد تخصصك بدقة حتى لا تضيع وقتك في المسار الخطأ.` },
    { keys: ['tool','أداة','أدوات','software','hardware'],
      en: `For ${track}, essential tools vary by sub-track. ${sub ? `Since you're in ${sub}, focus on its specific toolchain first.` : 'Completing your Sub-track Test will give you a precise tool list.'}`,
      ar: `في مسار ${track}، الأدوات الأساسية تختلف حسب التخصص. ${sub ? `بما أنك في ${sub}، ركز على الـ toolchain الخاص به أولاً.` : 'إكمال اختبار التخصص سيعطيك قائمة أدوات دقيقة.'}` },
  ];

  for (const rule of rules) {
    if (rule.keys.some(k => q.includes(k))) return isAr ? rule.ar : rule.en;
  }

  // Generic fallback pool
  const fallback = isAr
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
  return fallback[Math.floor(Math.random() * fallback.length)];
}
