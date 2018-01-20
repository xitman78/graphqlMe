
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
}

`];

module.exports = typeDefs;