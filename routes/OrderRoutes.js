import express from "express";
import { getOrders, getOrder, getUserOrders, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrder);
router.get("/user/:userId", getUserOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;