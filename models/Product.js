import mongoose from "mongoose";

const { Decimal128 } = mongoose.Schema.Types

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 256, minlength: 10, },
    description: { type: String, required: true, maxlength: 256, minlength: 30, },
    price: { type: Decimal128, required: true, maxlength: 6, },
    discount_percentage: { type: Number, min: 0, max: 100, default: 0, },
    brand: { type: String, maxlength: 100, required: true, },
      category: {
      type: String,
      enum: ["Shoes", "Clothes", "Food", "Electronics", "Accessories", "Furniture", "Home", "Sports & Outdoors"],
      required: true,
    },
    qty: { type: Number, default: 0, },
    product_image_url: { type: String, maxlength: 256, default: null, },
    rating: { type: mongoose.Schema.Types.Decimal128, default: 0, min: 0, max: 5, },
    features: { type: [String], default: [],},
    specifications: { type: Object, default: {},},
    color: { type: [String], default: [], },
    warranty: { type: Object, default: {}, },
    deal_tag: { type: String, enum: ["Flash", "Clearance", "Deal", "Bundle"], default: null, },
    is_new: { type: Boolean, default: false, },
  },
  {
    timestamps: { createdAt: "date_created", updatedAt: false },
  }
);

export default mongoose.model("Product", productSchema);
