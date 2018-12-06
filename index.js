import models from "./models";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql(mergeTypes(fileLoader(path.join(__dirname, "./schemas"))));

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    user: {
      id: 1
    }
  }
});

models.sequelize.sync().then(() => {
  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
