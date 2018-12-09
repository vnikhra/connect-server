import Bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Username already exists !!!"
        },
        allowNull: {
          args: false,
          msg: "Username cannot be empty"
        },
        validate: {
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
        allowNull: {
          args: false,
          msg: "Email cannot be empty"
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Email cannot be empty"
          },
          isEmail: {
            args: true,
            msg: "Not a valid Email"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: "Password cannot be empty"
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Password cannot be empty"
          },
          len: {
            args: [5, 100],
            msg: "Password must be between 5 to 100 characters"
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          user.password = await Bcrypt.hash(user.password, 12);
        }
      }
    }
  );

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
