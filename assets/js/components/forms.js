window.validateProfile = function validateProfile(profile) {
  const errors = {};
  if (!profile.fullName.trim()) errors.fullName = true;
  if (!profile.college.trim()) errors.college = true;
  if (!profile.year.trim()) errors.year = true;
  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errors.email = true;
  return errors;
};

window.validateSessionForm = function validateSessionForm(data) {
  const errors = {};
  if (!data.fullName.trim()) errors.fullName = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = true;
  if (!data.password || data.password.length < 6) errors.password = true;
  if (data.password !== data.confirmPassword) errors.confirmPassword = true;
  if (!data.specialization.trim()) errors.specialization = true;
  if (!data.topic.trim()) errors.topic = true;
  return errors;
};
