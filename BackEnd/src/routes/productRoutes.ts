import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  addMovement,
} from "../controllers/productController";

const router = Router();

// Listar todos os produtos ou de um estoque específico
router.get("/", getProducts);

// Criar produto
router.post("/", createProduct);

// Atualizar produto
router.put("/:id", updateProduct);

// Adicionar movimentação
router.post("/movement", addMovement);

export default router;
