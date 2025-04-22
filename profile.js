const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  name: { type: String, default: "" },
  username: { type: String, default: "" },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
});

module.exports = mongoose.model("Profile", ProfileSchema);