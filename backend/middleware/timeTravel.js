const timeTravelMiddleware = (req, res, next) => {
  const simulatedHeader = req.headers['x-simulated-date'];
  
  if (simulatedHeader && simulatedHeader.includes('-')) {
    const [year, month, day] = simulatedHeader.split('-');
    const parsedDate = new Date(year, month - 1, day, 12, 0, 0);
    if (!isNaN(parsedDate.getTime())) {
      req.simulatedDate = parsedDate;
    } else {
      req.simulatedDate = new Date();
    }
  } else {
    req.simulatedDate = new Date();
  }
  
  next();
};

module.exports = timeTravelMiddleware;
