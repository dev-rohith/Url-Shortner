import { Router } from "express";
import authCtrl from "../controllers/authController.js";

const router = Router();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.get("/logout", authCtrl.logout);

router.post("/forgotPassword", authCtrl.forgotPassword);
router.patch("/resetPassword/:token", authCtrl.resetPassword);


router.patch("/updateMyPassword",authCtrl.protect, authCtrl.updatePassword);

export default router;
