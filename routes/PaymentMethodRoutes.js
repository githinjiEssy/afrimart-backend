import express from "express";
import { 
  getPaymentMethods, 
  createPaymentMethod, 
  setDefaultPaymentMethod,
  deletePaymentMethod 
} from "../controllers/paymentMethodController.js";

const router = express.Router();

router.get("/", getPaymentMethods);
router.post("/", createPaymentMethod);
router.patch("/:id/default", setDefaultPaymentMethod);
router.delete("/:id", deletePaymentMethod);

export default router;