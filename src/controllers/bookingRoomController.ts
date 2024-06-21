import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function index(req: express.Request, res: express.Response) {
  const { locationSlug, roomSlug } = req.params;

  try {
    const bookings = await prisma.location.findUnique({
      where: {
        slug: locationSlug
      },
      include: {
        rooms: {
          where: {
            slug: roomSlug
          },
          include: {
            bookings: true // Include bookings associated with each room
          }
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ error: "Unable to get bookings" });
  } finally {
    await prisma.$disconnect();
  }
}

export { index };
