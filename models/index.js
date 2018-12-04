"use strict";

import Sequelize from "sequelize";

const sequelize = new Sequelize("slack", "slack", "slack", {
  dialect: "mysql"
});

const models = {
  User: sequelize.import("./users"),
  Member: sequelize.import("./member"),
  Team: sequelize.import("./team"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./messages"),
  ChannelMember: sequelize.import("./channelMember")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) models[modelName].associate(models);
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
