import State from '../state.js';
import { StorageService } from './storage.service.js';
import { questions } from '../data/mock/questions.js';
import { tracks } from '../data/mock/tracks.js';

// Cognitive dimensions mapped from question answers
// Aligned with EE tracks: field-oriented, analytical, hardware, software-adjacent
const DIMENSION_MAP = {
  q1: { fieldwork: [0],    software: [1],    analytical: [2],   adaptive: [3] },
  q2: { software: [0],    systematic: [1],  fieldwork: [2],    adaptive: [3] },
  q3: { fieldwork: [0],   hardware: [1],    analytical: [2],   adaptive: [3] },
  q4: { ambitious: [0],   systematic: [1],  ambitious: [2],    adaptive: [3] },
  q5: { resilient: [0],   systematic: [1],  systematic: [2],   adaptive: [3] },
  q6: { analytical: [0],  systematic: [1],  fieldwork: [2],    adaptive: [3] },
  q7: { fieldwork: [0],   hardware: [1],    analytical: [2],   adaptive: [3] },
};

const DIMENSION_LABELS = {
  fieldwork:  { en: 'Field Orientation',    ar: 'التوجه الميداني' },
  software:   { en: 'Software Affinity',    ar: 'الميل للبرمجة' },
  hardware:   { en: 'Hardware Thinking',    ar: 'التفكير بالهاردوير' },
  analytical: { en: 'Analytical Mind',      ar: 'العقل التحليلي' },
  systematic: { en: 'Systems Thinking',     ar: 'التفكير المنظومي' },
  resilient:  { en: 'Stress Resilience',    ar: 'تحمّل الضغط' },
  ambitious:  { en: 'Career Ambition',      ar: 'الطموح المهني' },
  adaptive:   { en: 'Adaptability',         ar: 'القدرة على التأقلم' },
};

const CONFIDENCE_COPY = {
  high: {
    en: 'Your answers were highly consistent — this recommendation carries strong confidence.',
    ar: 'إجاباتك كانت متسقة جداً — هذه التوصية تحمل ثقة عالية.',
  },
  medium: {
    en: 'Your profile shows clear strengths with some overlap — review the top 2 tracks.',
    ar: 'ملفك يُظهر قدرات واضحة مع بعض التداخل — راجع أعلى مسارين.',
  },
  low: {
    en: 'Your answers suggest broad curiosity — both top tracks are strong options for you.',
    ar: 'إجاباتك تدل على فضول واسع — كلا المسارين الأوليين خيارات قوية لك.',
  },
};

const STRENGTH_SENTENCE = {
  power: {
    en: 'You are drawn to real-world impact, enjoy field work, and want to keep infrastructure running.',
    ar: 'تنجذب للأثر الحقيقي، وتستمتع بالعمل الميداني، وتريد إبقاء البنية التحتية تعمل.',
  },
  embedded: {
    en: 'You love the intersection of hardware and code — building smart devices that solve real problems.',
    ar: 'تحب تلاقي الهاردوير والكود — بناء أجهزة ذكية تحل مشكلات حقيقية.',
  },
  communications: {
    en: 'You think analytically, love networks, and are excited by the technology connecting the world.',
    ar: 'تفكر تحليلياً، وتحب الشبكات، وتتحمس للتكنولوجيا التي تربط العالم.',
  },
  'career-shift': {
    en: 'You are motivated, adaptable, and ready to start fresh — engineering is within your reach.',
    ar: 'أنت متحفز وقابل للتكيف وجاهز للبداية من جديد — الهندسة في متناول يدك.',
  },
};

function _computeDimensions(answers) {
  const scores = {
    fieldwork: 0, software: 0, hardware: 0,
    analytical: 0, systematic: 0, resilient: 0,
    ambitious: 0, adaptive: 0,
  };

  Object.entries(answers).forEach(([qid, optIdx]) => {
    const map = DIMENSION_MAP[qid];
    if (!map) return;
    Object.entries(map).forEach(([dim, indices]) => {
      if (indices.includes(optIdx)) scores[dim] += 2;
    });
  });

  const maxPossible = 14;
  return Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, Math.min(100, Math.round((v / maxPossible) * 100))])
  );
}

function _computeConfidence(top3) {
  if (!top3 || top3.length < 2) return { level: 'high', gap: 100 };
  const gap   = top3[0].pct - (top3[1]?.pct || 0);
  const level = gap >= 25 ? 'high' : gap >= 12 ? 'medium' : 'low';
  return { level, gap };
}

export const TestService = {
  startTest() {
    return { questions: [...questions], answers: {} };
  },

  answerQuestion(session, questionId, optionIndex) {
    return { ...session, answers: { ...session.answers, [questionId]: optionIndex } };
  },

  submitTest(session) {
    const scores = {};
    tracks.forEach(t => { scores[t.id] = 0; });

    session.questions.forEach(q => {
      const idx = session.answers[q.id];
      if (idx === undefined) return;
      const opt = q.options[idx];
      if (!opt?.weights) return;
      Object.entries(opt.weights).forEach(([trackId, w]) => {
        if (scores[trackId] !== undefined) scores[trackId] += w;
      });
    });

    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({ id, score }));

    const top        = sorted[0].score;
    const topTrackId = sorted[0].id;

    const percentages = {};
    sorted.forEach(({ id, score }) => {
      percentages[id] = top > 0 ? Math.round((score / top) * 100) : 0;
    });

    const top3       = sorted.slice(0, 3).map(s => ({ ...s, pct: percentages[s.id] }));
    const confidence = _computeConfidence(top3);
    const dimensions = _computeDimensions(session.answers);

    const result = {
      scores,
      percentages,
      topTrackId,
      top3,
      recommendedTrack: tracks.find(t => t.id === topTrackId),
      confidence,
      dimensions,
      strengthSentence: STRENGTH_SENTENCE[topTrackId] || STRENGTH_SENTENCE.power,
      completedAt: Date.now(),
    };

    State.setState('testResult', result);
    StorageService.set('testResult', result);
    return result;
  },

  getResult() {
    return State.getState('testResult') || StorageService.get('testResult') || null;
  },

  getDimensionLabel(key, lang = 'en') {
    return DIMENSION_LABELS[key]?.[lang] ?? key;
  },

  getConfidenceCopy(level, lang = 'en') {
    return CONFIDENCE_COPY[level]?.[lang] ?? '';
  },
};
