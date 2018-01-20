const User = require("../models/user");

const resolvers = {

  Query: {
    hello(root, args) {
      return ["Hello", args.who, "!"].join(" ");
    },
    user() {
      return {};
    },
  },

  UserQuery: {
    list(root, args) {
      return User.fetchAll();
    },
    getById(root, args, context) {
      return context.dataloaders.userLoader.load(args.id);
    },
  },

  User: {
    id(user) {
      return user._id.toString();
    },
    name(user) {
      return user.name;
    },
    email(user) {
      return user.email;
    },
  },

  Mutation: {
    user() {
      return {};
    }
  },

  UserMutation: {
    createUser(root, args) {
      let user = new User({name: args.name, email: args.email});
      return user.save().then(_user => {
        console.log("Inserted user", _user);
        return _user;
      });
    },
  },
};

module.exports = resolvers;