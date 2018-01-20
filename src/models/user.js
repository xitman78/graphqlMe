const mongoose = require("mongoose");
const ObjectID = require("mongoose").Types.ObjectId;

const userSchema = mongoose.Schema({
  name: String,
  email: String,
});

userSchema.index({ name: 1});

const User = mongoose.model("User", userSchema);

User.batchFetch = function(keys) {
  return this.find({_id: {$in: keys.map(key => ObjectID(key))}}).exec();
};

User.fetchAll = function() {
  return this.find({}).exec();
};

module.exports = User;