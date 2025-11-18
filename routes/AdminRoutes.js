import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getCurrentAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAdminDashboardStats
} from "../controllers/adminController.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/", getAllAdmins);
router.get("/current", getCurrentAdmin);
router.get("/:id", getAdminById);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.get("/dashboard/stats", getAdminDashboardStats);

export default router;
