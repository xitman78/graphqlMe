const DataLoader = require("dataloader");
const User = require("./models/user");

function batchUsers (keys) {
  console.log("Batch users fetch", keys);
  return  User.batchFetch(keys);
}

module.exports = () =>({
  userLoader: new DataLoader(
    keys => batchUsers(keys),
    {cacheKeyFn: key => key.toString()}
  ),
});