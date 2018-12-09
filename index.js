import models from "./models";
import path from "path";
import express from "express";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { ApolloServer, gql } from "apollo-server-express";
import { addUser } from "./utils/addUser";
import cors from "cors";

export const SECRET = "ahdwkhdh21eh2rkjfh2ih432ytr8ufhw";
export const SECRET2 = "l73973;qkd;qkfd;qjk'1i291iqfkcoekflwejf;l";

const typeDefs = gql(mergeTypes(fileLoader(path.join(__dirname, "./schemas"))));

const app = express();

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

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

models.sequelize.sync().then(() => {
  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
