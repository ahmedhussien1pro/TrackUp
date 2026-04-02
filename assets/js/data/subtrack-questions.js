// Sub-track test: shown AFTER mentor session
// 4 fields x 5 questions each = 20 total
// Each question has options scored per sub-track

window.SUBTRACK_QUESTIONS = {
  electrical: [
    {
      id: 'e1',
      en: 'What type of work excites you most?',
      ar: 'إيه نوع الشغل اللي يحمسك أكتر؟',
      options: [
        { en: 'Designing and connecting power grids',      ar: 'تصميم شبكات القوى وتوصيلها',    scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Programming microcontrollers and sensors',  ar: 'برمجة المتحكمات الدقيقة والحساسات', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Designing wireless and communication systems', ar: 'تصميم أنظمة الاتصالات والشبكات اللاسلكية', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e2',
      en: 'How do you prefer to work?',
      ar: 'بتحب تشتغل عازل ولا في فريق؟',
      options: [
        { en: 'On-site with large infrastructure projects', ar: 'في مواقع مشاريع بنية تحتية كبيرة', scores: { power: 3, embedded: 0, communications: 1 } },
        { en: 'In a lab building and testing small devices',  ar: 'في معمل أبني وأختبر أجهزة صغيرة', scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Behind a computer doing signal analysis',    ar: 'على الحاسوب أحلل إشارات وبيانات', scores: { power: 0, embedded: 1, communications: 3 } }
      ]
    },
    {
      id: 'e3',
      en: 'Which tool would you most enjoy mastering?',
      ar: 'أيه الأداة اللي حابب تحترف فيها؟',
      options: [
        { en: 'ETAP / AutoCAD Electrical',   ar: 'ETAP / AutoCAD Electrical', scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Arduino / STM32 / Keil',      ar: 'Arduino / STM32 / Keil',    scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'MATLAB / Simulink / NS3',     ar: 'MATLAB / Simulink / NS3',   scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e4',
      en: 'What kind of problem motivates you?',
      ar: 'نوع المشكلة اللي بتحفزك هي إيه؟',
      options: [
        { en: 'Reducing energy loss in power networks',   ar: 'تقليل فقدان الطاقة في شبكات التوزيع',   scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'Making a hardware device smarter',         ar: 'جعل جهاز أكثر ذكاءً وكفاءةً',          scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Improving signal quality and coverage',    ar: 'تحسين جودة الإشارة ونطاق التغطية',    scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    },
    {
      id: 'e5',
      en: 'Where do you see yourself working in 5 years?',
      ar: 'شايف نفسك فين بعد 5 سنين؟',
      options: [
        { en: 'Utility company or renewable energy firm',  ar: 'شركة طاقة أو طاقة متجددة',     scores: { power: 3, embedded: 0, communications: 0 } },
        { en: 'IoT startup or automotive R&D',             ar: 'شركة IoT ناشئة أو بحث سيارات',    scores: { power: 0, embedded: 3, communications: 0 } },
        { en: 'Telecom operator or network equipment firm', ar: 'شركة اتصالات أو معدات شبكات', scores: { power: 0, embedded: 0, communications: 3 } }
      ]
    }
  ],
  software: [
    {
      id: 's1',
      en: 'Which task sounds most like you?',
      ar: 'أيه المهمة اللي تحس إنها بتعبرك؟',
      options: [
        { en: 'Building what users see and interact with',  ar: 'بناء ما يراه ويتفاعل معه المستخدم', scores: { frontend: 3, backend: 0, data: 0, cyber: 0 } },
        { en: 'Building APIs, databases, and server logic',  ar: 'بناء APIs وقواعد بيانات ومنطق السيرفر', scores: { frontend: 0, backend: 3, data: 0, cyber: 0 } },
        { en: 'Analysing data and building ML models',      ar: 'تحليل البيانات وبناء نماذج ذكاء اصطناعي', scores: { frontend: 0, backend: 0, data: 3, cyber: 0 } },
        { en: 'Finding and fixing security vulnerabilities', ar: 'كشف وإصلاح ثغرات الأمن', scores: { frontend: 0, backend: 0, data: 0, cyber: 3 } }
      ]
    },
    {
      id: 's2',
      en: 'Pick the one you enjoy more:',
      ar: 'اختار اللي تحبه أكتر؟',
      options: [
        { en: 'CSS animations and pixel-perfect layouts', ar: 'تصميم واجهات دقيقة وجميلة', scores: { frontend: 3, backend: 0, data: 0, cyber: 0 } },
        { en: 'Optimising SQL queries and system performance', ar: 'تحسين استعلامات SQL وأداء السيستم', scores: { frontend: 0, backend: 3, data: 1, cyber: 0 } },
        { en: 'Exploring patterns in large datasets',      ar: 'استكشاف أنماط في بيانات ضخمة', scores: { frontend: 0, backend: 0, data: 3, cyber: 0 } },
        { en: 'Ethical hacking and penetration testing',   ar: 'اختبار الاختراق والاختبارات الأمنية', scores: { frontend: 0, backend: 0, data: 0, cyber: 3 } }
      ]
    },
    {
      id: 's3',
      en: 'What achievement would make you most proud?',
      ar: 'أيه إنجاز هيجفخرك أكتر؟',
      options: [
        { en: 'Shipping a beautiful mobile app millions use', ar: 'إطلاق تطبيق جميل يستخدمه ملايين', scores: { frontend: 3, backend: 0, data: 0, cyber: 0 } },
        { en: 'Designing a scalable backend that never goes down', ar: 'بناء سيرفر قوي لا يتوقف', scores: { frontend: 0, backend: 3, data: 0, cyber: 0 } },
        { en: 'Building a model that predicts something useful', ar: 'بناء نموذج يتوقع شيء مفيد', scores: { frontend: 0, backend: 0, data: 3, cyber: 0 } },
        { en: 'Protecting a company from a real cyberattack', ar: 'حماية شركة من هجوم إلكتروني حقيقي', scores: { frontend: 0, backend: 0, data: 0, cyber: 3 } }
      ]
    },
    {
      id: 's4',
      en: 'Which do you value more in a job?',
      ar: 'إيه أهم لك في الشغل؟',
      options: [
        { en: 'Creative freedom and visible results', ar: 'حرية إبداعية ونتائج مرئية', scores: { frontend: 3, backend: 0, data: 0, cyber: 0 } },
        { en: 'Reliability, architecture, and performance', ar: 'استقرارية وهيكلية وأداء',  scores: { frontend: 0, backend: 3, data: 0, cyber: 0 } },
        { en: 'Curiosity and research-driven work',    ar: 'فضول وبحث واكتشاف',                scores: { frontend: 0, backend: 0, data: 3, cyber: 0 } },
        { en: 'High-stakes security and defence work', ar: 'أمان وحماية على مستوى عالي', scores: { frontend: 0, backend: 0, data: 0, cyber: 3 } }
      ]
    },
    {
      id: 's5',
      en: 'What do you enjoy learning most?',
      ar: 'إيه اللي تحب تتعلمه أكتر؟',
      options: [
        { en: 'React, Tailwind, UX design principles', ar: 'React وTailwind ومبادئ تجربة المستخدم', scores: { frontend: 3, backend: 0, data: 0, cyber: 0 } },
        { en: 'Node.js, system design, databases',     ar: 'Node.js وتصميم الأنظمة وقواعد البيانات', scores: { frontend: 0, backend: 3, data: 0, cyber: 0 } },
        { en: 'Python, statistics, machine learning',  ar: 'Python وإحصاء وتعلم آلة',       scores: { frontend: 0, backend: 0, data: 3, cyber: 0 } },
        { en: 'CTF challenges, OWASP, network security', ar: 'تحديات CTF وOWASP وأمن الشبكات', scores: { frontend: 0, backend: 0, data: 0, cyber: 3 } }
      ]
    }
  ],
  mechanical: [
    {
      id: 'm1',
      en: 'Which area pulls you more?',
      ar: 'أيه المجال يجذبك أكتر؟',
      options: [
        { en: 'Designing parts and assemblies in CAD',      ar: 'تصميم قطع وتجميعات بال**CAD**', scores: { design: 3, manufacturing: 0, thermal: 0 } },
        { en: 'Working on production lines and processes',  ar: 'العمل على خطوط الإنتاج والعمليات', scores: { design: 0, manufacturing: 3, thermal: 0 } },
        { en: 'Analysing heat transfer and fluid flow',     ar: 'تحليل انتقال الحرارة وجريان الموائع', scores: { design: 0, manufacturing: 0, thermal: 3 } }
      ]
    },
    {
      id: 'm2',
      en: 'Which software would you rather master?',
      ar: 'أيه البرنامج اللي تحب تحترف فيه؟',
      options: [
        { en: 'CATIA / SolidWorks / ANSYS Structural', ar: 'CATIA / SolidWorks / ANSYS', scores: { design: 3, manufacturing: 0, thermal: 0 } },
        { en: 'CAM / CNC programming / ERP systems',   ar: 'CAM / برمجة CNC / أنظمة ERP', scores: { design: 0, manufacturing: 3, thermal: 0 } },
        { en: 'ANSYS Fluent / MATLAB / CFD tools',     ar: 'ANSYS Fluent / MATLAB / CFD', scores: { design: 0, manufacturing: 0, thermal: 3 } }
      ]
    },
    {
      id: 'm3',
      en: 'What project would you enjoy most?',
      ar: 'أيه المشروع اللي هتستمتع بيه أكتر؟',
      options: [
        { en: 'Designing a lightweight car chassis', ar: 'تصميم هيكل سيارة خفيف الوزن', scores: { design: 3, manufacturing: 0, thermal: 0 } },
        { en: 'Optimising a factory assembly line',   ar: 'تحسين خط تجميع في مصنع', scores: { design: 0, manufacturing: 3, thermal: 0 } },
        { en: 'Simulating airflow over a turbine',    ar: 'محاكاة تدفق الهواء حول توربين', scores: { design: 0, manufacturing: 0, thermal: 3 } }
      ]
    },
    {
      id: 'm4',
      en: 'Which industry interests you?',
      ar: 'أيه الصناعة اللي تشدك؟',
      options: [
        { en: 'Aerospace / defence / automotive R&D',  ar: 'طيران / دفاع / بحث سيارات', scores: { design: 3, manufacturing: 0, thermal: 1 } },
        { en: 'Heavy industry / construction equipment', ar: 'صناعة ثقيلة / معدات بناء', scores: { design: 0, manufacturing: 3, thermal: 0 } },
        { en: 'Oil & gas / power generation / HVAC',  ar: 'بترول / توليد طاقة / HVAC', scores: { design: 0, manufacturing: 0, thermal: 3 } }
      ]
    },
    {
      id: 'm5',
      en: 'How do you prefer to verify your work?',
      ar: 'كيف بتحب تتحقق من شغلك؟',
      options: [
        { en: 'FEA simulation and stress analysis',    ar: 'محاكاة FEA وتحليل الإجهادات', scores: { design: 3, manufacturing: 0, thermal: 0 } },
        { en: 'Physical prototyping and QC testing',   ar: 'نماذج حقيقية وتحكم بالجودة', scores: { design: 0, manufacturing: 3, thermal: 0 } },
        { en: 'CFD simulations and thermodynamic calculations', ar: 'محاكاة CFD وحسابات ديناميكا حرارية', scores: { design: 0, manufacturing: 0, thermal: 3 } }
      ]
    }
  ],
  civil: [
    {
      id: 'c1',
      en: 'Which type of project excites you most?',
      ar: 'أيه نوع المشروع اللي يحمسك؟',
      options: [
        { en: 'Designing buildings and bridges',        ar: 'تصميم مباني وكباري', scores: { structural: 3, water: 0, geotechnical: 0 } },
        { en: 'Designing dams and water networks',      ar: 'تصميم سدود وشبكات مياه', scores: { structural: 0, water: 3, geotechnical: 0 } },
        { en: 'Analysing soil and foundation stability', ar: 'تحليل التربة واستقرارية الأساسات', scores: { structural: 0, water: 0, geotechnical: 3 } }
      ]
    },
    {
      id: 'c2',
      en: 'Which software do you want to master?',
      ar: 'أيه البرنامج اللي تحب تتعلمه؟',
      options: [
        { en: 'SAP2000 / ETABS / Revit Structure',   ar: 'SAP2000 / ETABS / Revit', scores: { structural: 3, water: 0, geotechnical: 0 } },
        { en: 'EPANET / WaterCAD / HEC-RAS',         ar: 'EPANET / WaterCAD / HEC-RAS', scores: { structural: 0, water: 3, geotechnical: 0 } },
        { en: 'PLAXIS / GeoStudio / FLAC',           ar: 'PLAXIS / GeoStudio / FLAC', scores: { structural: 0, water: 0, geotechnical: 3 } }
      ]
    },
    {
      id: 'c3',
      en: 'What kind of problem motivates you?',
      ar: 'أيه نوع المشكلة بيحفزك؟',
      options: [
        { en: 'Making structures earthquake-resistant', ar: 'جعل المنشآت مقاومة للزلازل', scores: { structural: 3, water: 0, geotechnical: 0 } },
        { en: 'Solving water scarcity with smart networks', ar: 'حل شح المياه بشبكات ذكية', scores: { structural: 0, water: 3, geotechnical: 0 } },
        { en: 'Preventing landslides and foundation failures', ar: 'منع انهيار التربة وفشل الأساسات', scores: { structural: 0, water: 0, geotechnical: 3 } }
      ]
    },
    {
      id: 'c4',
      en: 'Where do you see yourself working?',
      ar: 'فين شايف نفسك بتشتغل؟',
      options: [
        { en: 'Real estate developer or consultancy firm', ar: 'شركة مقاولات أو استشارات إنشاءية', scores: { structural: 3, water: 0, geotechnical: 0 } },
        { en: 'Ministry of Irrigation or water authority', ar: 'وزارة الري أو هيئة مياه', scores: { structural: 0, water: 3, geotechnical: 0 } },
        { en: 'Major infrastructure or tunnelling firm',  ar: 'شركة بنية تحتية أو أنفاق', scores: { structural: 0, water: 0, geotechnical: 3 } }
      ]
    },
    {
      id: 'c5',
      en: 'Which skill do you want to develop most?',
      ar: 'أيه المهارة اللي تحب تطورها أكتر؟',
      options: [
        { en: 'Structural analysis and BIM modelling',     ar: 'تحليل إنشائي ونمذجة BIM', scores: { structural: 3, water: 0, geotechnical: 0 } },
        { en: 'Hydraulic modelling and flood management',  ar: 'نمذجة هيدروليكية وإدارة الفيضانات', scores: { structural: 0, water: 3, geotechnical: 0 } },
        { en: 'Soil testing and retaining wall design',    ar: 'اختبار التربة وتصميم جدران الاستناد', scores: { structural: 0, water: 0, geotechnical: 3 } }
      ]
    }
  ]
};

// Platform recommendations per sub-track
window.SUBTRACK_PLATFORMS = {
  // Electrical sub-tracks
  power:          { nameEn: 'Power Systems', nameAr: 'أنظمة القوى',       platforms: ['ITI', 'Udemy', 'Coursera', 'EEU Egypt'] },
  embedded:       { nameEn: 'Embedded Systems', nameAr: 'أنظمة مدمجة',    platforms: ['ITI', 'Udemy', 'YouTube', 'Embedded Online'] },
  communications: { nameEn: 'Communications',  nameAr: 'اتصالات',                    platforms: ['Coursera', 'Udemy', 'YouTube', 'IEEE Courses'] },
  // Software sub-tracks
  frontend:  { nameEn: 'Frontend Development', nameAr: 'تطوير واجهات', platforms: ['The Odin Project', 'Frontend Masters', 'Udemy', 'YouTube'] },
  backend:   { nameEn: 'Backend Development',  nameAr: 'تطوير سيرفر',    platforms: ['ITI', 'Udemy', 'roadmap.sh', 'YouTube'] },
  data:      { nameEn: 'Data Science / ML',     nameAr: 'علم البيانات',  platforms: ['Kaggle', 'Coursera', 'fast.ai', 'DataCamp'] },
  cyber:     { nameEn: 'Cybersecurity',         nameAr: 'أمن معلومات',     platforms: ['TryHackMe', 'Hack The Box', 'Cybrary', 'ITI'] },
  // Mechanical sub-tracks
  design:        { nameEn: 'Mechanical Design', nameAr: 'تصميم ميكانيكي', platforms: ['Udemy', 'Coursera', 'YouTube', 'CADSystems Egypt'] },
  manufacturing: { nameEn: 'Manufacturing Eng.', nameAr: 'هندسة تصنيع',      platforms: ['ITI', 'Udemy', 'YouTube', 'SME Courses'] },
  thermal:       { nameEn: 'Thermal / Fluids',   nameAr: 'حراري و موائع',  platforms: ['Coursera', 'Udemy', 'YouTube', 'ASME Courses'] },
  // Civil sub-tracks
  structural:    { nameEn: 'Structural Eng.',    nameAr: 'هندسة إنشائية',  platforms: ['Udemy', 'Coursera', 'YouTube', 'ESRI Egypt'] },
  water:         { nameEn: 'Water Resources',    nameAr: 'موارد مائية',         platforms: ['Coursera', 'Udemy', 'YouTube', 'IWMI Courses'] },
  geotechnical:  { nameEn: 'Geotechnical Eng.',  nameAr: 'هندسة جيوتقنية', platforms: ['Udemy', 'YouTube', 'Coursera', 'ISSMGE Courses'] }
};
