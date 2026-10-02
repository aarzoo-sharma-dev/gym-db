module.exports = (sequelize, DataTypes) => {
  const DiscountPlan = sequelize.define(
    "DiscountPlan",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      discountType: {
        type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
        allowNull: false,
      },
      discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      maxDiscountAmount: DataTypes.DECIMAL(10, 2),
      minOrderAmount: DataTypes.DECIMAL(10, 2),
      validFrom: { type: DataTypes.DATE, allowNull: false },
      validTill: { type: DataTypes.DATE, allowNull: false },
      usageLimit: DataTypes.INTEGER,
      usedCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isOneTime: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      tableName: "DiscountPlan",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [{ unique: true, fields: ["gymId", "id"] }],
    },
  );

  DiscountPlan.associate = (models) => {
    DiscountPlan.hasMany(models.Subscription, { foreignKey: "discountPlanId", as: "subscriptions" });
    DiscountPlan.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
  };

  return DiscountPlan;
};
