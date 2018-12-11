export default (sequelize, DataTypes) => {
  const Channel = sequelize.define("channel", {
    name: {
      type: DataTypes.STRING
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Channel.associate = models => {
    Channel.belongsTo(models.Team, {
      foreignKey: "teamId"
    });
    Channel.belongsToMany(models.User, {
      through: models.ChannelMember,
      foreignKey: "channelId"
    });
  };

  return Channel;
};
