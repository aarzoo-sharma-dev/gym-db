module.exports = (sequelize, DataTypes) => {
  const Broadcast = sequelize.define(
    "Broadcast",
    {
      id: { type: DataTypes.STRING(36), defaultValue: DataTypes.UUIDV4, primaryKey: true },
      gymId: { type: DataTypes.STRING(36), allowNull: false },
      createdByUserId: DataTypes.STRING(36),
      channel: { type: DataTypes.ENUM("EMAIL", "WHATSAPP"), allowNull: false },
      subject: DataTypes.STRING,
      body: { type: DataTypes.TEXT, allowNull: false },
      status: {
        type: DataTypes.ENUM("DRAFT", "SCHEDULED", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"),
        allowNull: false,
        defaultValue: "DRAFT",
      },
      scheduledAt: DataTypes.DATE,
      sentAt: DataTypes.DATE,
    },
    {
      tableName: "Broadcast",
      schema: "gymhub",
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ["gymId", "status", "scheduledAt"] },
        { unique: true, fields: ["gymId", "id"] },
      ],
    },
  );

  Broadcast.associate = (models) => {
    Broadcast.belongsTo(models.Gym, { foreignKey: "gymId", as: "gym" });
    Broadcast.belongsTo(models.User, { foreignKey: "createdByUserId", as: "createdBy" });
    Broadcast.hasMany(models.BroadcastDelivery, { foreignKey: "broadcastId", as: "deliveries" });
  };

  return Broadcast;
};
