import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(req: express.Request, res: express.Response) {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (error) {
    console.error("Error getting locations:", error);
    res.status(500).json({ error: "Unable to get locations" });
  } finally {
    await prisma.$disconnect();
  }
}

export { index };
