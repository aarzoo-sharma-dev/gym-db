module.exports = (sequelize, DataTypes) => {
  const BroadcastDelivery = sequelize.define(
    "BroadcastDelivery",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      broadcastId: { type: DataTypes.STRING(36), allowNull: false },
      userId: DataTypes.STRING(36),
      recipient: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM("PENDING", "SENT", "DELIVERED", "FAILED", "SKIPPED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      providerMessageId: DataTypes.STRING,
      error: DataTypes.TEXT,
      sentAt: DataTypes.DATE,
    },
    {
      tableName: "BroadcastDelivery",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [{ fields: ["broadcastId", "status"] }],
    },
  );

  BroadcastDelivery.associate = (models) => {
    BroadcastDelivery.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
    BroadcastDelivery.belongsTo(models.Broadcast, { foreignKey: "broadcastId", as: "broadcast" });
    BroadcastDelivery.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return BroadcastDelivery;
};
