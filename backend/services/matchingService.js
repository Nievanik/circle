// Smart matching engine calculating weights
exports.calculateMatchScore = (userA, userB) => {
  let score = 0;

  // 1. Career Goal Similarity (30%)
  if (userA.careerGoal && userB.careerGoal && userA.careerGoal.toLowerCase() === userB.careerGoal.toLowerCase()) {
    score += 30;
  }

  // 2. Stage Similarity (20%)
  if (userA.currentStage === userB.currentStage) {
    score += 20;
  }

  // 3. Struggle Overlap (20%)
  if (userA.struggleTypes && userB.struggleTypes) {
    const commonStruggles = userA.struggleTypes.filter(s => userB.struggleTypes.includes(s));
    if (commonStruggles.length > 0) {
      score += 20 * (commonStruggles.length / Math.max(userA.struggleTypes.length, 1));
    }
  }

  // 4. Support Preference Compatibility (10%)
  if (userA.supportPreferences && userB.supportPreferences) {
    const commonPrefs = userA.supportPreferences.filter(p => userB.supportPreferences.includes(p));
    if (commonPrefs.length > 0) {
      score += 10;
    }
  }

  // 5. Availability Overlap (10%)
  if (userA.availabilityTimezone === userB.availabilityTimezone) {
    score += 10;
  }

  // 6. Language/Location Similarity (10%)
  if (userA.preferredLanguage === userB.preferredLanguage) {
    score += 5;
  }
  if (userA.location && userB.location && userA.location.toLowerCase() === userB.location.toLowerCase()) {
    score += 5;
  }

  return score;
};
