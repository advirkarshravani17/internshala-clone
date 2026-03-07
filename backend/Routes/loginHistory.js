const express = require("express");
const router = express.Router();
const LoginHistory = require("../Model/LoginHistory");
const User = require("../Model/User");

router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json([]);

    const history = await LoginHistory.find({ userId: user._id })
      .sort({ loginTime: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
