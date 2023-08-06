const typeDefs = `

type Message {
id: ID!
user: String!
content: String!
}

type User {
id: ID!
name: String!
}

type Query {
  messages: [Message]
}

type Subscription {
  messages: [Message]
  userCreated: User!
}

input CreateUserInput {
  username: String!
}

type Mutation {
    postMessage(user: String!, content: String!):ID!
    createUser(data: CreateUserInput!): User!
  
}

`;
export default typeDefs;
