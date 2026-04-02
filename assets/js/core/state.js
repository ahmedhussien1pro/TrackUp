window.state = {
  currentView: 'home',
  language: StorageAPI.get('trackup_language', 'en'),
  direction: StorageAPI.get('trackup_direction', 'ltr'),
  theme: StorageAPI.get('trackup_theme', 'dark'),
  mobileMenuOpen: false,
  journeyOpen: false,
  mentorFilter: 'all',
  selectedMentor: null,
  subtestField: StorageAPI.get('trackup_subtestField', null),
  subtestIndex: StorageAPI.get('trackup_subtestIndex', 0),
  subtestAnswers: StorageAPI.get('trackup_subtestAnswers', {}),
  subtestComplete: StorageAPI.get('trackup_subtestComplete', false),
  profile: StorageAPI.get('trackup_profile', { fullName: '', college: '', year: '', email: '' }),
  testAnswers: StorageAPI.get('trackup_answers', {}),
  scores: StorageAPI.get('trackup_scores', {}),
  rankedTracks: StorageAPI.get('trackup_ranked', []),
  selectedTrack: StorageAPI.get('trackup_selectedTrack', 'embedded'),
  completedMilestones: StorageAPI.get('trackup_milestones', {
    profileCompleted: false,
    testCompleted: false,
    resultsViewed: false,
    detailsOpened: false,
    roadmapStarted: false,
    courseStarted: false,
    premiumUnlocked: false,
    sessionBooked: false
  }),
  premiumUnlocked: StorageAPI.get('trackup_premium', false),
  sessionRequested: StorageAPI.get('trackup_session', false),
  currentQuestionIndex: 0,
  startedCourseIds: StorageAPI.get('trackup_startedCourses', []),
  roadmapProgress: StorageAPI.get('trackup_roadmapProgress', {})
};

window.persistState = function persistState() {
  StorageAPI.set('trackup_language', state.language);
  StorageAPI.set('trackup_direction', state.direction);
  StorageAPI.set('trackup_theme', state.theme);
  StorageAPI.set('trackup_profile', state.profile);
  StorageAPI.set('trackup_answers', state.testAnswers);
  StorageAPI.set('trackup_scores', state.scores);
  StorageAPI.set('trackup_ranked', state.rankedTracks);
  StorageAPI.set('trackup_selectedTrack', state.selectedTrack);
  StorageAPI.set('trackup_milestones', state.completedMilestones);
  StorageAPI.set('trackup_premium', state.premiumUnlocked);
  StorageAPI.set('trackup_session', state.sessionRequested);
  StorageAPI.set('trackup_startedCourses', state.startedCourseIds);
  StorageAPI.set('trackup_roadmapProgress', state.roadmapProgress);
  StorageAPI.set('trackup_subtestField', state.subtestField);
  StorageAPI.set('trackup_subtestIndex', state.subtestIndex);
  StorageAPI.set('trackup_subtestAnswers', state.subtestAnswers);
  StorageAPI.set('trackup_subtestComplete', state.subtestComplete);
};
