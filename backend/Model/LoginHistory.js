const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  ipAddress: String,
  browser: String,
  os: String,

  deviceType: {
    type: String,
    default: "Desktop"
  },

  loginMethod: {
    type: String,
    default: "PASSWORD"
  },

  loginTime: {
    type: Date,
    default: Date.now
  },

  logoutTime: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    required: true
  },

  reason: String
});

// ❌ REMOVE THIS INDEX COMPLETELY
// loginHistorySchema.index(
//   { userId: 1, logoutTime: 1 },
//   { unique: true, partialFilterExpression: { logoutTime: null } }
// );

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
