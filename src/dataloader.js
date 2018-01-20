const DataLoader = require("dataloader");
const ObjectID = require("mongoose").Types.ObjectId;
const User = require("../schemes/user");

function batchUsers (keys) {
  console.log("Batch users fetch", keys);
  return  User.find({_id: {$in: keys.map(key => ObjectID(key))}}).exec();
}

module.exports = () =>({
  userLoader: new DataLoader(
    keys => batchUsers(keys),
    {cacheKeyFn: key => key.toString()}
  ),
});