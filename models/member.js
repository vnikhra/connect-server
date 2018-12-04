export default (sequelize, DataTypes) => {
  const Member = sequelize.define("member", {});

  Member.associate = models => {};

  return Member;
};
