import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minlength: [3, "First Name must be at least 3 characters long"],
      maxlength: [50, "First Name must be at most 50 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
      minlength: [3, "Last Name must be at least 3 characters long"],
      maxlength: [50, "Last Name must be at most 50 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    exams: [
      {
        examName: {
          type: String,
          required: true,
          trim: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
        totalScore: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function (next)  {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;
