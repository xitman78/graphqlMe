
const koa = require("koa"); // koa@2
const koaRouter = require("koa-router");
const koaBody =require ("koa-bodyparser");
const graphqlKoa = require("apollo-server-koa").graphqlKoa;
const graphiqlKoa = require("apollo-server-koa").graphiqlKoa;
const mongoose = require("mongoose");
const { execute, subscribe } = require("graphql");
const buildDataloaders = require("./dataloader");
const cors = require("koa-cors");
const { createServer } = require("http");
const { SubscriptionServer } =  require("subscriptions-transport-ws");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");

mongoose.connect("mongodb://localhost/gql-test");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("DB connected");
});

const { makeExecutableSchema } = require("graphql-tools");

const myGraphQLSchema = makeExecutableSchema({typeDefs, resolvers});

const app = new koa();
const router = new koaRouter();
const PORT = 3030;

app.use(cors());
app.use(koaBody());

const gqlRoute = (ctx, next) => graphqlKoa({
  schema: myGraphQLSchema,
  rootValue: {
    ctx,
  },
  context: {
    dataloaders: buildDataloaders(),
  },
})(ctx, next);

// koaBody is needed just for POST.
router.post("/graphql", gqlRoute);
router.get("/graphql", gqlRoute);

const graphRoute = graphiqlKoa({
  endpointURL: "/graphql", // a POST endpoint that GraphiQL will make the actual requests to
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
});

router.get("/graphiql", graphRoute);

app.use(router.routes()).use(router.allowedMethods());

const ws = createServer(app.callback());

ws.listen(PORT, () => {
  console.log("Listeing on port " + PORT);

  new SubscriptionServer({
    execute,
    subscribe,
    schema: myGraphQLSchema,
    onConnect: () => {console.log("On Connect ----");},
    onUnsubscribe: (a, b) => {
      console.log('Unsubscribing');
    },
    onDisconnect: (a, b) => {
      console.log('Disconnecting');
    },
  }, {
    server: ws,
    path: "/subscriptions",
  });

});