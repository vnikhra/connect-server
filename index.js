import models from "./models";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { ApolloServer, gql } from "apollo-server";

const SECRET = "ahdwkhdh21eh2rkjfh2ih432ytr8ufhw";
const SECRET2 = "l73973;qkd;qkfd;qjk'1i291iqfkcoekflwejf;l";

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
    },
    SECRET,
    SECRET2
  }
});

models.sequelize.sync().then(() => {
  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
