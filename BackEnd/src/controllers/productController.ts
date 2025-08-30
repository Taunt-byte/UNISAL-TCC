import { Request, Response } from "express";
import prisma from "../prismaClient";

// Listar produtos
export const getProducts = async (req: Request, res: Response) => {
  const { stockId } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: stockId ? { stockId: Number(stockId) } : undefined,
      include: { movements: true, stock: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

// Criar produto
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, quantity, stockId } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        quantity,
        stock: { connect: { id: Number(stockId) } },
        movements: {
          create: [
            {
              type: "entrada",
              amount: Number(quantity),
            },
          ],
        },
      },
      include: { movements: true, stock: true },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

// Atualizar produto
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, quantity } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, quantity },
      include: { movements: true, stock: true },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

// Adicionar movimentação
export const addMovement = async (req: Request, res: Response) => {
  const { productId, type, amount } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: Number(productId) },
      data: {
        quantity: type === "entrada" ? { increment: Number(amount) } : { decrement: Number(amount) },
        movements: {
          create: {
            type,
            amount: Number(amount),
          },
        },
      },
      include: { movements: true, stock: true },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar movimentação" });
  }
};
