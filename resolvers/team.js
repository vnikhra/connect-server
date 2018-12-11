import { formatErrors } from "../utils/formatErrors";
import { requiresAuth } from "../utils/permissions";

export default {
  Query: {
    allTeams: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    )
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const team = await models.Team.create({ ...args, owner: user.id });
          await models.Channel.create({name : "general", teamId: team.id});
          await models.Channel.create({name : "announcements", teamId: team.id});
          return {
            ok: true,
            team
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err)
          };
        }
      }
    )
  },
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } })
  }
};
