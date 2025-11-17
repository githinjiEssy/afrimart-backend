import express from "express";
import { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  loginUser,
  uploadProfileImage,
  removeProfileImage,
  upload
} from "../controllers/userController.js";

const router = express.Router();

// Regular routes
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Image routes
// router.post("/:id/upload-image", upload.single('profile_img'), uploadProfileImage);
// router.put("/:id/remove-image", removeProfileImage);

export default router;