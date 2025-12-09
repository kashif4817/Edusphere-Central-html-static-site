function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

function attachUser(req, res, next) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
  }
  next();
}

module.exports = { requireAuth, attachUser };
