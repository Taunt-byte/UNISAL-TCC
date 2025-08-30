import prisma from "../prismaClient";
import { Request, Response } from "express";

export const getStocks = async (req: Request, res: Response) => {
  const stocks = await prisma.stock.findMany({ include: { products: true } });
  res.json(stocks);
};

export const createStock = async (req: Request, res: Response) => {
  const { name } = req.body;
  const stock = await prisma.stock.create({ data: { name } });
  res.json(stock);
};

export const updateStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const stock = await prisma.stock.update({ where: { id: Number(id) }, data: { name } });
  res.json(stock);
};
