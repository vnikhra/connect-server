import Bcyrpt from "bcrypt";
import _ from "lodash";

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
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        const hashedPassword = await Bcyrpt.hash(password, 12);
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
