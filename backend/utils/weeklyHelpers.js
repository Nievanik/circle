// Math to consistently align to Monday 00:00:00.000 boundaries
exports.getCurrentWeekBoundaries = (simulatedDate = null) => {
  const now = simulatedDate ? new Date(simulatedDate) : new Date();
  
  // Get Monday as start of week
  const day = now.getDay() || 7; // Convert Sun (0) to 7
  if (day !== 1) {
    now.setHours(-24 * (day - 1));
  }
  
  // Set to midnight
  now.setHours(0, 0, 0, 0);
  const weekStartDate = new Date(now);

  // Set end date to Sunday 23:59:59.999
  const weekEndDate = new Date(now);
  weekEndDate.setHours(24 * 7 - 1, 59, 59, 999);

  return { weekStartDate, weekEndDate };
};

// Daily boundaries for the new Daily Check-in system
exports.getCurrentDayBoundaries = (simulatedDate = null) => {
  const now = simulatedDate ? new Date(simulatedDate) : new Date();
  now.setHours(0, 0, 0, 0);
  const dayStartDate = new Date(now);
  
  const dayEndDate = new Date(now);
  dayEndDate.setHours(23, 59, 59, 999);
  
  return { dayStartDate, dayEndDate };
};

// Test if a date is within current boundaries
exports.isCurrentWeek = (dateString, simulatedDate = null) => {
  const { weekStartDate, weekEndDate } = exports.getCurrentWeekBoundaries(simulatedDate);
  const date = new Date(dateString);
  return date >= weekStartDate && date <= weekEndDate;
};
