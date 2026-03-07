const sentOtpMail = require("../utils/sentOtpMail");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const mongoose = require("mongoose");

const User = require("../Model/User");
const LoginHistory = require("../Model/LoginHistory");
const {
  inspectRequest,
  isMobileTimeAllowed,
} = require("../utils/loginInspector");

// 🔐 TEMP OTP STORE (in-memory)
const otpStore = new Map();

/**
 * 🔁 SYNC USER + CREATE LOGIN HISTORY
 */
router.post("/sync", async (req, res) => {
  try {
    const { uid, name, email, profilePhoto } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email required" });
    }

    const { browser, os, deviceType, ipAddress } = inspectRequest(req);

    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: { uid, name, email, profilePhoto },
        $setOnInsert: { friends: [] },
      },
      { new: true, upsert: true },
    );

    // 🔒 Close ALL previous sessions
    await LoginHistory.updateMany(
      { userId: user._id, logoutTime: null },
      {
        $set: {
          logoutTime: new Date(),
          status: "AUTO_CLOSED",
        },
      },
    );

    // 📱 Mobile restriction
    if (deviceType === "Mobile" && !isMobileTimeAllowed()) {
      await LoginHistory.create({
        userId: user._id,
        ipAddress,
        browser,
        os,
        deviceType,
        status: "BLOCKED",
        reason: "Mobile access allowed only between 10 AM and 1 PM",
      });

      return res.status(403).json({
        error: "Mobile access allowed only between 10 AM and 1 PM",
      });
    }

    // 🌐 OTP only for EMAIL login
    if (req.body.loginMethod === "EMAIL") {
      const otp = crypto.randomInt(100000, 999999).toString();

      otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        userId: user._id,
        browser,
        os,
        deviceType,
        ipAddress,
      });

      await sendOtpMail(email, otp);

      await LoginHistory.create({
        userId: user._id,
        ipAddress,
        browser,
        os,
        deviceType,
        loginMethod: "OTP",
        status: "OTP_SENT",
        reason: "OTP sent for Chrome login",
      });

      return res.status(401).json({
        error: "OTP required",
        email,
      });
    }

    // ✅ Normal login
    await LoginHistory.create({
      userId: user._id,
      ipAddress,
      browser,
      os,
      deviceType,
      loginMethod: "FIREBASE",
      status: "SUCCESS",
    });

    return res.status(200).json(user);
  } catch (err) {
    console.error("SYNC ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * 🔐 VERIFY OTP
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ error: "OTP not found" });
    }

    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    otpStore.delete(email);

    await LoginHistory.findOneAndUpdate(
      {
        userId: record.userId,
        status: "OTP_SENT",
        logoutTime: null,
      },
      {
        $set: {
          status: "SUCCESS",
          loginMethod: "OTP",
        },
      },
    );

    const user = await User.findById(record.userId);
    return res.status(200).json(user);
  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 👤 Get user by UID (SAFE – FIXED)
 */
router.get("/uid/:uid", async (req, res) => {
  try {
    const param = req.params.uid;

    console.log("PROFILE UID RECEIVED:", param);

    let user;

    // ✅ Check Mongo ObjectId safely
    if (mongoose.Types.ObjectId.isValid(param)) {
      user = await User.findById(param);
    }

    // ✅ Fallback to uid
    if (!user) {
      user = await User.findOne({ uid: param });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("GET USER BY UID ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * 👥 Get all users
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ➕ Add friend
 */
router.put("/add-friend/:uid", async (req, res) => {
  const { friendUid } = req.body;

  const user = await User.findOne({ uid: req.params.uid });
  const friend = await User.findOne({ uid: friendUid });

  if (!user || !friend)
    return res.status(404).json({ error: "User not found" });

  if (!user.friends.includes(friendUid)) {
    user.friends.push(friendUid);
  }

  if (!friend.friends.includes(req.params.uid)) {
    friend.friends.push(req.params.uid);
  }

  await user.save();
  await friend.save();

  res.json({
    message: "Friend added",
    userFriends: user.friends.length,
    friendFriends: friend.friends.length,
  });
});

/**
 * ➖ Remove friend
 */
router.put("/remove-friend/:uid", async (req, res) => {
  try {
    const { friendUid } = req.body;

    const user = await User.findOne({ uid: req.params.uid });
    const friend = await User.findOne({ uid: friendUid });

    if (!user || !friend) {
      return res.status(404).json({ error: "User not found" });
    }

    user.friends = user.friends.filter((f) => f !== friendUid);
    friend.friends = friend.friends.filter((f) => f !== req.params.uid);

    await user.save();
    await friend.save();

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error("REMOVE FRIEND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
// routes/user.js
router.post("/save-resume", async (req, res) => {
  const { uid, resumeId } = req.body;

  const user = await User.findOneAndUpdate(
    { uid },
    { resume: resumeId },
    { new: true }
  );

  res.json({ message: "Resume saved to profile", user });
});


router.post("/auto-attach-resume", async (req, res) => {
  const { uid } = req.body;

  await User.findOneAndUpdate(
    { uid },
    { autoAttachResume: true }
  );

  res.json({ message: "Auto attach enabled" });
});
                                            
//  * 🇫🇷 SEND OTP FOR FRENCH LANGUAGE SWITCH (FIRST TIME ONLY)
//  */
/**
 * 🇫🇷 SEND OTP FOR FRENCH LANGUAGE SWITCH (FIRST TIME ONLY)
 */
router.post("/send-french-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.frenchOtp = otp;
    user.frenchOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // ✅ USE YOUR EXISTING MAIL FUNCTION
    await sentOtpMail(email, otp, "french");

    console.log("French OTP sent:", otp);

    return res.status(200).json({
      success: true,
      message: "French OTP sent successfully",
    });

  } catch (error) {
    console.error("FRENCH OTP ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});
/**
 * 🇫🇷 VERIFY FRENCH OTP
 */
router.post("/verify-french-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.frenchOtp) {
      return res.status(400).json({ error: "Invalid request" });
    }

    if (user.frenchOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.frenchOtpExpiry < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // ✅ VERY IMPORTANT PART
    user.frenchLanguageVerified = true;
    user.frenchOtp = null;
    user.frenchOtpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "French verified",
    });

  } catch (error) {
    console.error("VERIFY FRENCH OTP ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
