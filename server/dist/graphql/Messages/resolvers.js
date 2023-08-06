import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 3);
import pubSub from "../pubSub.js";
const messages = [];
const user = [];
const subscribers = [];
const onMessagesUpdate = (fn) => subscribers.push(fn);
const resolvers = {
    Query: {
        messages: () => messages,
        user: () => user,
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
        login: (parent, args, { name }) => {
            user.push({
                id: nanoid(),
                name,
            });
            subscribers.forEach((fn) => fn());
        },
    },
    Subscription: {
        messages: {
            subscribe: (parent, args) => {
                const channel = Math.random().toString(36).slice(2, 15);
                onMessagesUpdate(() => pubSub.publish(channel, { messages }));
                setTimeout(() => pubSub.publish(channel, { messages }), 0);
                return pubSub.asyncIterator(channel);
            },
        },
    },
    userCreated: {
        subscribe: () => pubSub.asyncIterator("userCreated"),
    },
};
export default resolvers;
