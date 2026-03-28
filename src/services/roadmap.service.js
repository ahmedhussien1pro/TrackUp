import State from '../state.js';
import { StorageService } from './storage.service.js';
import { roadmaps } from '../data/mock/roadmaps.js';

export const RoadmapService = {
  getStepsForTrack(trackId) {
    const template = roadmaps[trackId] || [];
    const savedData = State.getState('roadmapData') || {};
    const completed = savedData[trackId] || [];

    let firstActive = false;
    return template.map((step, i) => {
      if (completed.includes(step.id)) {
        return { ...step, status: 'completed' };
      }
      if (!firstActive) {
        firstActive = true;
        return { ...step, status: 'active' };
      }
      return { ...step, status: 'locked' };
    });
  },

  getProgressForTrack(trackId) {
    const steps = this.getStepsForTrack(trackId);
    const total     = steps.length;
    const completed = steps.filter(s => s.status === 'completed').length;
    const percent   = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  },

  completeStep(stepId) {
    const user = State.getState('user');
    if (!user?.activeTrackId) return;
    const trackId    = user.activeTrackId;
    const savedData  = { ...(State.getState('roadmapData') || {}) };
    const completed  = savedData[trackId] || [];
    if (!completed.includes(stepId)) {
      savedData[trackId] = [...completed, stepId];
      State.setState('roadmapData', savedData);
      StorageService.set('roadmapData', savedData);
    }
  },
};
