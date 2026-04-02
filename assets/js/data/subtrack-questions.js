// Sub-track test: shown AFTER mentor session
// Electrical expanded to 20 questions for TrackUp MVP

window.SUBTRACK_QUESTIONS = {
  electrical: [
    {
      id: 'e1',
      en: 'What type of work excites you most?',
      ar: 'إيه نوع الشغل اللي يحمسك أكتر؟',
      options: [
        { en: 'Designing and connecting power grids', ar: 'تصميم شبكات القوى وتوصيلها', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Programming microcontrollers and sensors', ar: 'برمجة المتحكمات الدقيقة والحساسات', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Designing wireless and communication systems', ar: 'تصميم أنظمة الاتصالات والشبكات اللاسلكية', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e2',
      en: 'How do you prefer to work?',
      ar: 'بتحب تشتغل فين أكتر؟',
      options: [
        { en: 'On-site with large infrastructure projects', ar: 'في مواقع مشاريع بنية تحتية كبيرة', scores: { power: 3, embedded: 0, communications: 1 } },
        { en: 'In a lab building and testing small devices', ar: 'في معمل أبني وأختبر أجهزة صغيرة', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Behind a computer doing signal analysis', ar: 'على الكمبيوتر أحلل إشارات وبيانات', scores: { power: 0, embedded: 1, communications: 3 } }
      ]
    },
    {
      id: 'e3',
      en: 'Which tool would you most enjoy mastering?',
      ar: 'أيه الأداة اللي حابب تحترف فيها؟',
      options: [
        { en: 'ETAP / AutoCAD Electrical', ar: 'ETAP / AutoCAD Electrical', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Arduino / STM32 / Keil', ar: 'Arduino / STM32 / Keil', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'MATLAB / Simulink / NS3', ar: 'MATLAB / Simulink / NS3', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e4',
      en: 'What kind of problem motivates you?',
      ar: 'نوع المشكلة اللي بتحفزك هي إيه؟',
      options: [
        { en: 'Reducing energy loss in power networks', ar: 'تقليل فقدان الطاقة في الشبكات', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Making a hardware device smarter', ar: 'تحويل جهاز إلى منتج أذكى', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Improving signal quality and coverage', ar: 'تحسين جودة الإشارة ونطاق التغطية', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e5',
      en: 'Where do you see yourself working in 5 years?',
      ar: 'شايف نفسك فين بعد 5 سنين؟',
      options: [
        { en: 'Utility company or renewable energy firm', ar: 'شركة طاقة أو طاقة متجددة', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'IoT startup or automotive R&D', ar: 'شركة IoT ناشئة أو بحث سيارات', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Telecom operator or network equipment firm', ar: 'شركة اتصالات أو معدات شبكات', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e6',
      en: 'What do you enjoy learning first?',
      ar: 'إيه اللي تحب تبدأ تتعلمه أولًا؟',
      options: [
        { en: 'Protection relays and SCADA', ar: 'أنظمة الحماية وSCADA', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'C programming and register-level control', ar: 'برمجة C والتحكم منخفض المستوى', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Signals, modulation, and RF basics', ar: 'الإشارات والتضمين وRF', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e7',
      en: 'Which environment suits you best?',
      ar: 'أي بيئة تناسبك أكثر؟',
      options: [
        { en: 'Plants, substations, and field operations', ar: 'محطات ومواقع وتشغيل ميداني', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Boards, chips, and lab debugging', ar: 'بوردات وشرائح وDebugging في المعمل', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Network planning and wireless systems', ar: 'تخطيط الشبكات والأنظمة اللاسلكية', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e8',
      en: 'Which output gives you the most satisfaction?',
      ar: 'أي ناتج يعطيك أكبر إحساس بالإنجاز؟',
      options: [
        { en: 'A stable and efficient power system', ar: 'نظام قوى مستقر وفعّال', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'A working smart device or firmware feature', ar: 'جهاز ذكي أو ميزة Firmware شغالة', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'A stronger wireless link or optimized network', ar: 'رابط لاسلكي أقوى أو شبكة أفضل', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e9',
      en: 'What kind of math do you tolerate more?',
      ar: 'أي نوع رياضيات تتقبله أكثر؟',
      options: [
        { en: 'Power flow and system calculations', ar: 'حسابات القدرة وتدفق الطاقة', scores: { power: 3, embedded: 0, communications: 1 } },
        { en: 'Logic, timing, and low-level control', ar: 'المنطق والتوقيت والتحكم منخفض المستوى', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Signals, noise, and frequency analysis', ar: 'الإشارات والضوضاء وتحليل التردد', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e10',
      en: 'Which graduation project sounds best?',
      ar: 'أي مشروع تخرج يحمسك أكثر؟',
      options: [
        { en: 'Smart grid or solar distribution system', ar: 'شبكة ذكية أو نظام توزيع شمسي', scores: { power: 3, embedded: 0, communications: 1 } },
        { en: 'Autonomous robot or IoT control system', ar: 'روبوت ذاتي أو نظام تحكم IoT', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: '5G simulation or antenna optimization', ar: 'محاكاة 5G أو تحسين هوائي', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e11',
      en: 'Which market feels closer to you?',
      ar: 'أي سوق عمل تشعر أنه أقرب لك؟',
      options: [
        { en: 'Energy, renewables, and utilities', ar: 'الطاقة والمتجددة والمرافق', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Automotive, medical devices, and IoT', ar: 'السيارات والأجهزة الطبية وIoT', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Telecom, networking, and RF systems', ar: 'الاتصالات والشبكات وRF', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e12',
      en: 'What type of debugging do you enjoy?',
      ar: 'أي نوع Debugging تستمتع به أكثر؟',
      options: [
        { en: 'Tracing load issues and protection faults', ar: 'تتبع الأحمال وأخطاء الحماية', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Fixing firmware bugs and hardware interfaces', ar: 'إصلاح Bugs الفيرموير والـ interfaces', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Improving dropped signals and interference', ar: 'حل سقوط الإشارة والتداخل', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e13',
      en: 'Which phrase sounds most like your ideal job?',
      ar: 'أي عبارة تشبه وظيفتك المثالية؟',
      options: [
        { en: 'Reliable energy for real systems', ar: 'طاقة موثوقة لأنظمة حقيقية', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Smart control inside physical products', ar: 'تحكم ذكي داخل منتجات حقيقية', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Fast and stable connectivity everywhere', ar: 'اتصال سريع ومستقر في كل مكان', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e14',
      en: 'Which hardware interests you more?',
      ar: 'أي هاردوير يلفت انتباهك أكثر؟',
      options: [
        { en: 'Transformers, breakers, and switchgear', ar: 'المحولات والقواطع والسويتشجير', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'MCUs, sensors, and development boards', ar: 'المتحكمات والحساسات والبوردات', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Routers, antennas, and RF modules', ar: 'الراوترات والهوائيات ووحدات RF', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e15',
      en: 'What kind of success matters more to you?',
      ar: 'أي نوع نجاح يهمك أكثر؟',
      options: [
        { en: 'Keeping a system safe, stable, and efficient', ar: 'الحفاظ على نظام آمن ومستقر وفعّال', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Shipping a product that reacts intelligently', ar: 'إطلاق منتج يتفاعل بذكاء', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Delivering better coverage and communication quality', ar: 'تقديم تغطية وجودة اتصال أفضل', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e16',
      en: 'Which topic would you watch for hours?',
      ar: 'أي موضوع ممكن تتابعه لساعات؟',
      options: [
        { en: 'Renewable integration and protection schemes', ar: 'دمج الطاقة المتجددة وأنظمة الحماية', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'RTOS, drivers, and firmware architecture', ar: 'RTOS وDrivers وهيكلة الـ Firmware', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Cellular systems, antennas, and RF planning', ar: 'الأنظمة الخلوية والهوائيات وتخطيط RF', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e17',
      en: 'What type of responsibility do you prefer?',
      ar: 'أي نوع مسؤولية تفضله؟',
      options: [
        { en: 'Maintaining large-scale energy reliability', ar: 'الحفاظ على موثوقية الطاقة على نطاق واسع', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Making the product itself behave correctly', ar: 'ضبط سلوك المنتج نفسه بشكل صحيح', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Ensuring users stay connected clearly', ar: 'ضمان اتصال المستخدمين بوضوح واستمرار', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e18',
      en: 'Which challenge feels more exciting?',
      ar: 'أي تحدي تشعر أنه أكثر إثارة؟',
      options: [
        { en: 'Balancing loads and protecting equipment', ar: 'موازنة الأحمال وحماية المعدات', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Optimizing memory, timing, and device control', ar: 'تحسين الذاكرة والتوقيت والتحكم', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Reducing latency and improving signal strength', ar: 'تقليل الـ latency وتحسين الإشارة', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e19',
      en: 'Which mentor would you learn from first?',
      ar: 'أي نوع مرشد تحب تتعلم منه أولًا؟',
      options: [
        { en: 'A power systems engineer in utilities', ar: 'مهندس قوى يعمل في شركات الطاقة', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'An embedded engineer building devices', ar: 'مهندس Embedded يبني أجهزة', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'A telecom engineer working on wireless systems', ar: 'مهندس اتصالات يعمل على الأنظمة اللاسلكية', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e20',
      en: 'At the end of the day, what do you want to build?',
      ar: 'في النهاية، ماذا تريد أن تبني؟',
      options: [
        { en: 'A stronger energy infrastructure', ar: 'بنية تحتية أقوى للطاقة', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'A smart product with reliable firmware', ar: 'منتج ذكي بفيرموير موثوق', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'A better connected communication system', ar: 'نظام اتصالات أكثر كفاءة واتصالًا', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    }
  ],
  software: window.SUBTRACK_QUESTIONS?.software || [],
  mechanical: window.SUBTRACK_QUESTIONS?.mechanical || [],
  civil: window.SUBTRACK_QUESTIONS?.civil || []
};

window.SUBTRACK_PLATFORMS = {
  power:          { nameEn: 'Power Systems',        nameAr: 'أنظمة القوى',          platforms: ['ITI', 'Udemy', 'Coursera', 'EEU Egypt'] },
  embedded:       { nameEn: 'Embedded Systems',     nameAr: 'الأنظمة المدمجة',      platforms: ['ITI', 'Udemy', 'YouTube', 'Embedded Online'] },
  communications: { nameEn: 'Communications',       nameAr: 'الاتصالات',            platforms: ['Coursera', 'Udemy', 'YouTube', 'IEEE Courses'] },
  frontend:       { nameEn: 'Frontend Development', nameAr: 'تطوير الواجهات',       platforms: ['The Odin Project', 'Frontend Masters', 'Udemy', 'YouTube'] },
  backend:        { nameEn: 'Backend Development',  nameAr: 'تطوير الباك إند',      platforms: ['ITI', 'Udemy', 'roadmap.sh', 'YouTube'] },
  data:           { nameEn: 'Data Science / ML',    nameAr: 'علم البيانات',         platforms: ['Kaggle', 'Coursera', 'fast.ai', 'DataCamp'] },
  cyber:          { nameEn: 'Cybersecurity',        nameAr: 'الأمن السيبراني',      platforms: ['TryHackMe', 'Hack The Box', 'Cybrary', 'ITI'] },
  design:         { nameEn: 'Mechanical Design',    nameAr: 'تصميم ميكانيكي',       platforms: ['Udemy', 'Coursera', 'YouTube', 'CADSystems Egypt'] },
  manufacturing:  { nameEn: 'Manufacturing Eng.',   nameAr: 'هندسة تصنيع',          platforms: ['ITI', 'Udemy', 'YouTube', 'SME Courses'] },
  thermal:        { nameEn: 'Thermal / Fluids',     nameAr: 'حراري وموائع',         platforms: ['Coursera', 'Udemy', 'YouTube', 'ASME Courses'] },
  structural:     { nameEn: 'Structural Eng.',      nameAr: 'هندسة إنشائية',        platforms: ['Udemy', 'Coursera', 'YouTube', 'ESRI Egypt'] },
  water:          { nameEn: 'Water Resources',      nameAr: 'موارد مائية',          platforms: ['Coursera', 'Udemy', 'YouTube', 'IWMI Courses'] },
  geotechnical:   { nameEn: 'Geotechnical Eng.',    nameAr: 'هندسة جيوتقنية',       platforms: ['Udemy', 'YouTube', 'Coursera', 'ISSMGE Courses'] }
};
