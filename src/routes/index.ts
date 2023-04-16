import { Router } from "express";
import AuthRoutes from "./auth.routes";
import UserRoutes from "./user.routes"
var router = Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);

export default router;
