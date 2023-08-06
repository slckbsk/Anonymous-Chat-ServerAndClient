const typeDefs = `

type Message {
id: ID!
user: String!
content: String!
}

type User {
id: Int!
name: String!
}

input CreateUserInput {
  name: String!
}

type DeleteAllOutPut {
  count: Int!
}

type Query {
  messages: [Message]
  users: [User]
  user(id: Int!): User!
}

type Subscription {
  messages: [Message]
  userCreated:[User]
  userCount: Int!
}

type Mutation {
    postMessage(user: String!, content: String!):ID!
    createUser(input:String!): User!
    deleteUser(id: Int!): User!
    deleteAllUsers: DeleteAllOutPut!
}

`;
export default typeDefs;
// createUser(input:CreateUserInput!): User!
