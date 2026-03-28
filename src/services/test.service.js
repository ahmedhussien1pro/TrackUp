import State from '../state.js';
import { StorageService } from './storage.service.js';
import { questions } from '../data/mock/questions.js';
import { tracks } from '../data/mock/tracks.js';

export const TestService = {
  startTest() {
    return {
      questions: [...questions],
      answers: {},
    };
  },

  answerQuestion(session, questionId, optionIndex) {
    return {
      ...session,
      answers: { ...session.answers, [questionId]: optionIndex },
    };
  },

  submitTest(session) {
    // Score each track based on answer weights
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

    const topTrackId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    const result = {
      scores,
      topTrackId,
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
