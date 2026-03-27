import express from "express";
import { submitContact } from "../controllers/contactController.js";
import { contactLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { contactSchema } from "../validations/contact.validation.js";

const router = express.Router();

router.post("/", contactLimiter, validate(contactSchema), submitContact);

export default router;
