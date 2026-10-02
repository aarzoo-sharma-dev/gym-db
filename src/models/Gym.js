module.exports = (sequelize, DataTypes) => {
  const Gym = sequelize.define(
    "Gym",
    {
      gymName: { type: DataTypes.STRING, allowNull: false },
      subdomain: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: DataTypes.STRING,
      alternatePhoneNumber: DataTypes.STRING,
      googleMapLink: DataTypes.STRING,
      district: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      attributes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: { isWhatsAppActive: false, ui: { mode: "common" } },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Gym",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
    },
  );

  Gym.associate = (models) => {
    Gym.hasMany(models.User, {
      foreignKey: "gymId",
      as: "users",
    });

    Gym.hasMany(models.GymSubscription, {
      foreignKey: "gymId",
      as: "subscriptions",
    });

    Gym.hasMany(models.MembershipPlan, { foreignKey: "gymId", as: "membershipPlans" });
    Gym.hasMany(models.DiscountPlan, { foreignKey: "gymId", as: "discountPlans" });
    Gym.hasMany(models.Subscription, { foreignKey: "gymId", as: "memberSubscriptions" });
    Gym.hasMany(models.Payment, { foreignKey: "gymId", as: "payments" });
    Gym.hasMany(models.Billing, { foreignKey: "gymId", as: "billingRecords" });
    Gym.hasMany(models.Broadcast, { foreignKey: "gymId", as: "broadcasts" });
  };

  return Gym;
};
