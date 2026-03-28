import State from '../state.js';
import { StorageService } from './storage.service.js';
import { questions } from '../data/mock/questions.js';
import { tracks } from '../data/mock/tracks.js';

// 7 cognitive dimensions mapped from question answers
const DIMENSION_MAP = {
  q1: { visual: [0,3], logical: [1], analytical: [2], empathetic: [3] },
  q2: { creative: [0,3], systematic: [1], analytical: [2] },
  q3: { visual: [0], logical: [1], analytical: [2], empathetic: [3] },
  q4: { creative: [0,3], analytical: [1], systematic: [2] },
  q5: { creative: [0,2], analytical: [3], logical: [1] },
  q6: { visual: [0], logical: [1,2], empathetic: [3] },
  q7: { creative: [0], logical: [1], analytical: [2], empathetic: [3] },
};

const DIMENSION_LABELS = {
  visual:     { en: 'Visual Thinking',   ar: 'التفكير البصري' },
  logical:    { en: 'Logical Systems',   ar: 'الأنظمة المنطقية' },
  analytical: { en: 'Analytical Mind',   ar: 'العقل التحليلي' },
  empathetic: { en: 'User Empathy',      ar: 'التعاطف مع المستخدم' },
  creative:   { en: 'Creative Output',   ar: 'الإبداع والإخراج' },
  systematic: { en: 'Systems Thinking',  ar: 'التفكير المنظومي' },
};

// Confidence copy per level
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

function _computeDimensions(answers) {
  const scores = { visual: 0, logical: 0, analytical: 0, empathetic: 0, creative: 0, systematic: 0 };

  Object.entries(answers).forEach(([qid, optIdx]) => {
    const map = DIMENSION_MAP[qid];
    if (!map) return;
    Object.entries(map).forEach(([dim, indices]) => {
      if (indices.includes(optIdx)) scores[dim] += 2;
    });
  });

  // Normalise to percentage (max possible per dim = 2 * questions)
  const maxPossible = 14; // 7 questions × 2
  return Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, Math.min(100, Math.round((v / maxPossible) * 100))])
  );
}

function _computeConfidence(top3) {
  if (!top3 || top3.length < 2) return { level: 'high', gap: 100 };
  const gap = top3[0].pct - (top3[1]?.pct || 0);
  const level = gap >= 25 ? 'high' : gap >= 12 ? 'medium' : 'low';
  return { level, gap };
}

// Strength sentence per track × dimension combo
const STRENGTH_SENTENCE = {
  frontend: {
    en: 'You think in visuals, care about output, and love building things people interact with.',
    ar: 'تفكّر بصرياً، تهتم بالمخرجات، وتحب بناء ما يتفاعل معه الناس.',
  },
  backend: {
    en: 'You reason in systems, value reliability, and find deep satisfaction in invisible infrastructure.',
    ar: 'تفكر بالأنظمة، تقدّر الاطمئنان، وتجد رضا عميقاً في البنية التحتية غير المرئية.',
  },
  data: {
    en: 'You ask why before you act, trust evidence over intuition, and think in patterns.',
    ar: 'تسأل لماذا قبل أن تتصرف، وتثق بالأدلة، وتفكر في الأنماط.',
  },
  ux: {
    en: 'You lead with empathy, think about users first, and care deeply about how things feel.',
    ar: 'تنطلق من التعاطف، وتفكر في المستخدمين أولاً، ويهمك عمقاً الشعور بالتجربة.',
  },
  devops: {
    en: 'You love making complex systems predictable, automating everything, and owning reliability.',
    ar: 'تحب جعل الأنظمة المعقدة يمكن التنبؤ بها، وأتمتة كل شيء، وامتلاك الاطمئنان.',
  },
};

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
        scores[trackId] = (scores[trackId] || 0) + w;
      });
    });

    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({ id, score }));

    const top     = sorted[0].score;
    const topTrackId = sorted[0].id;

    const percentages = {};
    sorted.forEach(({ id, score }) => {
      percentages[id] = top > 0 ? Math.round((score / top) * 100) : 0;
    });

    const top3 = sorted.slice(0, 3).map(s => ({ ...s, pct: percentages[s.id] }));
    const confidence   = _computeConfidence(top3);
    const dimensions   = _computeDimensions(session.answers);

    const result = {
      scores,
      percentages,
      topTrackId,
      top3,
      recommendedTrack: tracks.find(t => t.id === topTrackId),
      confidence,
      dimensions,
      strengthSentence: STRENGTH_SENTENCE[topTrackId] || STRENGTH_SENTENCE.frontend,
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
