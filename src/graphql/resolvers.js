const User = require("../models/user");
const {pubsub} = require("./socket");
const { withFilter } = require("graphql-subscriptions");

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
      return User.createNew({name: args.name, email: args.email}).then((user) => {
        console.log("User created - publish subscription");
        pubsub.publish("userAdded", { userAdded: user });
        return user;
      });
    },
  },

  Subscription: {
    userAdded: {
      resolve: (payload) => {
        console.log("rrrrresolver--");
        return payload;
      },

      subscribe: () => {
        // const currentUserId = getUserId(ctx)
        // return pubSub.asyncIterator(`messageAdded-${currentUserId}`)
        console.log("Register async iterator");
        return pubsub.asyncIterator("userAdded");
      },
    },
  },

};

module.exports = resolvers;