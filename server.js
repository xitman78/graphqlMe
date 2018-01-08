
const koa = require('koa'); // koa@2
const koaRouter = require('koa-router');
const koaBody =require ('koa-bodyparser');
const graphqlKoa = require('apollo-server-koa').graphqlKoa;
const graphiqlKoa = require('apollo-server-koa').graphiqlKoa;
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = [`
type Query {
  hello: String
}

schema {
  query: Query
}`];

const resolvers = {
  Query: {
    hello(root) {
      return 'world';
    }
  }
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
app.listen(PORT);