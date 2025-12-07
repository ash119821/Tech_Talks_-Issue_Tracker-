const express = require("express");
const auth = require("../middleware/auth");
const { adminOnly, analystOnly } = require("../middleware/roles");

const router = express.Router();

// ADMIN Dashboard
router.get("/admin", auth, adminOnly, (req, res) => {
  res.json({ msg: "Welcome Admin Dashboard" });
});

// ANALYST Dashboard
router.get("/analyst", auth, analystOnly, (req, res) => {
  res.json({ msg: "Welcome Analyst Dashboard" });
});

module.exports = router;