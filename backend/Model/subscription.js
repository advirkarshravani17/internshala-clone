const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },

  plan: {
    type: String,
    enum: ["Free", "Bronze", "Silver", "Gold"],
    default: "Free",
  },

  applyLimit: Number,

  applicationsUsed: {
    type: Number,
    default: 0,
  },

  startDate: Date,
  expiryDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
