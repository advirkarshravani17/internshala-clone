const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true }, // firebase uid
    name: String,
    email: { type: String, unique: true },
    profilePhoto: String,
    friends: { type: [String], default: [] },
    resume: {type: mongoose.Schema.Types.ObjectId,ref: "Resume"},
    autoAttachResume: { type: Boolean, default: false },
   frenchLanguageVerified: { type: Boolean, default: false }, // ✅ NEW
    // ✅ ADD THESE TWO (VERY IMPORTANT)
    frenchOtp: { type: String },
    frenchOtpExpiry: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);