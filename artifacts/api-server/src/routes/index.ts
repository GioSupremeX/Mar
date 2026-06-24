import { Router, type IRouter } from "express";
import healthRouter from "./health";
import guestbookRouter from "./guestbook";
import adminRouter from "./admin";
import artworksRouter from "./artworks";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(artworksRouter);
router.use(settingsRouter);
router.use(guestbookRouter);

export default router;
