module.exports = (sequelize, Datatype) => {
  const User = sequelize.define("User", {
    id: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Datatype.STRING,
      allowNull: false,
    },
    email: {
      type: Datatype.STRING,
      allowNull: false,
    },
    phone: {
      type: Datatype.INTEGER,
      allowNull: false,
    },
    password: {
      type: Datatype.STRING,
      allowNull: false,
    },
    token: {
      type: Datatype.STRING,
      allowNull: true,
      defaultValue: "",
    },
    isActive: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    activationCode: {
      type: Datatype.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: Datatype.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  })
  return User
}
