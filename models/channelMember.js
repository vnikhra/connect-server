export default (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define("channelMember", {});

  ChannelMember.associate = models => {};

  return ChannelMember;
};
