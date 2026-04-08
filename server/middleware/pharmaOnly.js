module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'pharma') {
    return res.status(403).json({ success: false, error: 'Pharma company access required' });
  }
  next();
};
