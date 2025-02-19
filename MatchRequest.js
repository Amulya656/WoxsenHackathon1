const mongoose = require("mongoose");

const MatchRequestSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  feedback: {
    user1Feedback: String,
    user2Feedback: String
  }
});

module.exports = mongoose.model("MatchRequest", MatchRequestSchema);
