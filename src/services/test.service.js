import { getState, setState } from '../state.js';
import { TEST_QUESTIONS } from '../data/mock/testQuestions.js';

export function startTest() {
  setState('testSession', {
    questions:  TEST_QUESTIONS,
    answers:    {},
    currentIdx: 0,
    startedAt:  Date.now(),
  });
  setState('testResult', null);
}

export function answerQuestion(questionId, value) {
  const session = getState('testSession');
  if (!session) return;
  setState('testSession', {
    ...session,
    answers:    { ...session.answers, [questionId]: value },
    currentIdx: Math.min(session.currentIdx + 1, session.questions.length - 1),
  });
}

export function submitTest() {
  const session = getState('testSession');
  if (!session) return null;

  const scores = {};
  Object.entries(session.answers).forEach(([qId, val]) => {
    const q = TEST_QUESTIONS.find(q => q.id === qId);
    if (!q) return;
    const track = q.weightMap[val] || q.weightMap['default'];
    if (!track) return;
    scores[track] = (scores[track] || 0) + 1;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const result = {
    topTrackId:  sorted[0]?.[0] || 'frontend',
    scores,
    completedAt: Date.now(),
  };

  setState('testResult', result);
  setState('testSession', null);
  return result;
}

export function getTestResult() {
  return getState('testResult');
}
