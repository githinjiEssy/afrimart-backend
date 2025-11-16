import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: ["mpesa", "card", "paypal"],
      required: true,
    },

    // Mpesa
    phone_number: { type: String },

    // Card
    card_holder: { type: String },
    last_four: { type: String },
    card_token: { type: String },     // encrypted or tokenized card data
    expiry: { type: String },

    // PayPal
    paypal_email: { type: String },

    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentMethod", paymentMethodSchema, "payment_methods");
