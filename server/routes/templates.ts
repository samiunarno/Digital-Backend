import express from "express";
import { getTemplates, createTemplate, deleteTemplate } from "../controllers/templatesController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all template routes
router.use(protect);

router.get("/", getTemplates);
router.post("/", createTemplate);
router.delete("/:id", deleteTemplate);

export default router;
