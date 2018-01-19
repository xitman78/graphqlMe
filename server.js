
const koa = require('koa'); // koa@2
const koaRouter = require('koa-router');
const koaBody =require ('koa-bodyparser');
const graphqlKoa = require('apollo-server-koa').graphqlKoa;
const graphiqlKoa = require('apollo-server-koa').graphiqlKoa;
const mongoose = require('mongoose');
const ObjectID = require('mongoose').Types.ObjectId

mongoose.connect('mongodb://localhost/gql-test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB connected");
});

var userSchema = mongoose.Schema({
  name: String,
  email: String,
});

userSchema.index({ name: 1, email: 1 })

var User = mongoose.model('User', userSchema);

const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = [`

type User {
  id: String
  name: String
  email: String
}

type UserQuery {
  list: [User]
  getById(id: String!): User
}

type Query {
  hello(who: String!): String
  user: UserQuery
}

type Mutation {
  user: UserMutation
}

type UserMutation {
  createUser(name: String!, email: String!): User
}

schema {
  query: Query
  mutation: Mutation
}`];

const resolvers = {

  Query: {
    hello(root, args) {
      return ['Hello', args.who, '!'].join(' ');
    },
    user() {
      return {}
    },
  },

  UserQuery: {
    list(root, args) {
      return User.find({}).exec().then(users => {
        return users;
      });
    },
    getById(root, args) {
      return User.findOne({_id: ObjectID(args.id)}).exec();
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

const myGraphQLSchema = makeExecutableSchema({typeDefs, resolvers});

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

// koaBody is needed just for POST.
app.use(koaBody());

router.post('/graphql', graphqlKoa({ schema: myGraphQLSchema }));
router.get('/graphql', graphqlKoa({ schema: myGraphQLSchema }));
router.get('/graphiql', graphiqlKoa({
    endpointURL: '/graphql' // a POST endpoint that GraphiQL will make the actual requests to
}));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
  console.log("Listeing on port " + PORT);
});