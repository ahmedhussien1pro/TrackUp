import State from '../state.js';
import { StorageService } from './storage.service.js';
import { questions } from '../data/mock/questions.js';
import { tracks } from '../data/mock/tracks.js';

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

    // Sort tracks by score
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([id, score]) => ({ id, score }));

    const totalMax = sorted[0].score * session.questions.length;
    const topTrackId = sorted[0].id;

    // Compute fit percentages (normalised to top score)
    const top = sorted[0].score;
    const percentages = {};
    sorted.forEach(({ id, score }) => {
      percentages[id] = top > 0 ? Math.round((score / top) * 100) : 0;
    });

    const result = {
      scores,
      percentages,
      topTrackId,
      top3: sorted.slice(0, 3).map(s => ({ ...s, pct: percentages[s.id] })),
      recommendedTrack: tracks.find(t => t.id === topTrackId),
      completedAt: Date.now(),
    };

    State.setState('testResult', result);
    StorageService.set('testResult', result);
    return result;
  },

  getResult() {
    return State.getState('testResult') || StorageService.get('testResult') || null;
  },
};
