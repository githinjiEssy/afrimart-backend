import express from "express";
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);        // CREATE
router.put("/:id", updateProduct);      // UPDATE
router.delete("/:id", deleteProduct);   // DELETE

export default router;