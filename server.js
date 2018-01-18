
const koa = require('koa'); // koa@2
const koaRouter = require('koa-router');
const koaBody =require ('koa-bodyparser');
const graphqlKoa = require('apollo-server-koa').graphqlKoa;
const graphiqlKoa = require('apollo-server-koa').graphiqlKoa;
const mongoose = require('mongoose');

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
  name: String
  email: String
}

type Query {
  hello(who: String!): String
  users: [User]
}

schema {
  query: Query
}`];

const resolvers = {
  Query: {
    hello(root, args) {
      return ['Hello', args.who, '!'].join(' ');
    },
    users(root, args) {
        return User.find({}).exec().then(users => {
          console.log("Fetched users", users);
          return users;
        });
    },
  },
  User: {
    name(user) {
      console.log("name resolver", arguments);
      return user.name;
    },
    email(user) {
      return user.email;
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