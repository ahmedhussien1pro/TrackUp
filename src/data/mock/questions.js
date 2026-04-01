// TrackUp — Career Assessment Questions
// Aligned with Electrical Engineering tracks: Power / Embedded / Communications / Career Shift
// Each option carries weights across the 4 tracks.

export const questions = [
  {
    id: 'q1',
    text: 'What type of work feels most natural to you?',
    textAr: 'أي نوع من الشغل يبدو طبيعياً أكثر بالنسبالك؟',
    options: [
      { label: 'Hands-on physical work — site, machines, hardware',  labelAr: 'شغل عملي ميداني — موقع، آلات، هاردوير',  weights: { power: 5, embedded: 3, communications: 3, 'career-shift': 1 } },
      { label: 'Writing code and building software logic',           labelAr: 'كتابة كود وبناء منطق برمجي',               weights: { power: 0, embedded: 5, communications: 2, 'career-shift': 2 } },
      { label: 'Analysing signals, data, and network behaviour',     labelAr: 'تحليل إشارات وبيانات وسلوك شبكات',         weights: { power: 2, embedded: 2, communications: 5, 'career-shift': 1 } },
      { label: 'Learning new skills and transitioning into tech',    labelAr: 'تعلّم مهارات جديدة والانتقال للتقنية',       weights: { power: 1, embedded: 2, communications: 1, 'career-shift': 5 } },
    ],
  },
  {
    id: 'q2',
    text: 'How do you feel about programming?',
    textAr: 'إيه رأيك في البرمجة؟',
    options: [
      { label: 'Love it — I can spend hours writing code',           labelAr: 'بحبها جداً — أقدر أقضي ساعات بكتب كود',    weights: { power: 0, embedded: 5, communications: 2, 'career-shift': 2 } },
      { label: 'It is okay — useful tool but not my main focus',     labelAr: 'مش مشكلة — أداة مفيدة بس مش أساسية عندي',  weights: { power: 2, embedded: 3, communications: 4, 'career-shift': 3 } },
      { label: 'Not really my thing — I prefer physical work',       labelAr: 'مش متحمس — بفضّل الشغل الميداني',            weights: { power: 5, embedded: 1, communications: 2, 'career-shift': 1 } },
      { label: 'Still exploring — open to learning anything',        labelAr: 'لسه بستكشف — منفتح على تعلّم أي حاجة',      weights: { power: 1, embedded: 2, communications: 2, 'career-shift': 5 } },
    ],
  },
  {
    id: 'q3',
    text: 'Where do you prefer to work most of the time?',
    textAr: 'تفضّل تشتغل فين معظم الوقت؟',
    options: [
      { label: 'In the field — construction sites, substations, plants', labelAr: 'ميداني — مواقع بناء، محطات توزيع، مصانع', weights: { power: 5, embedded: 1, communications: 2, 'career-shift': 1 } },
      { label: 'In a lab or workshop — building and testing prototypes',  labelAr: 'في معمل أو ورشة — تركيب واختبار نماذج',   weights: { power: 2, embedded: 5, communications: 2, 'career-shift': 2 } },
      { label: 'In an office — planning, designing, and analysing',       labelAr: 'في مكتب — تخطيط وتصميم وتحليل',           weights: { power: 1, embedded: 2, communications: 4, 'career-shift': 4 } },
      { label: 'Mix of everything — flexible based on the task',          labelAr: 'مزيج من كل حاجة — مرن حسب المهمة',         weights: { power: 2, embedded: 3, communications: 3, 'career-shift': 3 } },
    ],
  },
  {
    id: 'q4',
    text: 'What is your primary goal right now?',
    textAr: 'إيه هدفك الأساسي دلوقتي؟',
    options: [
      { label: 'Maximize income — I want the highest-paying path',    labelAr: 'أعظّم الدخل — عايز أعلى مسار دخلاً',         weights: { power: 3, embedded: 5, communications: 3, 'career-shift': 1 } },
      { label: 'Job stability — secure employment in a solid sector', labelAr: 'استقرار وظيفي — توظيف مضمون في قطاع قوي',   weights: { power: 5, embedded: 3, communications: 4, 'career-shift': 2 } },
      { label: 'Travel and work abroad — global opportunities',       labelAr: 'سفر وعمل في الخارج — فرص عالمية',             weights: { power: 3, embedded: 5, communications: 4, 'career-shift': 2 } },
      { label: 'Career change — I am starting fresh in engineering',  labelAr: 'تغيير مسار — بدأ من جديد في الهندسة',         weights: { power: 1, embedded: 2, communications: 1, 'career-shift': 5 } },
    ],
  },
  {
    id: 'q5',
    text: 'Can you handle high-pressure, high-responsibility work?',
    textAr: 'تقدر تتحمل ضغط وظيفي ومسؤولية عالية؟',
    options: [
      { label: 'Yes — I thrive under pressure and responsibility',    labelAr: 'نعم — بزهر تحت الضغط والمسؤولية',             weights: { power: 5, embedded: 4, communications: 3, 'career-shift': 2 } },
      { label: 'Moderate — I manage well with the right support',     labelAr: 'متوسط — بتعامل معاه بالدعم الصح',              weights: { power: 2, embedded: 3, communications: 4, 'career-shift': 3 } },
      { label: 'I prefer steady, predictable work pace',              labelAr: 'بفضّل وتيرة عمل منتظمة وقابلة للتوقع',         weights: { power: 1, embedded: 2, communications: 3, 'career-shift': 4 } },
      { label: 'Still figuring out my tolerance level',               labelAr: 'لسه بحدد مستوى تحملي',                         weights: { power: 1, embedded: 2, communications: 2, 'career-shift': 5 } },
    ],
  },
  {
    id: 'q6',
    text: 'How do you prefer to work on projects?',
    textAr: 'بتفضّل تشتغل على مشاريع إزاي؟',
    options: [
      { label: 'Solo — I focus best when working independently',      labelAr: 'منفرد — بتركز أكثر لما بشتغل لوحدي',          weights: { power: 2, embedded: 5, communications: 2, 'career-shift': 2 } },
      { label: 'Small team — close collaboration, clear roles',       labelAr: 'فريق صغير — تعاون وثيق وأدوار واضحة',          weights: { power: 3, embedded: 4, communications: 4, 'career-shift': 3 } },
      { label: 'Large team — big projects, many stakeholders',        labelAr: 'فريق كبير — مشاريع ضخمة وأصحاب مصلحة كثيرين', weights: { power: 5, embedded: 2, communications: 4, 'career-shift': 2 } },
      { label: 'Any setup — I adapt to what the project needs',       labelAr: 'أي ترتيب — بتأقلم مع احتياجات المشروع',          weights: { power: 2, embedded: 2, communications: 3, 'career-shift': 5 } },
    ],
  },
  {
    id: 'q7',
    text: 'Which excites you most when you imagine your future work?',
    textAr: 'أي حاجة بتحمسك أكثر لما بتتخيل شغلك في المستقبل؟',
    options: [
      { label: 'Managing power grids and energy infrastructure',      labelAr: 'إدارة شبكات الكهرباء والبنية التحتية للطاقة',  weights: { power: 5, embedded: 1, communications: 2, 'career-shift': 0 } },
      { label: 'Programming a small device that solves a real problem',labelAr: 'برمجة جهاز صغير يحل مشكلة حقيقية',            weights: { power: 0, embedded: 5, communications: 2, 'career-shift': 2 } },
      { label: 'Building the network connecting millions of people',  labelAr: 'بناء الشبكة التي تربط ملايين الناس',             weights: { power: 2, embedded: 2, communications: 5, 'career-shift': 1 } },
      { label: 'Breaking into engineering from a different background',labelAr: 'الدخول للهندسة من خلفية مختلفة',               weights: { power: 1, embedded: 2, communications: 1, 'career-shift': 5 } },
    ],
  },
];
