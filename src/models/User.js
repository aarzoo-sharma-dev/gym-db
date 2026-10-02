module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      gender: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      dob: DataTypes.DATEONLY,
      gymId: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      userRole: {
        type: DataTypes.ENUM("0", "1", "2", "3", "4"),
        // 0: Super Admin, 1: Admin, 2: Trainer, 3: Member, 4: Guest
        defaultValue: "3",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "User",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [
        { unique: true, fields: ["gymId", "email"] },
        { unique: true, fields: ["email"], where: { gymId: null } },
        { unique: true, fields: ["gymId", "id"] },
      ],
    },
  );

  User.associate = (models) => {
    User.belongsTo(models.Gym, {
      foreignKey: "gymId",
      as: "gym",
    });
    User.hasMany(models.Subscription, { foreignKey: "userId", as: "subscriptions" });
    User.hasMany(models.Payment, { foreignKey: "userId", as: "payments" });
    User.hasMany(models.Broadcast, { foreignKey: "createdByUserId", as: "createdBroadcasts" });
    User.hasMany(models.BroadcastDelivery, { foreignKey: "userId", as: "broadcastDeliveries" });
  };

  return User;
};
