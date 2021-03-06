import { formatErrors } from "../utils/formatErrors";
import { requiresAuth } from "../utils/permissions";

export default {
  Query: {
    allTeams: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    ),
    invitedTeams: requiresAuth.createResolver(
      (parent, args, { models, user }) =>
        models.sequelize.query(
          "select * from teams join members on id = teamId where userId = ?",
          {
            replacements: [user.id],
            model: models.Team
          }
        )
    )
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({ ...args, owner: user.id });
            await models.Channel.create({ name: "general", teamId: team.id });
            await models.Channel.create({
              name: "announcements",
              teamId: team.id
            });
            return team;
          });
          return {
            ok: true,
            team: response
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err, models)
          };
        }
      }
    ),
    addTeamMember: requiresAuth.createResolver(
      async (parent, { email, teamId }, { models, user }) => {
        try {
          const teamPromise = models.Team.findOne(
            { where: { id: teamId } },
            { raw: true }
          );
          const userToAddPromise = models.User.findOne(
            { where: { email } },
            { raw: true }
          );
          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise
          ]);
          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "You cannot add members to this team "
                }
              ]
            };
          }
          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "Could not find user with this email."
                }
              ]
            };
          }
          await models.Member.create({ userId: userToAdd.id, teamId });
          return {
            ok: true
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err, models)
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
