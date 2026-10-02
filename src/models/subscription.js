module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM("ACTIVE", "EXPIRED", "CANCELLED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
      userId: { type: DataTypes.STRING(36), allowNull: false },
      planId: { type: DataTypes.STRING(36), allowNull: false },
      discountPlanId: DataTypes.STRING(36),
      paymentId: DataTypes.STRING(36),
      reminderSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expiredSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Subscription",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ["gymId", "userId"] },
        { fields: ["gymId", "endDate", "status"] },
      ],
    },
  );

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Subscription.belongsTo(models.MembershipPlan, {
      foreignKey: "planId",
      as: "plan",
    });
    Subscription.belongsTo(models.DiscountPlan, {
      foreignKey: "discountPlanId",
      as: "discountPlan",
    });
    Subscription.belongsTo(models.Payment, {
      foreignKey: "paymentId",
      as: "payment",
    });
    Subscription.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
  };

  return Subscription;
};
