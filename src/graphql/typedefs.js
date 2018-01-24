
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

type Subscription {
  userAdded: User
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

`];

module.exports = typeDefs;