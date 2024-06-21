import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(req: express.Request, res: express.Response) {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (error) {
    console.error("Error getting rooms:", error);
    res.status(500).json({ error: "Unable to get rooms" });
  } finally {
    await prisma.$disconnect();
  }
}

export { index };
