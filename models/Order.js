import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const Decimal128 = mongoose.Schema.Types.Decimal128;

const orderSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },

    items: [
      {
        product: { type: ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price_at_purchase: { type: Decimal128, required: true },
      }
    ],

    total_amount: { type: Decimal128, required: true },

    shipping_address: {
      type: ObjectId,
      ref: "Address",
      required: true,
    },

    payment_details: {
      type: ObjectId,
      ref: "PaymentMethod",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
