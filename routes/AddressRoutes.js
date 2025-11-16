import express from "express";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  updateAddress,
  setDefaultAddress
} from "../controllers/addressController.js";

const router = express.Router();


router.get("/", getAddresses);
router.post("/", createAddress);
router.patch("/:id", updateAddress);
router.patch("/:id/default", setDefaultAddress);
router.delete("/:id", deleteAddress);

export default router;