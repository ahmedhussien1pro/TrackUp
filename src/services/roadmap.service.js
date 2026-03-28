import State from '../state.js';
import { MOCK_ROADMAP_STEPS } from '../data/mock/roadmapSteps.js';

const _steps = [...MOCK_ROADMAP_STEPS];

export const RoadmapService = {
  getStepsForTrack(trackId) {
    return _steps
      .filter(s => s.trackId === trackId)
      .sort((a, b) => a.order - b.order);
  },

  loadStepsForTrack(trackId) {
    const steps = this.getStepsForTrack(trackId);
    State.setState('roadmapSteps', steps);
    return steps;
  },

  markStepActive(stepId) {
    const idx = _steps.findIndex(s => s.id === stepId);
    if (idx === -1) return;
    _steps[idx] = { ..._steps[idx], status: 'active' };
    const trackId = _steps[idx].trackId;
    this.loadStepsForTrack(trackId);
  },

  completeStep(stepId) {
    const idx = _steps.findIndex(s => s.id === stepId);
    if (idx === -1) return;
    _steps[idx] = { ..._steps[idx], status: 'completed' };
    const next = _steps.find(s => s.trackId === _steps[idx].trackId && s.order === _steps[idx].order + 1);
    if (next && next.status === 'locked') {
      const ni = _steps.findIndex(s => s.id === next.id);
      _steps[ni] = { ..._steps[ni], status: 'active' };
    }
    this.loadStepsForTrack(_steps[idx].trackId);
  },

  getProgressForTrack(trackId) {
    const steps = this.getStepsForTrack(trackId);
    const completed = steps.filter(s => s.status === 'completed').length;
    return { total: steps.length, completed, percent: steps.length ? Math.round((completed / steps.length) * 100) : 0 };
  },
};
