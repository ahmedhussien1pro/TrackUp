import State from '../state.js';
import { MOCK_TEST_QUESTIONS } from '../data/mock/testQuestions.js';
import { MOCK_TRACKS } from '../data/mock/tracks.js';

export const TestService = {
  startTest() {
    const session = {
      questions: [...MOCK_TEST_QUESTIONS],
      answers: {},
      startedAt: Date.now(),
    };
    State.setState('testSession', session);
    State.setState('testResult', null);
    return session;
  },

  answerQuestion(session, questionId, optionIndex) {
    session.answers[questionId] = optionIndex;
    return session;
  },

  submitTest(session) {
    const scores = {};
    Object.entries(session.answers).forEach(([qId, optIndex]) => {
      const q = MOCK_TEST_QUESTIONS.find(q => q.id === qId);
      if (!q) return;
      const option = q.options[optIndex];
      if (!option?.weight) return;
      Object.entries(option.weight).forEach(([trackId, pts]) => {
        scores[trackId] = (scores[trackId] || 0) + pts;
      });
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topTrackId = sorted[0]?.[0] || 'track-1';
    const recommendedTrack = MOCK_TRACKS.find(t => t.id === topTrackId) || MOCK_TRACKS[0];

    const result = {
      scores,
      topTrackId,
      recommendedTrack,
      completedAt: Date.now(),
    };

    State.setState('testResult', result);
    State.setState('testSession', null);
    return result;
  },

  getResult() {
    return State.getState('testResult');
  },
};
