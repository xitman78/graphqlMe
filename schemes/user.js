const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
});

userSchema.index({ name: 1});

const User = mongoose.model("User", userSchema);

module.exports = User;