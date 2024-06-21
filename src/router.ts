import express from "express";
import hello from "./api/v1/hello.route";
import bookings from "./api/v1/bookings.route";

const apiRoutes = express.Router();
apiRoutes.use("/hello", hello);
apiRoutes.use("/bookings", bookings);

export default apiRoutes;
