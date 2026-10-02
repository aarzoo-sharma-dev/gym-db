module.exports = (sequelize, DataTypes) => {
  const Billing = sequelize.define(
    "Billing",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      gymSubscriptionId: DataTypes.STRING(36),
      invoiceNumber: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: "USD" },
      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED", "VOID"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      dueAt: DataTypes.DATE,
      paidAt: DataTypes.DATE,
      providerInvoiceId: DataTypes.STRING,
    },
    {
      tableName: "Billing",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
    },
  );

  Billing.associate = (models) => {
    Billing.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
    Billing.belongsTo(models.GymSubscription, {
      foreignKey: "gymSubscriptionId",
      as: "gymSubscription",
    });
  };

  return Billing;
};
