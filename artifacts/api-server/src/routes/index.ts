import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bhashashieldRouter from "./bhashashield";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bhashashieldRouter);

export default router;
