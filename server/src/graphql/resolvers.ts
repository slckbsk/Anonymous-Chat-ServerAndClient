import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 3);
import pubSub from "./pubSub.js";

const messages = [];
const users = [];
const subscribers = [];
const onMessagesUpdate = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    messages: () => messages,
    users: () => users,
    user: (parent, { id }) => {
      const idExists = users.find((user) => user.id === id);
      return idExists ? idExists : new Error("USER ID NOT FOUND");
    },
  },

  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
      });
      subscribers.forEach((fn) => fn());
      return id;
    },

    createUser: (parent, { input }) => {
      if (input.trim() === "" || input.trim === null) {
        const error = new Error("PLEASE ENTER YOUR PROPER NICKNAME");
        throw error;
      }

      const nameExists = users.some((user) => user.name === input);

      if (nameExists) {
        const error = new Error("USER ALREADY EXISTS");
        throw error;
      }

      const user = {
        id: parseInt(nanoid()),
        name: input,
      };

      users.push(user);
      pubSub.publish("userCreated", { userCreated: users });
      pubSub.publish("userCount", { userCount: users.length });
      return user;
    },

    deleteUser: (parent, { id }) => {
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error("USER ID NOT FOUND");
      }

      const deletedUser = users.splice(userIndex, 1)[0];
      pubSub.publish("userCount", { userCount: users.length });
      return deletedUser;
    },

    deleteAllUsers: (_, __, ___) => {
      const length = users.length;
      users.splice(0, length);
      pubSub.publish("userCount", { userCount: users.length });
      return { count: length };
    },
  },

  Subscription: {
    messages: {
      subscribe: (_, __, ___) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdate(() => pubSub.publish(channel, { messages }));
        setTimeout(() => pubSub.publish(channel, { messages }), 0);
        return pubSub.asyncIterator(channel);
      },
    },

    userCreated: {
      subscribe: () => pubSub.asyncIterator("userCreated"),
    },

    userCount: {
      subscribe: () => {
        setTimeout(() => {
          pubSub.publish("userCount", { userCount: users.length });
          pubSub.publish("userCreated", { userCreated: users });
        });
        return pubSub.asyncIterator("userCount");
      },
    },
  },
};

export default resolvers;
