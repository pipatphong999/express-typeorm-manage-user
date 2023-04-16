import { UserController } from "../controllers/user.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";
var router = require("express").Router();

const userController: UserController = new UserController();
const authMiddleWare: AuthMiddleWare = new AuthMiddleWare();
const verifyToken = authMiddleWare.verifyToken;

router.get("/", verifyToken, userController.getProfile.bind(userController));

export default router;