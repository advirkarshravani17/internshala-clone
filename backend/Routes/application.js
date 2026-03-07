const express = require("express");
const router = express.Router();
const application = require("../Model/Application");
const User = require("../Model/User");
const Resume = require("../Model/Resume");
const Subscription = require("../Model/subscription"); // ✅ ADDED

router.post("/", async (req, res) => {
  try {
    const { company, category, coverLetter, user, Application } = req.body;

    // ================== ✅ NEW SUBSCRIPTION CHECK ==================
    const userDoc = await User.findOne({ uid: user.uid });

    let allowedLimit = 1; // Free plan default (1 internship)

    // ✅ FIX: use firebase uid instead of _id
    const subscription = await Subscription.findOne({
      uid: user.uid,
    });

    if (subscription && subscription.expiryDate > new Date()) {

      // Gold = unlimited
      if (subscription.applyLimit === Infinity) {
        allowedLimit = Infinity;
      } else {
        allowedLimit = subscription.applyLimit;
      }

      // ✅ LIMIT CHECK
      if (
        allowedLimit !== Infinity &&
        subscription.applicationsUsed >= allowedLimit
      ) {
        return res.status(403).json({
          message: "Application limit reached. Upgrade your plan.",
        });
      }

      // ✅ increase usage count
      subscription.applicationsUsed += 1;
      await subscription.save();
    }
    // ===============================================================

    let resumeId = null;

    // 🔥 AUTO-ATTACH LOGIC (UNCHANGED)
    const resumeDoc = await Resume.findOne({ uid: user.uid });

    const applicationData = new application({
      company,
      category,
      coverLetter,
      user,
      Application,
      resume: resumeDoc ? resumeDoc._id : null,
    });

    const savedApplication = await applicationData.save();

    res.status(201).json({
      message: "Application submitted successfully",
      autoResumeAttached: !!resumeId,
      application: savedApplication,
    });

  } catch (error) {
    console.error("Application create error:", error);
    res.status(500).json({ message: "Failed to apply" });
  }
});


// =================== YOUR EXISTING ROUTES (UNCHANGED) ===================

router.get("/", async (req, res) => {
  try {
    const data = await application
      .find()
      .populate("resume")
      .sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (error) {
    console.error("Admin application fetch error:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await application
      .findById(id)
      .populate("resume");

    if (!data) {
      return res.status(404).json({ error: "application not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  let status;
  if (action === "approved") {
    status = "approved";
  } else if (action === "rejected") {
    status = "rejected";
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    const updateapplication = await application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updateapplication) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ success: true, data: updateapplication });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/auto-attach-resume", async (req, res) => {
  try {
    const { uid } = req.body;

    const resume = await Resume.findOne({ uid });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({
      message: "Resume will be auto-attached to applications",
      resumeId: resume._id
    });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

module.exports = router;
