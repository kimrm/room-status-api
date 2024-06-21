import { Router } from "express";
import * as bookingController from "../../controllers/bookingControllers";
import * as bookingRoomController from "../../controllers/bookingRoomController";

const router = Router();

router.get("/", bookingController.index);
router.get("/:locationSlug", bookingController.show);
router.get("/:locationSlug/:roomSlug", bookingRoomController.index);

export default router;
