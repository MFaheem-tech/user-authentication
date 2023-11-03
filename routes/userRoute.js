import express from "express";
import {
	forgotPassword,
	profile,
	resendForgotPasswordCode,
	resendVerificationCode,
	resetPassword,
	signIn,
	signUp,
	verifyCode,
	verifyEmail,
} from "../controller/userController.js";
import {
	signInValidator,
	signUpValidator,
} from "../validators/userValidator.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter=express.Router();

userRouter.post("/signup", signUpValidator, signUp);

userRouter.post("/resend/verification/code", protect, resendVerificationCode);

userRouter.post("/verify/email", protect, verifyEmail);

userRouter.post("/signin", signInValidator, signIn);

userRouter.post("/forgot/password", forgotPassword);

userRouter.post(
	"/resend/forgot/password/code",
	protect,
	resendForgotPasswordCode
);

userRouter.post("/verify/code", protect, verifyCode);

userRouter.post("/reset/password/:id", protect, resetPassword);
userRouter.get("/profile", protect, profile);

export default userRouter;
