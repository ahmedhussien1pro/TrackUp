// ============================================================
// sessions.js — session types, slots, college options
// MENTORS data now lives in mentors.js (single source of truth)
// ============================================================

window.COLLEGE_OPTIONS = [
  { value: 'electrical',    label: { en: 'Electrical Engineering',    ar: 'هندسة كهربائية' },    tracks: ['power','embedded','communications'] },
  { value: 'computer',      label: { en: 'Computer Engineering',      ar: 'هندسة حاسبات' },         tracks: ['embedded','communications'] },
  { value: 'communications',label: { en: 'Communications Engineering', ar: 'هندسة اتصالات' },       tracks: ['communications','embedded'] },
  { value: 'software',      label: { en: 'Software Engineering',       ar: 'هندسة برمجيات' },       tracks: ['frontend','backend','data','cyber'] },
  { value: 'mechanical',    label: { en: 'Mechanical Engineering',     ar: 'هندسة ميكانيكية' },   tracks: ['design','manufacturing','thermal'] },
  { value: 'civil',         label: { en: 'Civil Engineering',          ar: 'هندسة مدنية' },           tracks: ['structural','water','geotechnical'] },
];

window.SESSION_TYPES = [
  {
    id: 'intro',
    icon: 'sparkles',
    label: { en: 'Intro Session', ar: 'جلسة تعريفية' },
    desc: {
      en: 'A first look at your result, what the track means for you, and whether it truly fits.',
      ar: 'نظرة أولى على نتيجتك، وماذا يعني المسار لك، وهل يناسبك.',
    },
    duration: { en: '60 min', ar: '60 دقيقة' },
    price: { en: 'EGP 250', ar: '250 ج.م' },
    badge: 'recommended',
  },
  {
    id: 'roadmap',
    icon: 'route',
    label: { en: 'Roadmap Review', ar: 'مراجعة خارطة التطور' },
    desc: {
      en: 'Walk through your roadmap step by step with an engineer who already took that path.',
      ar: 'مراجعة خارطة طريقك خطوة بخطوة مع مهندس مر بنفس الطريق.',
    },
    duration: { en: '60 min', ar: '60 دقيقة' },
    price: { en: 'EGP 300', ar: '300 ج.م' },
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
    duration: { en: '60 min', ar: '60 دقيقة' },
    price: { en: 'EGP 250', ar: '250 ج.م' },
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
    duration: { en: '60 min', ar: '60 دقيقة' },
    price: { en: 'EGP 350', ar: '350 ج.م' },
    badge: '',
  },
];

window.SESSION_SLOTS = [
  { id: 'sat_10', day: { en: 'Saturday',  ar: 'السبت'     }, time: '10:00 AM', available: true  },
  { id: 'sat_14', day: { en: 'Saturday',  ar: 'السبت'     }, time: '2:00 PM',  available: true  },
  { id: 'sun_11', day: { en: 'Sunday',    ar: 'الأحد'     }, time: '11:00 AM', available: true  },
  { id: 'sun_16', day: { en: 'Sunday',    ar: 'الأحد'     }, time: '4:00 PM',  available: false },
  { id: 'mon_10', day: { en: 'Monday',    ar: 'الاثنين'   }, time: '10:00 AM', available: true  },
  { id: 'mon_13', day: { en: 'Monday',    ar: 'الاثنين'   }, time: '1:00 PM',  available: true  },
  { id: 'tue_15', day: { en: 'Tuesday',   ar: 'الثلاثاء'  }, time: '3:00 PM',  available: true  },
  { id: 'wed_09', day: { en: 'Wednesday', ar: 'الأربعاء' }, time: '9:00 AM',  available: false },
  { id: 'wed_17', day: { en: 'Wednesday', ar: 'الأربعاء' }, time: '5:00 PM',  available: true  },
  { id: 'thu_11', day: { en: 'Thursday',  ar: 'الخميس'   }, time: '11:00 AM', available: true  },
  { id: 'thu_14', day: { en: 'Thursday',  ar: 'الخميس'   }, time: '2:00 PM',  available: true  },
  { id: 'fri_10', day: { en: 'Friday',    ar: 'الجمعة'    }, time: '10:00 AM', available: true  },
];
