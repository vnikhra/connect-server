export default (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Username already exists !!!"
      },
      validate: {
        notNull: {
          args: true,
          msg: "Username cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Username cannot be empty"
        },
        isAlphanumeric: {
          args: true,
          msg: "Username can be only alphabets and numbers"
        },
        len: {
          args: [3, 25],
          msg: "Username must be between 3 to 25 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email already exists !!!"
      },
      validate: {
        notNull: {
          args: true,
          msg: "Email cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Email cannot be empty"
        },
        isEmail: {
          args: true,
          msg: "Mot a valid Email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          args: true,
          msg: "Password cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Password cannot be empty"
        }
      }
    }
  });

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: "userId"
    });
    User.belongsToMany(models.Team, {
      through: models.ChannelMember,
      foreignKey: "userId"
    });
  };

  return User;
};
