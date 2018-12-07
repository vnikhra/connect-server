import Bcrypt from "bcrypt";
import _ from "lodash";
import { tryLogin } from "../auth";

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ["path", "message"]));
  }
  return [{ path: "User", message: "something went wrong" }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET),
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        const hashedPassword = await Bcrypt.hash(password, 12);
        const user = await models.User.create({
          ...otherArgs,
          password: hashedPassword
        });
        return {
          ok: true,
          user: user
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};
