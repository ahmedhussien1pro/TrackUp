window.calculateResults = function calculateResults() {
  const a = state.testAnswers;
  const score = { power: 0, embedded: 0, communications: 0 };
  const add = (track, n) => score[track] += n;

  if (a.workStyle === 'practical') { add('power', 4); add('communications', 1); }
  if (a.workStyle === 'software') { add('embedded', 4); add('communications', 1); }
  if (a.workStyle === 'mix') { add('embedded', 3); add('communications', 3); add('power', 1); }

  if (a.programming === 'aLot') { add('embedded', 4); add('communications', 2); }
  if (a.programming === 'somewhat') { add('embedded', 2); add('communications', 2); add('power', 1); }
  if (a.programming === 'no') { add('power', 3); }

  if (a.environment === 'field') { add('power', 4); add('communications', 1); }
  if (a.environment === 'office') { add('embedded', 4); add('communications', 2); }
  if (a.environment === 'hybrid') { add('communications', 4); add('embedded', 2); add('power', 1); }

  if (a.goal === 'money') { add('embedded', 3); add('communications', 2); add('power', 1); }
  if (a.goal === 'stability') { add('power', 4); add('communications', 1); }
  if (a.goal === 'travel') { add('communications', 4); add('power', 1); }

  if (a.pressure === 'yes') { add('power', 4); add('embedded', 2); add('communications', 2); }
  if (a.pressure === 'medium') { add('communications', 2); add('embedded', 2); add('power', 1); }
  if (a.pressure === 'no') { add('embedded', 2); add('communications', 2); }

  const max = Math.max(...Object.values(score), 1);
  const ranked = Object.entries(score).map(([id, raw]) => ({
    id,
    raw,
    percent: Math.round((raw / max) * 100),
    tags: TRACKS[id].tags.slice(0, 2),
    reason: TRACKS[id].reasons[state.language][0]
  })).sort((a, b) => b.raw - a.raw);

  state.scores = score;
  state.rankedTracks = ranked;
  state.selectedTrack = ranked[0]?.id || 'embedded';
  updateProgress('testCompleted', true);
  persistState();
  return ranked;
};
