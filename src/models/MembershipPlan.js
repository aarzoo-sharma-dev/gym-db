module.exports = (sequelize, DataTypes) => {
  const MembershipPlan = sequelize.define(
    "MembershipPlan",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      durationDays: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: "USD" },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "MembershipPlan",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [{ unique: true, fields: ["gymId", "id"] }],
    },
  );

  MembershipPlan.associate = (models) => {
    MembershipPlan.hasMany(models.Subscription, {
      foreignKey: "planId",
      as: "subscriptions",
    });
    MembershipPlan.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
  };

  return MembershipPlan;
};
