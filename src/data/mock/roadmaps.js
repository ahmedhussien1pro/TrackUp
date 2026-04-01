// TrackUp — Roadmap steps per track
// Power / Embedded / Communications / Career Shift

export const roadmaps = {
  power: [
    { id: 'pw-1', phase: 'Basics',      title: 'Electrical Circuits Fundamentals',  desc: 'Ohm\'s law, Kirchhoff\'s laws, AC/DC analysis, phasors.',           weeks: 2 },
    { id: 'pw-2', phase: 'Basics',      title: 'Power System Components',           desc: 'Generators, transformers, transmission lines, substations.',          weeks: 2 },
    { id: 'pw-3', phase: 'Courses',     title: 'ETAP / MATLAB Power Simulation',    desc: 'Load flow analysis, short circuit studies, protection coordination.',  weeks: 3 },
    { id: 'pw-4', phase: 'Courses',     title: 'Protection & Control Systems',      desc: 'Relays, SCADA basics, circuit breakers, grounding.',                  weeks: 3 },
    { id: 'pw-5', phase: 'Projects',    title: 'Substation Design Project',         desc: 'Design a medium-voltage substation on paper using AutoCAD Electrical.', weeks: 3 },
    { id: 'pw-6', phase: 'Projects',    title: 'Renewable Energy Integration',      desc: 'Model a solar farm connection to the grid using simulation tools.',    weeks: 2 },
    { id: 'pw-7', phase: 'Job Ready',   title: 'Professional Certification Prep',   desc: 'Prepare for IEEE/ETA certification and build your engineering CV.',    weeks: 3 },
    { id: 'pw-8', phase: 'Job Ready',   title: 'Site Internship or Mock Project',   desc: 'Apply for a site internship or complete a real-scope capstone project.', weeks: 4 },
  ],
  embedded: [
    { id: 'em-1', phase: 'Basics',      title: 'C Programming for Embedded',       desc: 'Pointers, memory management, bit manipulation, interrupts.',           weeks: 3 },
    { id: 'em-2', phase: 'Basics',      title: 'Microcontroller Architecture',      desc: 'AVR / ARM Cortex-M: registers, GPIO, timers, ADC.',                   weeks: 2 },
    { id: 'em-3', phase: 'Courses',     title: 'Communication Protocols',           desc: 'UART, SPI, I2C, CAN — theory and implementation.',                    weeks: 2 },
    { id: 'em-4', phase: 'Courses',     title: 'RTOS Fundamentals',                 desc: 'FreeRTOS tasks, queues, semaphores, priority scheduling.',             weeks: 2 },
    { id: 'em-5', phase: 'Projects',    title: 'Smart Sensor System',               desc: 'Build a temperature + humidity monitor with display and UART logging.', weeks: 3 },
    { id: 'em-6', phase: 'Projects',    title: 'Motor Control Project',             desc: 'Control a DC motor via PWM with closed-loop feedback.',               weeks: 2 },
    { id: 'em-7', phase: 'Job Ready',   title: 'PCB Design & Prototyping',          desc: 'Design a simple PCB using KiCad and get it manufactured.',            weeks: 3 },
    { id: 'em-8', phase: 'Job Ready',   title: 'Portfolio & GitHub Setup',          desc: 'Document 3 projects on GitHub with schematics, code, and README.',    weeks: 2 },
  ],
  communications: [
    { id: 'cm-1', phase: 'Basics',      title: 'Signals & Systems Fundamentals',   desc: 'Fourier transform, filtering, modulation/demodulation basics.',        weeks: 2 },
    { id: 'cm-2', phase: 'Basics',      title: 'Wireless Communication Principles', desc: 'Channel models, fading, SNR, link budget calculations.',              weeks: 2 },
    { id: 'cm-3', phase: 'Courses',     title: 'RF & Antenna Engineering',          desc: 'Antenna types, radiation patterns, RF propagation, S-parameters.',    weeks: 3 },
    { id: 'cm-4', phase: 'Courses',     title: '4G/5G Network Architecture',        desc: 'LTE/NR stack, eNodeB/gNB, core network, network slicing.',            weeks: 3 },
    { id: 'cm-5', phase: 'Projects',    title: 'Network Coverage Planning',         desc: 'Use Atoll or similar tool to plan a cellular coverage area.',          weeks: 3 },
    { id: 'cm-6', phase: 'Projects',    title: 'Signal Processing Simulation',      desc: 'Implement modulation scheme in MATLAB and measure BER performance.',   weeks: 2 },
    { id: 'cm-7', phase: 'Job Ready',   title: 'Telecom Tools Certification',       desc: 'Huawei / Nokia / Ericsson tools familiarity + vendor certification.',  weeks: 2 },
    { id: 'cm-8', phase: 'Job Ready',   title: 'Industry Project or Internship',    desc: 'Work on a live planning project or complete a telecom capstone.',     weeks: 4 },
  ],
  'career-shift': [
    { id: 'cs-1', phase: 'Basics',      title: 'Electrical Engineering Foundations', desc: 'Voltage, current, power, circuit laws — from zero.',                  weeks: 2 },
    { id: 'cs-2', phase: 'Basics',      title: 'Engineering Math Refresher',        desc: 'Algebra, trigonometry, and intro to calculus for engineers.',          weeks: 2 },
    { id: 'cs-3', phase: 'Courses',     title: 'AutoCAD Electrical Basics',         desc: 'Drawing electrical schematics and reading technical drawings.',        weeks: 2 },
    { id: 'cs-4', phase: 'Courses',     title: 'Choose Your Specialisation',        desc: 'Explore Power, Embedded, and Communications to find your fit.',        weeks: 2 },
    { id: 'cs-5', phase: 'Projects',    title: 'Mini Capstone Project',             desc: 'Complete a guided project in your chosen specialisation area.',        weeks: 3 },
    { id: 'cs-6', phase: 'Projects',    title: 'Professional Skills Workshop',      desc: 'CV writing, LinkedIn optimisation, and technical interview prep.',     weeks: 2 },
    { id: 'cs-7', phase: 'Job Ready',   title: 'Industry Internship or Shadowing', desc: 'Secure a short internship or job shadow with an experienced engineer.', weeks: 4 },
    { id: 'cs-8', phase: 'Job Ready',   title: 'Final Portfolio & Job Applications',desc: 'Submit 10 targeted job applications with a polished portfolio.',       weeks: 2 },
  ],
};
