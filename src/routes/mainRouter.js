import express from "express";
import controller from "../controllers/controller.js";

const router = express.Router();

router.post("/transactions", controller.handleTransaction);

router.post("/logs", controller.handleLog);

export default router;