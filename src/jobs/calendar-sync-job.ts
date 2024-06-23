import * as cron from "node-cron";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { PrismaClient } from "@prisma/client";
import { env } from "node:process";

async function fetchEventsForCurrentDay(calendarId: string, auth: any) {
  try {
    const calendar = google.calendar({ version: "v3", auth });

    // Get the current date and time
    const startOfDay = new Date();
    const endOfDay = new Date();

    // Set the start time to the beginning of the current day
    startOfDay.setHours(0, 0, 0, 0);

    // Set the end time to the end of the current day
    endOfDay.setHours(23, 59, 59, 999);

    const events = await calendar.events.list({
      calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
    });

    return events.data.items || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

async function createAuthClient() {
  const credentials = require(env.GOOGLE_CREDENTIALS_PATH as string);

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  try {
    await auth.authorize();
    return auth;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
}

cron.schedule("* * * * *", async () => {
  const calendarId = require(env.TMP_CALENDAR_ID as string);
  const auth = await createAuthClient();

  console.log("Syncing rooms events for today");

  const prisma = new PrismaClient();
  const rooms = await prisma.room.findMany();

  rooms.forEach(async (room) => {
    fetchEventsForCurrentDay(room.calendarId, auth)
      .then((events) => {
        events.forEach(async (event) => {
          if (event.status && event.status === "confirmed") {
            const booking = await prisma.booking.create({
              data: {
                roomId: room.id,
                description: event.summary as string,
                from: event.start?.dateTime as string | Date,
                to: event.end?.dateTime as string | Date,
                eventId: event.id as string,
              },
            });
            console.log("Created booking:", booking);
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  console.log("Synced rooms events for today");
});
