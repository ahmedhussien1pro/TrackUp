export const questions = [
  {
    id: 'q1',
    text: 'Which of these activities excites you the most?',
    options: [
      { label: 'Designing and building user interfaces', weights: { frontend: 3, mobile: 2, backend: 0, data: 0, devops: 0 } },
      { label: 'Designing APIs and database schemas',   weights: { frontend: 0, mobile: 0, backend: 3, data: 1, devops: 1 } },
      { label: 'Analyzing data and finding patterns',   weights: { frontend: 0, mobile: 0, backend: 0, data: 3, devops: 0 } },
      { label: 'Automating systems and infrastructure', weights: { frontend: 0, mobile: 0, backend: 1, data: 0, devops: 3 } },
    ],
  },
  {
    id: 'q2',
    text: 'What best describes your current technical background?',
    options: [
      { label: 'Complete beginner',              weights: { frontend: 2, mobile: 2, backend: 1, data: 1, devops: 1 } },
      { label: 'Know HTML/CSS basics',           weights: { frontend: 3, mobile: 1, backend: 0, data: 0, devops: 0 } },
      { label: 'Comfortable with Python',        weights: { frontend: 0, mobile: 0, backend: 1, data: 3, devops: 1 } },
      { label: 'Familiar with Linux and servers', weights: { frontend: 0, mobile: 0, backend: 2, data: 0, devops: 3 } },
    ],
  },
  {
    id: 'q3',
    text: 'What kind of product would you most want to build?',
    options: [
      { label: 'A beautiful web app',       weights: { frontend: 3, mobile: 1, backend: 0, data: 0, devops: 0 } },
      { label: 'A mobile app for millions', weights: { frontend: 1, mobile: 3, backend: 0, data: 0, devops: 0 } },
      { label: 'A smart recommendation engine', weights: { frontend: 0, mobile: 0, backend: 1, data: 3, devops: 0 } },
      { label: 'A zero-downtime production system', weights: { frontend: 0, mobile: 0, backend: 2, data: 0, devops: 3 } },
    ],
  },
  {
    id: 'q4',
    text: 'How do you prefer to solve problems?',
    options: [
      { label: 'Visually — I think in layouts and colors', weights: { frontend: 3, mobile: 2, backend: 0, data: 0, devops: 0 } },
      { label: 'Logically — I think in data structures',  weights: { frontend: 1, mobile: 0, backend: 3, data: 2, devops: 1 } },
      { label: 'Statistically — I think in patterns',     weights: { frontend: 0, mobile: 0, backend: 0, data: 3, devops: 0 } },
      { label: 'Systemically — I think in processes',     weights: { frontend: 0, mobile: 0, backend: 1, data: 0, devops: 3 } },
    ],
  },
  {
    id: 'q5',
    text: 'What is your primary career goal in the next 12 months?',
    options: [
      { label: 'Land a frontend or product engineering role', weights: { frontend: 3, mobile: 2, backend: 0, data: 0, devops: 0 } },
      { label: 'Get hired as a backend or full-stack developer', weights: { frontend: 1, mobile: 0, backend: 3, data: 0, devops: 1 } },
      { label: 'Become a data analyst or ML engineer', weights: { frontend: 0, mobile: 0, backend: 0, data: 3, devops: 0 } },
      { label: 'Work in cloud or platform engineering', weights: { frontend: 0, mobile: 0, backend: 1, data: 0, devops: 3 } },
    ],
  },
];
