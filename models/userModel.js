import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    confirm_password: {
      type: String,
    },
    image: {
      type: String,
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationCode: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordCode: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
