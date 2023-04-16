// const { verifySignUp } = require("../middleware");
// const controller = require("../controllers/AuthController");
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleWare } from "../middlewares/auth.middleware";
var router = require("express").Router();

const authController: AuthController = new AuthController();
const authMiddleWare: AuthMiddleWare = new AuthMiddleWare();
const verifyToken = authMiddleWare.verifyToken;

router.post("/signup", authController.signup.bind(authController));
router.post("/signin", authController.signin.bind(authController));
router.delete("/signout", verifyToken, authController.signout.bind(authController));
router.post("/refreshToken", authController.refreshToken.bind(authController));

export default router;
