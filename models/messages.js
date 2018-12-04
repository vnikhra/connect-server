export default (sequelize, DataTypes) => {
  const Messages = sequelize.define("messages", {
    message: {
      type: DataTypes.STRING
    }
  });

  Messages.associate = models => {
    Messages.belongsTo(models.User, {
      foreignKey: "userId"
    });
    Messages.belongsTo(models.Channel, {
      foreignKey: "channelId"
    });
  };

  return Messages;
};
