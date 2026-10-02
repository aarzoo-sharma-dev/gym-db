"use strict";

const schema = "gymhub";

const timestamps = (Sequelize) => ({
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  deletedAt: { allowNull: true, type: Sequelize.DATE },
});

const id = (Sequelize) => ({
  type: Sequelize.STRING,
  primaryKey: true,
  allowNull: false,
});

const tenantReference = (table) => ({
  model: { tableName: table, schema },
  key: "id",
});

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const options = { schema, transaction };

    try {
      await queryInterface.createSchema(schema, { transaction });

      await queryInterface.createTable(
        "Gym",
        {
          id: id(Sequelize),
          gymName: { type: Sequelize.STRING, allowNull: false },
          subdomain: { type: Sequelize.STRING, allowNull: false, unique: true },
          email: { type: Sequelize.STRING, allowNull: false },
          phoneNumber: { type: Sequelize.STRING, allowNull: true },
          alternatePhoneNumber: { type: Sequelize.STRING, allowNull: true },
          googleMapLink: { type: Sequelize.TEXT, allowNull: true },
          district: { type: Sequelize.STRING, allowNull: true },
          state: { type: Sequelize.STRING, allowNull: true },
          country: { type: Sequelize.STRING, allowNull: true },
          attributes: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: { isWhatsAppActive: false, ui: { mode: "common" } },
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          ...timestamps(Sequelize),
        },
        options,
      );

      await queryInterface.createTable(
        "User",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: true,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          name: { type: Sequelize.STRING, allowNull: false },
          email: { type: Sequelize.STRING, allowNull: false },
          phone: { type: Sequelize.STRING, allowNull: true },
          password: { type: Sequelize.STRING, allowNull: false },
          gender: {
            type: Sequelize.ENUM("MALE", "FEMALE", "OTHER"),
            allowNull: true,
          },
          dob: { type: Sequelize.DATEONLY, allowNull: true },
          userRole: {
            type: Sequelize.ENUM("0", "1", "2", "3", "4"),
            allowNull: false,
            defaultValue: "3",
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex("User", ["gymId", "email"], {
        ...options,
        unique: true,
        name: "user_gym_email_unique",
      });
      await queryInterface.addIndex("User", ["email"], {
        ...options,
        unique: true,
        where: { gymId: null },
        name: "platform_user_email_unique",
      });
      await queryInterface.addIndex("User", ["gymId", "id"], {
        ...options,
        unique: true,
        name: "user_gym_id_unique",
      });

      await queryInterface.createTable(
        "MembershipPlan",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          name: { type: Sequelize.STRING, allowNull: false },
          description: { type: Sequelize.TEXT, allowNull: true },
          durationDays: { type: Sequelize.INTEGER, allowNull: false },
          price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          currency: {
            type: Sequelize.STRING(3),
            allowNull: false,
            defaultValue: "USD",
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex("MembershipPlan", ["gymId", "name"], {
        ...options,
        unique: true,
        name: "membership_plan_gym_name_unique",
      });
      await queryInterface.addIndex("MembershipPlan", ["gymId", "id"], {
        ...options,
        unique: true,
        name: "membership_plan_gym_id_unique",
      });

      await queryInterface.createTable(
        "DiscountPlan",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          code: { type: Sequelize.STRING, allowNull: false },
          name: { type: Sequelize.STRING, allowNull: false },
          description: { type: Sequelize.TEXT, allowNull: true },
          discountType: {
            type: Sequelize.ENUM("PERCENTAGE", "FIXED"),
            allowNull: false,
          },
          discountValue: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          maxDiscountAmount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
          },
          minOrderAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
          validFrom: { type: Sequelize.DATE, allowNull: false },
          validTill: { type: Sequelize.DATE, allowNull: false },
          usageLimit: { type: Sequelize.INTEGER, allowNull: true },
          usedCount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          isOneTime: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex("DiscountPlan", ["gymId", "code"], {
        ...options,
        unique: true,
        name: "discount_plan_gym_code_unique",
      });
      await queryInterface.addIndex("DiscountPlan", ["gymId", "id"], {
        ...options,
        unique: true,
        name: "discount_plan_gym_id_unique",
      });

      await queryInterface.createTable(
        "Payment",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          userId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("User"),
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          currency: {
            type: Sequelize.STRING(3),
            allowNull: false,
            defaultValue: "USD",
          },
          status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED", "FAILED", "REFUNDED"),
            allowNull: false,
            defaultValue: "PENDING",
          },
          paymentMethod: {
            type: Sequelize.ENUM(
              "CREDIT_CARD",
              "DEBIT_CARD",
              "GOOGLE_PAY",
              "BANK_TRANSFER",
              "CASH",
              "OTHER",
            ),
            allowNull: false,
          },
          providerReference: { type: Sequelize.STRING, allowNull: true },
          paidAt: { type: Sequelize.DATE, allowNull: true },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex("Payment", ["gymId", "userId"], {
        ...options,
        name: "payment_gym_user_idx",
      });
      await queryInterface.addIndex("Payment", ["gymId", "id"], {
        ...options,
        unique: true,
        name: "payment_gym_id_unique",
      });

      await queryInterface.createTable(
        "Subscription",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          userId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("User"),
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          planId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("MembershipPlan"),
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          discountPlanId: {
            type: Sequelize.STRING(36),
            allowNull: true,
            references: tenantReference("DiscountPlan"),
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          paymentId: {
            type: Sequelize.STRING(36),
            allowNull: true,
            references: tenantReference("Payment"),
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          startDate: { type: Sequelize.DATE, allowNull: false },
          endDate: { type: Sequelize.DATE, allowNull: false },
          status: {
            type: Sequelize.ENUM("ACTIVE", "EXPIRED", "CANCELLED"),
            allowNull: false,
            defaultValue: "ACTIVE",
          },
          reminderSent: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          expiredSent: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex("Subscription", ["gymId", "userId"], {
        ...options,
        name: "subscription_gym_user_idx",
      });
      await queryInterface.addIndex(
        "Subscription",
        ["gymId", "endDate", "status"],
        { ...options, name: "subscription_expiry_idx" },
      );

      await queryInterface.createTable(
        "GymSubscription",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          planCode: { type: Sequelize.STRING, allowNull: false },
          status: {
            type: Sequelize.ENUM(
              "TRIALING",
              "ACTIVE",
              "PAST_DUE",
              "CANCELLED",
              "EXPIRED",
            ),
            allowNull: false,
            defaultValue: "TRIALING",
          },
          trialEndsAt: { type: Sequelize.DATE, allowNull: true },
          currentPeriodStart: { type: Sequelize.DATE, allowNull: true },
          currentPeriodEnd: { type: Sequelize.DATE, allowNull: true },
          cancelAtPeriodEnd: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          billingProvider: { type: Sequelize.STRING, allowNull: true },
          providerCustomerId: { type: Sequelize.STRING, allowNull: true },
          providerSubscriptionId: { type: Sequelize.STRING, allowNull: true },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex("GymSubscription", ["gymId", "status"], {
        ...options,
        name: "gym_subscription_status_idx",
      });
      await queryInterface.addIndex("GymSubscription", ["gymId", "id"], {
        ...options,
        unique: true,
        name: "gym_subscription_gym_id_unique",
      });

      await queryInterface.createTable(
        "Billing",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          gymSubscriptionId: {
            type: Sequelize.STRING(36),
            allowNull: true,
            references: tenantReference("GymSubscription"),
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          invoiceNumber: { type: Sequelize.STRING, allowNull: false },
          amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          currency: {
            type: Sequelize.STRING(3),
            allowNull: false,
            defaultValue: "USD",
          },
          status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED", "FAILED", "VOID"),
            allowNull: false,
            defaultValue: "PENDING",
          },
          dueAt: { type: Sequelize.DATE, allowNull: true },
          paidAt: { type: Sequelize.DATE, allowNull: true },
          providerInvoiceId: { type: Sequelize.STRING, allowNull: true },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex("Billing", ["gymId", "invoiceNumber"], {
        ...options,
        unique: true,
        name: "billing_gym_invoice_unique",
      });

      await queryInterface.createTable(
        "Broadcast",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          createdByUserId: {
            type: Sequelize.STRING(36),
            allowNull: true,
            references: tenantReference("User"),
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          channel: {
            type: Sequelize.ENUM("EMAIL", "WHATSAPP"),
            allowNull: false,
          },
          subject: { type: Sequelize.STRING, allowNull: true },
          body: { type: Sequelize.TEXT, allowNull: false },
          status: {
            type: Sequelize.ENUM(
              "DRAFT",
              "SCHEDULED",
              "PROCESSING",
              "COMPLETED",
              "FAILED",
              "CANCELLED",
            ),
            allowNull: false,
            defaultValue: "DRAFT",
          },
          scheduledAt: { type: Sequelize.DATE, allowNull: true },
          sentAt: { type: Sequelize.DATE, allowNull: true },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex(
        "Broadcast",
        ["gymId", "status", "scheduledAt"],
        {
          ...options,
          name: "broadcast_schedule_idx",
        },
      );
      await queryInterface.addIndex("Broadcast", ["gymId", "id"], {
        ...options,
        unique: true,
        name: "broadcast_gym_id_unique",
      });

      await queryInterface.createTable(
        "BroadcastDelivery",
        {
          id: id(Sequelize),
          gymId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Gym"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          broadcastId: {
            type: Sequelize.STRING(36),
            allowNull: false,
            references: tenantReference("Broadcast"),
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          userId: {
            type: Sequelize.STRING(36),
            allowNull: true,
            references: tenantReference("User"),
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          recipient: { type: Sequelize.STRING, allowNull: false },
          status: {
            type: Sequelize.ENUM(
              "PENDING",
              "SENT",
              "DELIVERED",
              "FAILED",
              "SKIPPED",
            ),
            allowNull: false,
            defaultValue: "PENDING",
          },
          providerMessageId: { type: Sequelize.STRING, allowNull: true },
          error: { type: Sequelize.TEXT, allowNull: true },
          sentAt: { type: Sequelize.DATE, allowNull: true },
          ...timestamps(Sequelize),
        },
        options,
      );
      await queryInterface.addIndex(
        "BroadcastDelivery",
        ["broadcastId", "status"],
        {
          ...options,
          name: "broadcast_delivery_status_idx",
        },
      );

      const tenantConstraints = [
        'ALTER TABLE "gymhub"."Payment" ADD CONSTRAINT "payment_user_same_gym_fk" FOREIGN KEY ("gymId", "userId") REFERENCES "gymhub"."User" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."Subscription" ADD CONSTRAINT "subscription_user_same_gym_fk" FOREIGN KEY ("gymId", "userId") REFERENCES "gymhub"."User" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."Subscription" ADD CONSTRAINT "subscription_plan_same_gym_fk" FOREIGN KEY ("gymId", "planId") REFERENCES "gymhub"."MembershipPlan" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."Subscription" ADD CONSTRAINT "subscription_discount_same_gym_fk" FOREIGN KEY ("gymId", "discountPlanId") REFERENCES "gymhub"."DiscountPlan" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."Subscription" ADD CONSTRAINT "subscription_payment_same_gym_fk" FOREIGN KEY ("gymId", "paymentId") REFERENCES "gymhub"."Payment" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."Billing" ADD CONSTRAINT "billing_subscription_same_gym_fk" FOREIGN KEY ("gymId", "gymSubscriptionId") REFERENCES "gymhub"."GymSubscription" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."Broadcast" ADD CONSTRAINT "broadcast_creator_same_gym_fk" FOREIGN KEY ("gymId", "createdByUserId") REFERENCES "gymhub"."User" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."BroadcastDelivery" ADD CONSTRAINT "delivery_broadcast_same_gym_fk" FOREIGN KEY ("gymId", "broadcastId") REFERENCES "gymhub"."Broadcast" ("gymId", "id") ON UPDATE CASCADE',
        'ALTER TABLE "gymhub"."BroadcastDelivery" ADD CONSTRAINT "delivery_user_same_gym_fk" FOREIGN KEY ("gymId", "userId") REFERENCES "gymhub"."User" ("gymId", "id") ON UPDATE CASCADE',
      ];
      for (const sql of tenantConstraints) {
        await queryInterface.sequelize.query(sql, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    const options = { schema, transaction };

    try {
      for (const table of [
        "BroadcastDelivery",
        "Broadcast",
        "Billing",
        "GymSubscription",
        "Subscription",
        "Payment",
        "DiscountPlan",
        "MembershipPlan",
        "User",
        "Gym",
      ]) {
        await queryInterface.dropTable(table, options);
      }
      await queryInterface.dropSchema(schema, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
