import {formatErrors} from '../utils/formatErrors';
import { requiresAuth } from "../utils/permissions";

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver( async (parent, args, { models, user }) => {
      try {
        const team = await models.Team.findOne({where: {id: args.teamId}});
        if(team.owner !== user.id){
          return {
            ok: false,
            errors: [{
              path: "name",
              message: "You need to be the owner of the team to create channel."
            }]
          }
        }
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel: channel
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    })
  }
};
