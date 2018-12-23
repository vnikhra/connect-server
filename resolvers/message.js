import { requiresAuth } from "../utils/permissions";
import { PubSub, withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId
      )
    }
  },
  Message: {
    user: ({ userId }, args, { models }, info) => {
      const modelsToUse = models || info.rootValue.context.models;
      try {
        return modelsToUse.User.findOne({ where: { id: userId } }, { raw: true });
      } catch (err) {
        console.log(err, modelsToUse);
      }
    }
  },
  Query: {
    messages: requiresAuth.createResolver(
      async (parent, { channelId }, { models, user }) =>
        models.Message.findAll(
          { order: [["createdAt", "ASC"]], where: { channelId } },
          { raw: true }
        )
    )
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        console.log("adding message");
        try {
          const message = await models.Message.create({
            ...args,
            userId: user.id
          });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: {
              ...message.dataValues
            },
            context: { models: models }
          });

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    )
  }
};
