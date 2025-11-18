import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String }, // OPTIONAL
    email: { type: String, required: true },
    phone: { type: String, default: null }, // OPTIONAL
    password: { type: String, required: true },
    profile_img: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
