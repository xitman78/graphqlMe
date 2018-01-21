const mongoose = require("mongoose");
const ObjectID = require("mongoose").Types.ObjectId;

const userSchema = mongoose.Schema({
  name: String,
  email: String,
});

userSchema.index({ name: 1}).index({email: 1}, { unique: true });

const User = mongoose.model("User", userSchema);

User.batchFetch = function(keys) {
  return this.find({_id: {$in: keys.map(key => ObjectID(key))}}).exec();
};

User.fetchAll = function() {
  return this.find({}).exec();
};

User.createNew = function(args) {
  let user = new User({name: args.name, email: args.email});
  return user.save();
};

module.exports = User;