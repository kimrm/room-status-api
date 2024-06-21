import { Router } from "express";
const router = Router();

router.route("/").get((_req, res) => res.send("Hello world"));

export default router;
