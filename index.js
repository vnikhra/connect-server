import models from "./models";
import path from "path";
import express from "express";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { ApolloServer, gql } from "apollo-server-express";
import { addUser } from "./utils/addUser";
import cors from "cors";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

export const SECRET = "ahdwkhdh21eh2rkjfh2ih432ytr8ufhw";
export const SECRET2 = "l73973;qkd;qkfd;qjk'1i291iqfkcoekflwejf;l";

const typeDefs = gql(mergeTypes(fileLoader(path.join(__dirname, "./schemas"))));

const app = express();

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    models,
    user: req.user,
    SECRET,
    SECRET2
  })
});

app.use(addUser);
app.use(cors());

server.applyMiddleware({ app });

const httpServer = createServer(app);

models.sequelize.sync({ force: false }).then(() => {
  httpServer.listen(4000, () => {
    SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe
      },
      {
        server: httpServer,
        path: "/subscriptions"
      }
    );
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
});
