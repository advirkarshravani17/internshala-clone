const mongoose = require("mongoose");

const Applicationipschema = new mongoose.Schema({
  company: String,
  category: String,
  coverLetter: String,

  user: Object,

  // ✅ NEW (auto-attached resume)
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    default: null,
  },

  Application: Object,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Application", Applicationipschema);
