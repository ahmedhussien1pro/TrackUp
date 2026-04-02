// ============================================================
// sessions.js — TrackUp session data: mentors, slots, types
// ============================================================

window.COLLEGE_OPTIONS = [
  {
    value: 'electrical',
    label: { en: 'Electrical Engineering', ar: 'هندسة كهربائية' },
    tracks: ['power', 'embedded', 'communications'],
  },
  {
    value: 'computer',
    label: { en: 'Computer Engineering', ar: 'هندسة حاسبات' },
    tracks: ['embedded', 'communications'],
  },
  {
    value: 'communications',
    label: { en: 'Communications Engineering', ar: 'هندسة اتصالات' },
    tracks: ['communications', 'embedded'],
  },
];

window.SESSION_TYPES = [
  {
    id: 'intro',
    icon: 'sparkles',
    label: { en: 'Intro Session', ar: 'جلسة تعريفية' },
    desc: {
      en: 'A first look at your result, what the track means for you, and whether it truly fits.',
      ar: 'نظرة أولى على نتيجتك، وماذا يعني المسار لك، وما إذا كان يناسبك فعلاً.',
    },
    duration: { en: '30 min', ar: '٣٠ دقيقة' },
    price: { en: 'EGP 199', ar: '١٩٩ ج.م' },
    badge: 'recommended',
  },
  {
    id: 'roadmap',
    icon: 'route',
    label: { en: 'Roadmap Review', ar: 'مراجعة الخارطة' },
    desc: {
      en: 'Walk through your roadmap step by step with an engineer who already took that path.',
      ar: 'مراجعة خارطة طريقك خطوة بخطوة مع مهندس مر بنفس الطريق.',
    },
    duration: { en: '45 min', ar: '٤٥ دقيقة' },
    price: { en: 'EGP 249', ar: '٢٤٩ ج.م' },
    badge: '',
  },
  {
    id: 'decision',
    icon: 'check-circle-2',
    label: { en: 'Decision Confirmation', ar: 'تأكيد القرار' },
    desc: {
      en: 'Still unsure? One focused session to remove doubt and commit to a clear direction.',
      ar: 'لا تزال غير متأكد؟ جلسة مركزة واحدة لإزالة الشك والانطلاق بوضوح.',
    },
    duration: { en: '30 min', ar: '٣٠ دقيقة' },
    price: { en: 'EGP 199', ar: '١٩٩ ج.م' },
    badge: '',
  },
  {
    id: 'learning',
    icon: 'book-open',
    label: { en: 'Learning Plan Setup', ar: 'بناء خطة التعلم' },
    desc: {
      en: 'Get a concrete, ordered learning plan that fits your schedule and current level.',
      ar: 'احصل على خطة تعلم مرتبة وواقعية تناسب وقتك ومستواك الحالي.',
    },
    duration: { en: '45 min', ar: '٤٥ دقيقة' },
    price: { en: 'EGP 299', ar: '٢٩٩ ج.م' },
    badge: '',
  },
];

window.MENTORS = [
  {
    id: 'eng_khaled',
    name: { en: 'Eng. Khaled Hassan', ar: 'م. خالد حسن' },
    tracks: ['power'],
    role: { en: 'Power Systems Engineer — 8 yrs', ar: 'مهندس أنظمة قوى — ٨ سنوات' },
    lang: { en: 'Arabic / English', ar: 'عربي / إنجليزي' },
    avatar: 'K',
    color: '#2563eb',
    rating: '4.9',
    sessions: 142,
  },
  {
    id: 'eng_sara',
    name: { en: 'Eng. Sara Mostafa', ar: 'م. سارة مصطفى' },
    tracks: ['embedded'],
    role: { en: 'Embedded Systems Engineer — 6 yrs', ar: 'مهندسة أنظمة مدمجة — ٦ سنوات' },
    lang: { en: 'Arabic / English', ar: 'عربي / إنجليزي' },
    avatar: 'S',
    color: '#7c3aed',
    rating: '4.8',
    sessions: 98,
  },
  {
    id: 'eng_omar',
    name: { en: 'Eng. Omar Fathy', ar: 'م. عمر فتحي' },
    tracks: ['communications'],
    role: { en: 'Communications Engineer — 7 yrs', ar: 'مهندس اتصالات — ٧ سنوات' },
    lang: { en: 'Arabic / English', ar: 'عربي / إنجليزي' },
    avatar: 'O',
    color: '#059669',
    rating: '4.9',
    sessions: 117,
  },
  {
    id: 'eng_rania',
    name: { en: 'Eng. Rania Nabil', ar: 'م. رانيا نبيل' },
    tracks: ['embedded', 'communications'],
    role: { en: 'Cross-track Engineer — 5 yrs', ar: 'مهندسة متعددة المسارات — ٥ سنوات' },
    lang: { en: 'Arabic / English', ar: 'عربي / إنجليزي' },
    avatar: 'R',
    color: '#d97706',
    rating: '4.7',
    sessions: 76,
  },
];

window.SESSION_SLOTS = [
  { id: 'sat_10', day: { en: 'Saturday', ar: 'السبت' }, time: '10:00 AM', available: true },
  { id: 'sat_14', day: { en: 'Saturday', ar: 'السبت' }, time: '2:00 PM', available: true },
  { id: 'sun_11', day: { en: 'Sunday', ar: 'الأحد' }, time: '11:00 AM', available: true },
  { id: 'sun_16', day: { en: 'Sunday', ar: 'الأحد' }, time: '4:00 PM', available: false },
  { id: 'mon_10', day: { en: 'Monday', ar: 'الاثنين' }, time: '10:00 AM', available: true },
  { id: 'mon_13', day: { en: 'Monday', ar: 'الاثنين' }, time: '1:00 PM', available: true },
  { id: 'tue_15', day: { en: 'Tuesday', ar: 'الثلاثاء' }, time: '3:00 PM', available: true },
  { id: 'wed_09', day: { en: 'Wednesday', ar: 'الأربعاء' }, time: '9:00 AM', available: false },
  { id: 'wed_17', day: { en: 'Wednesday', ar: 'الأربعاء' }, time: '5:00 PM', available: true },
  { id: 'thu_11', day: { en: 'Thursday', ar: 'الخميس' }, time: '11:00 AM', available: true },
  { id: 'thu_14', day: { en: 'Thursday', ar: 'الخميس' }, time: '2:00 PM', available: true },
  { id: 'fri_10', day: { en: 'Friday', ar: 'الجمعة' }, time: '10:00 AM', available: true },
];
