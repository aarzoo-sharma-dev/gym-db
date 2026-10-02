module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: "USD" },
      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED", "REFUNDED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      paymentMethod: {
        type: DataTypes.ENUM(
          "CREDIT_CARD",
          "DEBIT_CARD",
          "GOOGLE_PAY",
          "BANK_TRANSFER",
          "CASH",
          "OTHER",
        ),
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      providerReference: DataTypes.STRING,
      paidAt: DataTypes.DATE,
    },
    {
      tableName: "Payment",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [{ unique: true, fields: ["gymId", "id"] }],
    },
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
    Payment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Payment.hasMany(models.Subscription, { foreignKey: "paymentId", as: "subscriptions" });
  };

  return Payment;
};
