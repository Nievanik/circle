// Cohort comparison and reassurance text templates
exports.getSharedStruggleMessage = (percent, struggle) => {
  const formattedStruggle = struggle.replace(/_/g, ' ');
  const templates = [
    `{percent}% of users at your stage also report dealing with {struggle}.`,
    `You're not the only one feeling this. {percent}% of users at this stage share this struggle with {struggle}.`,
    `Many peers in your cohort face similar challenges. {percent}% are explicitly managing {struggle}.`
  ];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace('{percent}', percent).replace('{struggle}', formattedStruggle);
};

exports.getPaceReassuranceMessage = (classification, averageGoals) => {
  if (classification === 'within_range') {
    return `Your current pace is well within the normal range. Similar users average ${averageGoals} completed goals per week.`;
  }
  if (classification === 'below_range') {
    return `You're progressing slightly slower than the cohort average (${averageGoals} goals), but pace fluctuates entirely naturally. You are not behind forever.`;
  }
  return `You are progressing faster than your cohort's average of ${averageGoals} goals! Remember to pace yourself to avoid burnout.`;
};

exports.getStressReassuranceMessage = (avgStress, highStressRate) => {
  if (highStressRate >= 50) {
    return `High stress is extremely common among users in this stage. ${highStressRate}% of your cohort reported stress levels of 7 or higher this week.`;
  }
  return `Your peers report an average stress level of ${avgStress}/10 right now. Remember to build emotional recovery into your weekly goals.`;
};

exports.getCheckInConsistencyMessage = (checkInRate) => {
  return `${checkInRate}% of people in your stage performed a mental check-in this week.`;
};

exports.getFallbackMessage = () => {
    const fallbacks = [
        "We're actively learning from people on a similar path as you.",
        "As more peers join your specific stage, we'll begin routing personalized comparison insights.",
        "Many users in complex transitions report heavy uncertainty. You are doing the right thing by tracking your actions."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
