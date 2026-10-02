module.exports = (sequelize, DataTypes) => {
  const GymSubscription = sequelize.define(
    "GymSubscription",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      planCode: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM("TRIALING", "ACTIVE", "PAST_DUE", "CANCELLED", "EXPIRED"),
        allowNull: false,
        defaultValue: "TRIALING",
      },
      trialEndsAt: DataTypes.DATE,
      currentPeriodStart: DataTypes.DATE,
      currentPeriodEnd: DataTypes.DATE,
      cancelAtPeriodEnd: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      billingProvider: DataTypes.STRING,
      providerCustomerId: DataTypes.STRING,
      providerSubscriptionId: DataTypes.STRING,
    },
    {
      tableName: "GymSubscription",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [{ unique: true, fields: ["gymId", "id"] }],
    },
  );

  GymSubscription.associate = (models) => {
    GymSubscription.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
    GymSubscription.hasMany(models.Billing, {
      foreignKey: "gymSubscriptionId",
      as: "billingRecords",
    });
  };

  return GymSubscription;
};
