import { Router, type IRouter } from "express";
import healthRouter from "./health";
import guestbookRouter from "./guestbook";

const router: IRouter = Router();

router.use(healthRouter);
router.use(guestbookRouter);

export default router;
