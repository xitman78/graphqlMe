
const koa = require("koa"); // koa@2
const koaRouter = require("koa-router");
const koaBody =require ("koa-bodyparser");
const graphqlKoa = require("apollo-server-koa").graphqlKoa;
const graphiqlKoa = require("apollo-server-koa").graphiqlKoa;
const mongoose = require("mongoose");
const buildDataloaders = require("./dataloader");
const cors = require("koa-cors");

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

const gqlScheme = graphqlKoa(req => {
  return {
    schema: myGraphQLSchema,
    context: {
      dataloaders: buildDataloaders(),
    },
  };
});

// koaBody is needed just for POST.
router.post("/graphql", gqlScheme);
router.get("/graphql", gqlScheme);
router.get("/graphiql", graphiqlKoa({
  endpointURL: "/graphql" // a POST endpoint that GraphiQL will make the actual requests to
}));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
  console.log("Listeing on port " + PORT);
});