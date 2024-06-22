import express from "express";
import cors from "cors";
// import * as bookingRoutes from "./routes/bookingRoutes";
// import * as locationRoutes from "./routes/locationRoutes";
// import * as roomRoutes from "./routes/roomRoutes";

import routes from "./router";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health-check", (req, res) => {
  res.send({ message: "Hello from the API" });
});
app.use("/api/v1", routes);

// app.use("/bookings", bookingRoutes.router);
// app.use("/room", roomRoutes.router);
// app.use("/location", locationRoutes.router);

app.use("*", (_req, res) => res.status(404).json({ error: "Not found" }));

// app.get("/", (req, res) => {
//   res.send({ message: "Hello API" });
// });

// app.get("/api-test", (req, res) => {
//   res.json({ code: "1234" });
// });

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
