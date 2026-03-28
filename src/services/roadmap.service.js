import { getState, setState } from '../state.js';
import { ROADMAP_STEPS } from '../data/mock/roadmapSteps.js';

export const STEP_STATUS = {
  LOCKED:      'locked',
  AVAILABLE:   'available',
  IN_PROGRESS: 'in_progress',
  DONE:        'done',
};

export function getStepsForTrack(trackId) {
  return ROADMAP_STEPS.filter(s => s.trackId === trackId);
}

export function loadRoadmapForTrack(trackId) {
  setState('roadmapSteps', getStepsForTrack(trackId));
}

export function startStep(stepId) {
  const steps = getState('roadmapSteps').map(s =>
    s.id === stepId ? { ...s, status: STEP_STATUS.IN_PROGRESS } : s
  );
  setState('roadmapSteps', steps);
}

export function completeStep(stepId) {
  const steps = getState('roadmapSteps');
  const idx = steps.findIndex(s => s.id === stepId);
  if (idx === -1) return;

  setState('roadmapSteps', steps.map((s, i) => {
    if (s.id === stepId) return { ...s, status: STEP_STATUS.DONE };
    if (i === idx + 1 && s.status === STEP_STATUS.LOCKED)
      return { ...s, status: STEP_STATUS.AVAILABLE };
    return s;
  }));
}
