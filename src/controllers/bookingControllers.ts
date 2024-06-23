import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(_req: express.Request, res: express.Response) {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Unable to get bookings", message: error });
  }
}

async function show(req: express.Request, res: express.Response) {
  try {
    const { locationSlug } = req.params;

    const location = await prisma.location.findUnique({
      where: {
        slug: locationSlug,
      },
      include: {
        overviewInfoTexts: true,
        rooms: {
          include: {
            bookings: true,
          },
        },
      },
    });

    if (!location) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: "Unable to get location" });
  } finally {
    await prisma.$disconnect();
  }
}

export { index, show };
