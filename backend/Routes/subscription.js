const express = require("express");
const router = express.Router();
const Subscription = require("../Model/subscription");

// ✅ GET USER SUBSCRIPTION
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const subscription = await Subscription.findOne({ uid });

    if (!subscription) {
      return res.json({ plan: "Free" });
    }

    // If expired → treat as Free
    if (subscription.expiryDate < new Date()) {
      return res.json({ plan: "Free" });
    }

    res.json(subscription);
  } catch (err) {
    console.log("Fetch subscription error:", err);
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
});

module.exports = router;