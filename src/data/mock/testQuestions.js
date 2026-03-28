export const MOCK_TEST_QUESTIONS = [
  {
    id: 'q1',
    text: 'What excites you most about technology?',
    textAr: 'ما الذي يثير اهتمامك أكثر في مجال التقنية؟',
    options: [
      { label: 'Building things people can see and interact with', labelAr: 'بناء أشياء يراها الناس ويتفاعلون معها', weight: { 'track-1': 3, 'track-4': 2 } },
      { label: 'Designing systems and APIs that power apps', labelAr: 'تصميم أنظمة APIs تدعم التطبيقات', weight: { 'track-2': 3 } },
      { label: 'Analyzing data and finding patterns', labelAr: 'تحليل البيانات وإيجاد الأنماط', weight: { 'track-3': 3 } },
      { label: 'Making apps beautiful and easy to use', labelAr: 'جعل التطبيقات جميلة وسهلة الاستخدام', weight: { 'track-4': 3, 'track-1': 1 } },
    ],
  },
  {
    id: 'q2',
    text: 'Which task sounds most like you?',
    textAr: 'أي مهمة تصفك أكثر؟',
    options: [
      { label: 'Writing HTML, CSS and making pages look great', labelAr: 'كتابة HTML وCSS وجعل الصفحات تبدو رائعة', weight: { 'track-1': 3 } },
      { label: 'Setting up servers, databases and endpoints', labelAr: 'إعداد الخوادم وقواعد البيانات', weight: { 'track-2': 3, 'track-5': 1 } },
      { label: 'Running analysis and building prediction models', labelAr: 'تشغيل التحليلات وبناء نماذج التنبؤ', weight: { 'track-3': 3 } },
      { label: 'Sketching wireframes and user flows', labelAr: 'رسم المخططات التقريبية وتدفقات المستخدم', weight: { 'track-4': 3 } },
    ],
  },
  {
    id: 'q3',
    text: 'What is your current experience level?',
    textAr: 'ما مستوى خبرتك الحالي؟',
    options: [
      { label: 'Complete beginner, no coding background', labelAr: 'مبتدئ تماماً، بدون خلفية برمجة', weight: { 'track-1': 2, 'track-4': 2 } },
      { label: 'Some basics, built small projects', labelAr: 'بعض الأساسيات، بنيت مشاريع صغيرة', weight: { 'track-1': 1, 'track-2': 1, 'track-3': 1 } },
      { label: 'Intermediate, working on real products', labelAr: 'متوسط، أعمل على منتجات حقيقية', weight: { 'track-2': 2, 'track-3': 2, 'track-5': 2 } },
      { label: 'Advanced, looking to specialize', labelAr: 'متقدم، أبحث عن التخصص', weight: { 'track-3': 2, 'track-5': 3 } },
    ],
  },
  {
    id: 'q4',
    text: 'How many hours per week can you dedicate to learning?',
    textAr: 'كم ساعة أسبوعياً يمكنك تخصيصها للتعلم؟',
    options: [
      { label: '1 to 5 hours', labelAr: 'من 1 إلى 5 ساعات', weight: { 'track-4': 2, 'track-1': 1 } },
      { label: '5 to 10 hours', labelAr: 'من 5 إلى 10 ساعات', weight: { 'track-1': 2, 'track-2': 2 } },
      { label: '10 to 20 hours', labelAr: 'من 10 إلى 20 ساعة', weight: { 'track-2': 2, 'track-3': 2, 'track-5': 2 } },
      { label: 'More than 20 hours', labelAr: 'أكثر من 20 ساعة', weight: { 'track-3': 2, 'track-5': 3 } },
    ],
  },
  {
    id: 'q5',
    text: 'What is your primary career goal?',
    textAr: 'ما هدفك المهني الرئيسي؟',
    options: [
      { label: 'Get a frontend developer job', labelAr: 'الحصول على وظيفة مطور واجهات أمامية', weight: { 'track-1': 3 } },
      { label: 'Become a full-stack or backend engineer', labelAr: 'أصبح مهندساً متكاملاً أو خلفياً', weight: { 'track-2': 3, 'track-5': 1 } },
      { label: 'Work in AI, analytics or research', labelAr: 'العمل في الذكاء الاصطناعي أو التحليلات', weight: { 'track-3': 3 } },
      { label: 'Design products at a startup or agency', labelAr: 'تصميم منتجات في شركة ناشئة أو وكالة', weight: { 'track-4': 3 } },
    ],
  },
];
