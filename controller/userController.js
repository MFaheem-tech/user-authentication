import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import generateCode from "../utils/generateCode.js";
import sendEmail from "../utils/sendEmail.js";

export const signUp=expressAsyncHandler(async (req, res) => {
	const { name, email, password, confirm_password }=req.body;

	const userExist=await User.findOne({ email });

	if (userExist) {
		return res.status(400).json({
			success: false,
			message: "Email Not Available",
		});
	}

	if (password!==confirm_password) {
		return res.status(400).json({
			success: false,
			message: "Passwords Not Match",
		});
	}

	const { code, expiresAt }=generateCode();

	const user=await User.create({
		name,
		email,
		password,
		verificationCode: {
			code,
			expiresAt,
		},
	});

	const emailOptions={
		email: user.email,
		subject: "Email Verification Code",
		message: `
        <h2>Welcome to our ICMS College!</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for signing up. Your verification code is:</p>
        <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${code}</h3>
        <p>Please use this code to verify your email within 5 minutes.</p>
        <p>If you didn't sign up, you can ignore this email.</p>
        <p>Best regards,</p>
        <p>ICMS College</p>
      `,
	};

	await sendEmail(emailOptions);

	const token=generateToken(user._id);

	return res.status(201).json({
		success: true,
		message: `Verification OTP Send To ${user.email}`,
		user,
		token,
	});
});

export const resendVerificationCode=expressAsyncHandler(async (req, res) => {
	const userId=req.user._id;

	const user=await User.findById(userId);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User Not Found",
		});
	}

	if (user.emailVerified) {
		return res.status(400).json({
			success: false,
			message: "Email Already Verified",
		});
	}

	const { code, expiresAt }=generateCode();

	user.verificationCode={
		code,
		expiresAt,
	};

	await user.save();

	const emailOptions={
		email: user.email,
		subject: "Email Verification Code",
		message: `
      <h2>Welcome to our ICMS College!</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for signing up. Your verification code is:</p>
      <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${code}</h3>
      <p>Please use this code to verify your email within 5 minutes.</p>
      <p>If you didn't sign up, you can ignore this email.</p>
      <p>Best regards,</p>
      <p>ICMS College</p>
    `,
	};

	await sendEmail(emailOptions);

	const token=generateToken(user._id);

	return res.status(200).json({
		success: true,
		message: `A new OTP has been sent to your email (${user.email}).`,
		user,
		token,
	});
});

export const verifyEmail=expressAsyncHandler(async (req, res) => {
	const { verificationCode }=req.body;

	if (!verificationCode) {
		return res.status(401).json({
			success: false,
			message: "Please Provide OTP",
		});
	}

	if (verificationCode.length!==5) {
		return res.status(401).json({
			success: false,
			message: "Please Provide Complete OTP",
		});
	}

	const user=await User.findOne({
		"verificationCode.code": verificationCode,
	});

	if (!user) {
		return res.status(400).json({
			success: false,
			message: "Invalid OTP",
		});
	}

	if (user.verificationCode.expiresAt<Date.now()) {
		return res.status(400).json({
			success: false,
			message: "Verification Code Has Expired",
		});
	}

	if (user.emailVerified) {
		return res.status(400).json({
			success: false,
			message: "Email Already Verified",
		});
	}

	const token=generateToken(user._id);

	user.emailVerified=true;
	await user.save();

	return res.status(200).json({
		success: true,
		message: "Email Verified Successfully",
		user,
		token,
	});
});

export const signIn=expressAsyncHandler(async (req, res) => {
	const { email, password }=req.body;

	const user=await User.findOne({ email });

	if (!user) {
		return res.status(401).json({
			success: false,
			message: "User Not Found",
		});
	}

	const isPasswordMatch=await user.matchPasswords(password);

	if (!isPasswordMatch) {
		return res.status(401).json({
			success: false,
			message: "Invalid Email OR Password",
		});
	}

	const token=generateToken(user._id);

	return res.status(200).json({
		success: true,
		message: "Sign In Successfully",
		user,
		token,
	});
});

export const forgotPassword=expressAsyncHandler(async (req, res) => {
	const { email }=req.body;

	const user=await User.findOne({ email });

	if (!user) {
		return res.status(400).json({
			success: false,
			message: "User not found",
		});
	}

	const { code, expiresAt }=generateCode();

	user.forgotPasswordCode={ code, expiresAt };
	await user.save();

	const emailOptions={
		email: user.email,
		subject: "Forgot Password Verification Code",
		message: `
      <h2>Forgot Password Verification Code</h2>
      <p>Dear ${user.name},</p>
      <p>Your verification code for resetting the password is:</p>
      <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${code}</h3>
      <p>Please use this code to reset your password within 5 minutes.</p>
      <p>If you didn't request a password reset, you can ignore this email.</p>
      <p>Best regards,</p>
      <p>ICMS College</p>
    `,
	};

	await sendEmail(emailOptions);

	const token=generateToken(user._id);

	return res.status(200).json({
		success: true,
		message: `A OTP code has been sent to your email (${user.email}).`,
		user,
		token,
	});
});

export const resendForgotPasswordCode=expressAsyncHandler(
	async (req, res) => {
		const userId=req.user._id;

		const user=await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User Not Found",
			});
		}

		const { code, expiresAt }=generateCode();

		user.forgotPasswordCode={
			code,
			expiresAt,
		};

		await user.save();

		const emailOptions={
			email: user.email,
			subject: "Forgot Password Verification Code",
			message: `
      <h2>Forgot Password Verification Code</h2>
      <p>Dear ${user.name},</p>
      <p>Your verification code for resetting the password is:</p>
      <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${code}</h3>
      <p>Please use this code to reset your password within 5 minutes.</p>
      <p>If you didn't request a password reset, you can ignore this email.</p>
      <p>Best regards,</p>
      <p>ICMS College</p>
    `,
		};

		await sendEmail(emailOptions);

		const token=generateToken(user._id);

		return res.status(200).json({
			success: true,
			message: `A new OTP has sent to your email (${user.email}).`,
			token,
			user,
		});
	}
);

export const verifyCode=expressAsyncHandler(async (req, res) => {
	const { code }=req.body;

	const user=await User.findOne({
		"forgotPasswordCode.code": code,
	});

	if (!user) {
		return res.status(400).json({
			success: false,
			message: "Invalid OTP",
		});
	}

	if (user.forgotPasswordCode.expiresAt<Date.now()) {
		return res.status(400).json({
			success: false,
			message: "OTP has expired",
		});
	}

	const token=generateToken(user._id);

	return res.status(200).json({
		success: true,
		message: "OTP verified successfully",
		user,
		token,
	});
});

export const resetPassword=expressAsyncHandler(async (req, res) => {
	const { newPassword }=req.body;
	const { id }=req.params;

	const user=await User.findById(id);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	user.password=newPassword;

	user.forgotPasswordCode=undefined;

	const token=generateToken(user._id);

	await user.save();

	return res.status(200).json({
		success: true,
		message: "Password Reset Successfully",
		user,
		token,
	});
});
export const profile=expressAsyncHandler(async (req, res) => {
	const userId=req.user._id;

	const user=await User.findById(userId);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User Not Found",
		});
	}
	return res.status(200).json({
		success: true,
		user,
	});


});
