import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  subscription Messages {
    messages {
      id
      user
      content
    }
  }
`;

export const GET_USERS_SUB = gql`
  subscription UserCreated {
    userCreated {
      id
      name
    }
  }
`;


export const USERS_COUNT = gql`
  subscription Subscription {
    userCount
  }
`;





export const GET_USERS = gql`
  query Users {
    users {
      id
      name
    }
  }
`;

export const POST_MESSAGES = gql`
  mutation PostMessage($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

export const LOGIN_MUTATION = gql`
  mutation CreateUser($input: String!) {
    createUser(input: $input) {
      id
      name
    }
  }
`;
