import { Router } from "express";
import { getStocks, createStock, updateStock } from "../controllers/stockController";

const router = Router();

router.get("/", getStocks);
router.post("/", createStock);
router.put("/:id", updateStock);

export default router;
