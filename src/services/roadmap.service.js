import State from '../state.js';
import { StorageService } from './storage.service.js';
import { roadmaps } from '../data/mock/roadmaps.js';

export const RoadmapService = {
  getStepsForTrack(trackId) {
    return roadmaps[trackId] || [];
  },

  getProgressForTrack(trackId) {
    const key = `roadmap_progress_${trackId}`;
    const done = State.getState(key) || StorageService.get(key) || [];
    const steps = roadmaps[trackId] || [];
    const completed = steps.filter(s => done.includes(s.id)).length;
    const percent = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;
    return { steps, completed, total: steps.length, percent, done };
  },

  toggleStep(trackId, stepId) {
    const key = `roadmap_progress_${trackId}`;
    const done = [...(State.getState(key) || StorageService.get(key) || [])];
    const idx = done.indexOf(stepId);
    if (idx === -1) done.push(stepId);
    else done.splice(idx, 1);
    State.setState(key, done);
    StorageService.set(key, done);
    return done;
  },
};
