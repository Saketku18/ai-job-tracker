const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  refreshToken: {
    type: String,
    default: null,
  },

  resumeText: {
    type: String,
    default: "",
  },

  resumeFileName: {
    type: String,
    default: "",
  },

  lastJobData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  lastJobDescription: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
