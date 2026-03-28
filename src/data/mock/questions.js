// TrackUp — Smart Assessment Questions
// Each option carries weights across career tracks.
// Higher weight = stronger signal for that track.

export const questions = [
  {
    id: 'q1',
    text: 'When you think about your ideal workday, which feels most natural?',
    textAr: 'عندما تتخيل يوم عمل مثالي، ماذا يبدو طبيعياً أكثر;',
    options: [
      { label: 'Building interfaces people use every day', labelAr: 'بناء واجهات يستخدمها الناس يومياً',        weights: { frontend: 5, ux: 3, backend: 1, data: 0, devops: 0 } },
      { label: 'Designing systems and solving complex logic',  labelAr: 'تصميم أنظمة وحل منطق معقد',              weights: { frontend: 1, ux: 0, backend: 5, data: 2, devops: 3 } },
      { label: 'Exploring patterns in data and telling stories',labelAr: 'استكشاف الأنماط في البيانات ورواية القصص',   weights: { frontend: 0, ux: 2, backend: 1, data: 5, devops: 0 } },
      { label: 'Understanding how users think and feel',       labelAr: 'فهم كيف يفكّر المستخدمون ويشعرون',         weights: { frontend: 2, ux: 5, backend: 0, data: 1, devops: 0 } },
    ],
  },
  {
    id: 'q2',
    text: 'What kind of problems do you find most satisfying to solve?',
    textAr: 'ما نوع المشكلات التي تجدها أكثر إرضاءاً لحلها;',
    options: [
      { label: 'Making something beautiful and fast',          labelAr: 'جعل شيء جميل وسريع',                              weights: { frontend: 5, ux: 4, backend: 0, data: 0, devops: 1 } },
      { label: 'Making systems more reliable at scale',        labelAr: 'جعل الأنظمة أكثر اطمئناناً على نطاق واسع',   weights: { frontend: 0, ux: 0, backend: 4, data: 1, devops: 5 } },
      { label: 'Finding the hidden answer in messy data',      labelAr: 'إيجاد الإجابة الخفية في بيانات فوضوية',       weights: { frontend: 0, ux: 1, backend: 2, data: 5, devops: 0 } },
      { label: 'Redesigning an experience so it just clicks',  labelAr: 'إعادة تصميم تجربة حتى تكون سلسة تماماً',   weights: { frontend: 3, ux: 5, backend: 0, data: 0, devops: 0 } },
    ],
  },
  {
    id: 'q3',
    text: 'Which of these describes how you like to think?',
    textAr: 'أيُ هذه يصف أسلوب تفكيرك;',
    options: [
      { label: 'I see things visually — layouts, colors, flow', labelAr: 'أفكّر بصرياً — تخطيطات وألوان وتدفق',     weights: { frontend: 4, ux: 5, backend: 0, data: 0, devops: 0 } },
      { label: 'I think in systems — inputs, outputs, rules',  labelAr: 'أفكّر بالأنظمة — مدخلات ومخرجات وقواعد',  weights: { frontend: 1, ux: 0, backend: 5, data: 3, devops: 4 } },
      { label: 'I ask why — data, evidence, logic chain',      labelAr: 'أسأل لماذا — بيانات وأدلة وسلسلة منطقية',  weights: { frontend: 0, ux: 2, backend: 2, data: 5, devops: 2 } },
      { label: 'I think of people — their needs, frustrations', labelAr: 'أفكّر في الناس — احتياجاتهم وإحباطاتهم',weights: { frontend: 2, ux: 5, backend: 0, data: 1, devops: 0 } },
    ],
  },
  {
    id: 'q4',
    text: 'Which outcome excites you most at the end of a project?',
    textAr: 'أي نتيجة تحمسك أكثر عند انتهاء مشروع;',
    options: [
      { label: 'A beautiful, responsive product that ships',   labelAr: 'منتج جميل وسريع الاستجابة يصل للمستخدمين', weights: { frontend: 5, ux: 3, backend: 1, data: 0, devops: 2 } },
      { label: 'A dashboard that tells a clear story',         labelAr: 'لوحة تحكم تحكي قصة واضحة',                       weights: { frontend: 1, ux: 2, backend: 0, data: 5, devops: 0 } },
      { label: 'An API that millions of requests rely on',     labelAr: 'واجهة تطبيقية يعتمد عليها ملايين طلب',       weights: { frontend: 0, ux: 0, backend: 5, data: 1, devops: 3 } },
      { label: 'A design that tested perfectly with real users',labelAr: 'تصميم أجتاز اختبار حقيقي بامتياز',           weights: { frontend: 2, ux: 5, backend: 0, data: 1, devops: 0 } },
    ],
  },
  {
    id: 'q5',
    text: 'How do you usually learn best?',
    textAr: 'كيف تتعلم عادةً بشكل أفضل;',
    options: [
      { label: 'Building things and seeing immediate output',  labelAr: 'بناء أشياء ورؤية النتيجة فوراً',              weights: { frontend: 5, ux: 3, backend: 3, data: 1, devops: 2 } },
      { label: 'Reading, studying, deep understanding first',  labelAr: 'القراءة والدراسة والفهم العميق أولاً',  weights: { frontend: 1, ux: 1, backend: 3, data: 4, devops: 2 } },
      { label: 'Sketching, wireframing, prototyping',          labelAr: 'رسم التخطيطات وبناء النماذج الأولية',        weights: { frontend: 2, ux: 5, backend: 0, data: 0, devops: 0 } },
      { label: 'Experimenting with data, charts, spreadsheets',labelAr: 'تجريب البيانات والرسومات وجداول البيانات',weights: { frontend: 0, ux: 1, backend: 1, data: 5, devops: 1 } },
    ],
  },
  {
    id: 'q6',
    text: 'Which technical area would you most like to go deep in?',
    textAr: 'في أي مجال تقني تريد التعمق أكثر;',
    options: [
      { label: 'CSS, animations, and browser rendering',       labelAr: 'أسلوب واجهات المستخدم والحركات وعرض المتصفح',weights: { frontend: 5, ux: 2, backend: 0, data: 0, devops: 0 } },
      { label: 'Databases, APIs, microservices architecture',  labelAr: 'قواعد البيانات وواجهات التطبيقات والخدمات المصغرة',weights: { frontend: 0, ux: 0, backend: 5, data: 2, devops: 3 } },
      { label: 'SQL, Python for analysis, BI tools',           labelAr: 'لغة الاستعلام وبايثون للتحليل وأدوات ذكاء الأعمال', weights: { frontend: 0, ux: 0, backend: 1, data: 5, devops: 0 } },
      { label: 'User research, interviews, and usability',     labelAr: 'بحث المستخدمين والمقابلات واختبار السهولة',  weights: { frontend: 1, ux: 5, backend: 0, data: 1, devops: 0 } },
    ],
  },
  {
    id: 'q7',
    text: 'When joining a team project, what role do you naturally fall into?',
    textAr: 'عند انضمامك لمشروع جماعي، ما الدور الذي تقع فيه تلقائياً;',
    options: [
      { label: 'The one who builds the visible product',       labelAr: 'من يبني المنتج المرئي',                              weights: { frontend: 5, ux: 2, backend: 1, data: 0, devops: 1 } },
      { label: 'The one who architects the system behind it',  labelAr: 'من يصمّم النظام خلفه',                             weights: { frontend: 1, ux: 0, backend: 5, data: 1, devops: 4 } },
      { label: 'The one who analyzes and presents findings',   labelAr: 'من يحلّل ويعرض النتائج',                        weights: { frontend: 0, ux: 2, backend: 0, data: 5, devops: 0 } },
      { label: 'The one who talks to users and shapes ideas',  labelAr: 'من يتحدث مع المستخدمين ويشكّل الأفكار',  weights: { frontend: 2, ux: 5, backend: 0, data: 1, devops: 0 } },
    ],
  },
];
