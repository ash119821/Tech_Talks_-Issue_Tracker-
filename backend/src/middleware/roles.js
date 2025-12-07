module.exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admins only" });
  next();
};

module.exports.analystOnly = (req, res, next) => {
  if (req.user.role !== "analyst")
    return res.status(403).json({ msg: "Analysts only" });
  next();
};
