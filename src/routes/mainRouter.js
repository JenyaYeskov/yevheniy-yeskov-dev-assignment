import express from "express";
import controller from "../controllers/controller.js";

const router = express.Router();

router.post("/transactions", controller.handleTransaction)

export default router;